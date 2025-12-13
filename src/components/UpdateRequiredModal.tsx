import { AlertTriangle, RefreshCw, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpdateRequiredModalProps {
  currentVersion: string;
  requiredVersion: string;
}

export const UpdateRequiredModal = ({ currentVersion, requiredVersion }: UpdateRequiredModalProps) => {
  const handleCheckForUpdates = () => {
    // Force reload to get latest service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }
    // Hard reload bypassing cache
    window.location.reload();
  };

  const handleReinstall = () => {
    // Clear caches and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
    // Hard reload
    setTimeout(() => {
      window.location.href = window.location.origin + '?cache_bust=' + Date.now();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">App Update Required</h1>
          <p className="text-muted-foreground">
            Your app is outdated and must be updated to continue using Sortify AI.
          </p>
        </div>

        {/* Version Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your version:</span>
            <span className="font-mono text-destructive">{currentVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Required version:</span>
            <span className="font-mono text-primary">{requiredVersion}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card border border-border rounded-lg p-4 text-left space-y-4">
          <h2 className="font-semibold text-foreground">How to Update:</h2>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Try refreshing first</p>
                <p className="text-sm text-muted-foreground">Tap the button below to check for updates</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">If that doesn't work, reinstall</p>
                <p className="text-sm text-muted-foreground">
                  Delete the app from your home screen, then visit the app URL in Safari/Chrome and tap "Add to Home Screen"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">For iOS users</p>
                <p className="text-sm text-muted-foreground">
                  Open Safari → tap Share icon → "Add to Home Screen"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleCheckForUpdates} 
            className="w-full gap-2"
            size="lg"
          >
            <RefreshCw className="w-4 h-4" />
            Check For Updates
          </Button>
          
          <Button 
            onClick={handleReinstall} 
            variant="outline" 
            className="w-full gap-2"
            size="lg"
          >
            <Download className="w-4 h-4" />
            Clear Cache & Reload
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          If you continue to see this message after updating, please wait a few minutes and try again. 
          Updates may take time to propagate.
        </p>
      </div>
    </div>
  );
};
