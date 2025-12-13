import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      // Check for updates every 60 seconds
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast('New version available!', {
        description: 'Click to update to the latest version.',
        duration: Infinity,
        action: {
          label: 'Update',
          onClick: () => {
            updateServiceWorker(true);
          },
        },
        onDismiss: () => {
          // Auto-update even if dismissed after 5 seconds
          setTimeout(() => {
            updateServiceWorker(true);
          }, 5000);
        },
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return { needRefresh, updateServiceWorker };
}
