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
import { useState, useEffect } from "react";

const SettingsPage = () => {
  const { settings, updateSetting, triggerHaptic } = useSettings();
  const { theme, setTheme } = useTheme();
  const { isDemoMode, enterDemoMode, exitDemoMode } = useDemoMode();
  const [visionApiStatus, setVisionApiStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("vision_api_key") || "");
  const [isTestingApi, setIsTestingApi] = useState(false);
  useSwipeNavigation();

  const checkVisionApi = async (keyToTest?: string) => {
    const testKey = keyToTest || apiKey || import.meta.env.VITE_VISION_API_KEY;
    if (!testKey || testKey === "your_vision_api_key_here") {
      setVisionApiStatus("disconnected");
      return;
    }

    setIsTestingApi(true);
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/models", {
        headers: {
          "Authorization": `Bearer ${testKey}`
        }
      });
      
      setVisionApiStatus(response.ok ? "connected" : "disconnected");
      if (response.ok) {
        toast.success("API key is valid");
      } else {
        toast.error("API key is invalid");
      }
    } catch {
      setVisionApiStatus("disconnected");
      toast.error("Failed to validate API key");
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("vision_api_key", apiKey);
    triggerHaptic("medium");
    checkVisionApi(apiKey);
  };

  useEffect(() => {
    checkVisionApi();
  }, []);

  return (
    <div className="min-h-screen gradient-hero pb-32 pt-safe animate-fade-in" data-page-container>
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
              <div className="flex items-center justify-between opacity-50">
                <Label htmlFor="confidence" className="flex-1">
                  <div className="font-medium">Show Confidence Scores</div>
                  <div className="text-sm text-muted-foreground">Display AI confidence % (Required)</div>
                </Label>
                <Switch 
                  id="confidence"
                  checked={true}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <Label htmlFor="contamination" className="flex-1">
                  <div className="font-medium">Contamination Warnings</div>
                  <div className="text-sm text-muted-foreground">Alert about dirty items (Required)</div>
                </Label>
                <Switch 
                  id="contamination"
                  checked={true}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <Label htmlFor="co2" className="flex-1">
                  <div className="font-medium">CO₂ Reduction Estimates</div>
                  <div className="text-sm text-muted-foreground">Show environmental impact (Required)</div>
                </Label>
                <Switch 
                  id="co2"
                  checked={true}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="haptics" className="flex-1 cursor-pointer">
                  <div className="font-medium">Enable Haptics</div>
                  <div className="text-sm text-muted-foreground">Vibration feedback</div>
                </Label>
                <Switch 
                  id="haptics"
                  checked={settings.enableHaptics}
                  onCheckedChange={(val) => {
                    updateSetting("enableHaptics", val);
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
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">API Configuration</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="apiKey" className="text-sm font-medium">Vision API Key</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Status: <span className={visionApiStatus === "connected" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {visionApiStatus === "checking" ? "Checking..." : visionApiStatus === "connected" ? "Connected" : "Disconnected"}
                  </span>
                </p>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Paste your API key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveApiKey}
                    disabled={isTestingApi || !apiKey}
                    size="sm"
                  >
                    {isTestingApi ? "Testing..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Version and Attribution */}
          <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground pb-4">
            <div>
              <span className="font-medium">App Version:</span> 11.15.25.12.42
            </div>
            <div>
              Made with ❤️ by <a 
                href="https://www.linkedin.com/in/yuvrajdar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline font-medium"
              >
                Yuvraj Dar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
