import { ScanButton } from "@/components/ScanButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History, Settings, Sparkles, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();

  const handleScan = (file: File, type: "camera" | "upload") => {
    toast.success(`Image selected via ${type}`, {
      description: "Processing with AI...",
    });
    
    // Create mock scan result and navigate
    const mockId = Date.now().toString();
    navigate(`/result/${mockId}`, { 
      state: { 
        file,
        type 
      } 
    });
  };

  return (
    <div className="min-h-screen gradient-hero pb-24">
      {/* Hero Section */}
      <div className="pt-16 px-6 text-center animate-fade-in">
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

      {/* Quick Actions */}
      <div className="px-6 mt-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid gap-4 max-w-md mx-auto">
          <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth cursor-pointer" onClick={() => {}}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Start Scan</h3>
                <p className="text-sm text-muted-foreground">Quick AI analysis</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth cursor-pointer" onClick={() => navigate("/history")}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <History className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">View History</h3>
                <p className="text-sm text-muted-foreground">Past scans</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth cursor-pointer" onClick={() => navigate("/settings")}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-lime/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-lime" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize experience</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 mt-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <Card className="p-6 shadow-medium max-w-md mx-auto gradient-primary">
          <div className="flex items-center justify-between text-primary-foreground">
            <div className="text-center flex-1">
              <div className="text-3xl font-bold">127</div>
              <div className="text-sm opacity-90">Items Scanned</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold">89%</div>
              <div className="text-sm opacity-90">Correct Sort</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold">52kg</div>
              <div className="text-sm opacity-90">CO₂ Saved</div>
            </div>
          </div>
        </Card>
      </div>

      <ScanButton onScan={handleScan} />
    </div>
  );
};

export default Home;
