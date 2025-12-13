import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const updateServiceWorker = useCallback(async (reloadPage?: boolean) => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    if (reloadPage) {
      window.location.reload();
    }
  }, [registration]);

  useEffect(() => {
    // Only run in production with service worker support
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        setRegistration(reg);

        // Check for updates immediately
        reg.update();

        // Check for updates every 30 seconds
        const interval = setInterval(() => {
          reg.update();
        }, 30 * 1000);

        // Listen for new service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
              }
            });
          }
        });

        return () => clearInterval(interval);
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    };

    registerSW();
  }, []);

  useEffect(() => {
    if (needRefresh) {
      // Show brief notification then force update
      toast.loading('Updating to latest version...', {
        duration: 2000,
      });
      
      // Force update after short delay
      setTimeout(() => {
        updateServiceWorker(true);
      }, 1500);
    }
  }, [needRefresh, updateServiceWorker]);

  return { needRefresh, updateServiceWorker };
}
