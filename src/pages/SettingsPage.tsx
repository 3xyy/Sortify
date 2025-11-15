import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, MapPin, Palette, Gauge, Zap, TestTube } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/contexts/ThemeContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { toast } from "sonner";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const SettingsPage = () => {
  const { settings, updateSetting, triggerHaptic } = useSettings();
  const { theme, setTheme } = useTheme();
  const { isDemoMode, enterDemoMode, exitDemoMode } = useDemoMode();
  useSwipeNavigation();

  return (
    <div className="min-h-screen gradient-hero pb-32 pt-safe">
      <div className="px-6 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-4 animate-fade-up">
          {/* Features */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Features</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="confidence" className="flex-1 cursor-pointer">
                  <div className="font-medium">Show Confidence Scores</div>
                  <div className="text-sm text-muted-foreground">Display AI confidence %</div>
                </Label>
                <Switch 
                  id="confidence"
                  checked={settings.showConfidence}
                  onCheckedChange={(val) => {
                    updateSetting("showConfidence", val);
                    triggerHaptic("light");
                    toast.success(val ? "Confidence scores enabled" : "Confidence scores disabled");
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="contamination" className="flex-1 cursor-pointer">
                  <div className="font-medium">Contamination Warnings</div>
                  <div className="text-sm text-muted-foreground">Alert about dirty items</div>
                </Label>
                <Switch 
                  id="contamination"
                  checked={settings.showContamination}
                  onCheckedChange={(val) => {
                    updateSetting("showContamination", val);
                    triggerHaptic("light");
                    toast.success(val ? "Contamination warnings enabled" : "Contamination warnings disabled");
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="co2" className="flex-1 cursor-pointer">
                  <div className="font-medium">CO₂ Reduction Estimates</div>
                  <div className="text-sm text-muted-foreground">Show environmental impact</div>
                </Label>
                <Switch 
                  id="co2"
                  checked={settings.showCO2}
                  onCheckedChange={(val) => {
                    updateSetting("showCO2", val);
                    triggerHaptic("light");
                    toast.success(val ? "CO₂ estimates enabled" : "CO₂ estimates disabled");
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="haptics" className="flex-1 cursor-pointer">
                  <div className="font-medium">Enable Haptics</div>
                  <div className="text-sm text-muted-foreground">Vibration feedback</div>
                </Label>
                <Switch 
                  id="haptics"
                  checked={settings.haptics}
                  onCheckedChange={(val) => {
                    updateSetting("haptics", val);
                    if (val && "vibrate" in navigator) {
                      navigator.vibrate([10, 50, 10]);
                      toast.success("Haptics enabled");
                    } else {
                      toast.success("Haptics disabled");
                    }
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Location</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Your City</Label>
              <Select 
                value={settings.selectedCity} 
                onValueChange={(val) => {
                  updateSetting("selectedCity", val);
                  triggerHaptic("light");
                  toast.success("City updated");
                }}
              >
                <SelectTrigger id="city">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                  <SelectItem value="new-york">New York, NY</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                  <SelectItem value="chicago">Chicago, IL</SelectItem>
                  <SelectItem value="seattle">Seattle, WA</SelectItem>
                  <SelectItem value="boston">Boston, MA</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Recycling rules vary by location
              </p>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Appearance</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={theme} 
                onValueChange={(val) => {
                  setTheme(val as "light" | "dark" | "auto");
                  triggerHaptic("light");
                  toast.success(`Theme set to ${val}`);
                }}
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="color">App Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={settings.customColor}
                  onChange={(e) => {
                    updateSetting("customColor", e.target.value);
                    triggerHaptic("medium");
                  }}
                  className="h-12 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.customColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                      updateSetting("customColor", val);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (!/^#[0-9A-F]{6}$/i.test(val)) {
                      updateSetting("customColor", "#2fb89d");
                    }
                  }}
                  placeholder="#2fb89d"
                  maxLength={7}
                  className="flex-1 h-12 font-mono uppercase"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Customize the app's primary color
              </p>
            </div>
          </Card>

          {/* Demo Mode */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <TestTube className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">Demo Mode</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Explore the app with sample scan data
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  enterDemoMode();
                  triggerHaptic("medium");
                  toast.success("Demo mode activated");
                }}
                disabled={isDemoMode}
              >
                {isDemoMode ? "Demo Active" : "Open Demo"}
              </Button>
              {isDemoMode && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    exitDemoMode();
                    triggerHaptic("medium");
                    toast.success("Exited demo mode");
                  }}
                >
                  Exit Demo
                </Button>
              )}
            </div>
          </Card>

          {/* API Info */}
          <Card className="p-6 shadow-soft bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">API Status</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Vision API: Connected<br />
              Chat API: Connected
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
