import { ScanButton } from "@/components/ScanButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History, Settings, Sparkles, Leaf, Camera, Upload, X, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDemoMode } from "@/contexts/DemoContext";
import { useSettings } from "@/hooks/useSettings";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const Home = () => {
  const navigate = useNavigate();
  const { isDemoMode, exitDemoMode } = useDemoMode();
  const { triggerHaptic } = useSettings();
  const [showScanOptions, setShowScanOptions] = useState(false);
  const [stats, setStats] = useState({ totalScans: 0, recycled: 0, co2Saved: '0.0' });
  useSwipeNavigation();
  
  useEffect(() => {
    if (!isDemoMode) {
      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      const totalScans = history.length;
      const recycled = history.filter((scan: any) => 
        ['recycle', 'compost'].includes(scan.category)
      ).length;
      
      const totalCo2 = history.reduce((sum: number, scan: any) => {
        const match = scan.details?.co2Saved?.match(/[\d.]+/);
        return sum + (match ? parseFloat(match[0]) : 0);
      }, 0);
      
      setStats({
        totalScans,
        recycled,
        co2Saved: totalCo2.toFixed(1)
      });
    }
  }, [isDemoMode]);

  const handleScan = (file: File, type: "camera" | "upload") => {
    triggerHaptic("medium");
    toast.success(`Image selected via ${type}`, {
      description: "Processing with AI...",
      position: "top-center",
    });
    
    const mockId = Date.now().toString();
    navigate(`/result/${mockId}`, { 
      state: { 
        file,
        type 
      } 
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: "camera" | "upload") => {
    const file = e.target.files?.[0];
    if (file) {
      handleScan(file, type);
      setShowScanOptions(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero pb-32 animate-fade-in" data-page-container>
      {/* Hero Section */}
      <div className="pt-safe px-6 text-center animate-fade-in">
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Recycling</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            Sortify AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Scan items. Recycle smarter. Save the planet.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid gap-4 max-w-md mx-auto">
          <Card 
            className="p-6 shadow-soft hover:shadow-medium transition-smooth cursor-pointer" 
            onClick={() => {
              triggerHaptic("light");
              setShowScanOptions(true);
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Start Scan</h3>
                <p className="text-sm text-muted-foreground">Take photo or upload</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft active:shadow-medium transition-smooth cursor-pointer active:scale-[0.98]" onClick={() => {
            triggerHaptic("light");
            navigate("/history");
          }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <History className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">View History</h3>
                <p className="text-sm text-muted-foreground">Past scans & results</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft active:shadow-medium transition-smooth cursor-pointer active:scale-[0.98]" onClick={() => {
            triggerHaptic("light");
            navigate("/articles");
          }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-lime/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-lime" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Articles</h3>
                <p className="text-sm text-muted-foreground">Learn about recycling</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft active:shadow-medium transition-smooth cursor-pointer active:scale-[0.98]" onClick={() => {
            triggerHaptic("light");
            navigate("/settings");
          }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize your app</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 mt-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <Card className="p-6 shadow-soft bg-gradient-subtle mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Your Impact</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{isDemoMode ? "47" : stats.totalScans}</div>
              <div className="text-xs text-muted-foreground">Items Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{isDemoMode ? "38" : stats.recycled}</div>
              <div className="text-xs text-muted-foreground">Recycled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{isDemoMode ? "12kg" : `${stats.co2Saved}kg`}</div>
              <div className="text-xs text-muted-foreground">CO₂ Saved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Scan Options Sheet */}
      <Sheet open={showScanOptions} onOpenChange={setShowScanOptions}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Choose Scan Method</SheetTitle>
            <SheetDescription>
              Take a photo or select from your library
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 mt-6">
            <label htmlFor="camera-input">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <div className="cursor-pointer">
                  <Camera className="h-5 w-5 mr-3" />
                  Take Photo
                </div>
              </Button>
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileInput(e, "camera")}
              />
            </label>

            <label htmlFor="upload-input">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <div className="cursor-pointer">
                  <Upload className="h-5 w-5 mr-3" />
                  Choose from Library
                </div>
              </Button>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInput(e, "upload")}
              />
            </label>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Home;
