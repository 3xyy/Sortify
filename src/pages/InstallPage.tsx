import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Smartphone, Zap, Leaf, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const navigate = useNavigate();

  // Check if already running as PWA and redirect to home
  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    
    if (isPWA) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error("Installation prompt not available", {
        description: "Try adding to home screen from your browser menu",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success("Sortify installed successfully!");
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: Smartphone,
      title: "Works Offline",
      description: "Access scan history even without internet",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description: "Native app-like experience",
    },
    {
      icon: Leaf,
      title: "Save the Planet",
      description: "Make recycling easier for everyone",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero pb-24 pt-16">
      <div className="px-6 max-w-md mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Download className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Install Sortify</h1>
          <p className="text-muted-foreground">
            Get the full app experience on your device
          </p>
        </div>

        <Card className="p-6 shadow-large mb-6 animate-fade-up">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            What you get
          </h2>
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {isInstallable ? (
          <Button 
            className="w-full gradient-primary" 
            size="xl"
            onClick={handleInstall}
          >
            <Download className="h-5 w-5" />
            Install Now
          </Button>
        ) : (
          <Card className="p-6 shadow-soft bg-muted/50 text-center">
            <h3 className="font-semibold mb-2">Installation Instructions</h3>
            <div className="text-sm text-muted-foreground space-y-2 text-left">
              <p><strong>Computer Browser:</strong> Click the install button in the top right of your browser</p>
              <p><strong>iOS:</strong> Open in Safari or Chrome, then tap Share → Add to Home Screen</p>
              <p><strong>Android:</strong> Tap Menu → Install App</p>
            </div>
          </Card>
        )}

        <Button 
          variant="ghost" 
          className="w-full mt-4"
          onClick={() => window.location.href = '/'}
        >
          Already installed?
        </Button>
      </div>
    </div>
  );
};

export default InstallPage;
