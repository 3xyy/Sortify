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
    const testKey = keyToTest || apiKey;
    if (!testKey) {
      setVisionApiStatus("disconnected");
      toast.error("Please enter an OpenAI API key");
      return;
    }

    setIsTestingApi(true);
    try {
      // Test the API key by making a simple request to OpenAI
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${testKey}`
        }
      });
      
      if (response.ok) {
        setVisionApiStatus("connected");
        toast.success("✅ OpenAI API key is valid!");
      } else {
        const error = await response.json();
        setVisionApiStatus("disconnected");
        toast.error(`❌ Invalid API key: ${error.error?.message || 'Authentication failed'}`);
      }
    } catch (error) {
      setVisionApiStatus("disconnected");
      toast.error("Failed to validate API key. Check your connection.");
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    localStorage.setItem("openai_api_key", apiKey);
    triggerHaptic("medium");
    toast.success("API key saved locally");
    checkVisionApi(apiKey);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      checkVisionApi(savedKey);
    } else {
      setVisionApiStatus("disconnected");
    }
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

          {/* OpenAI API Key */}
          <Card className="p-6 shadow-soft border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">OpenAI API Configuration</h2>
              <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                visionApiStatus === "connected" 
                  ? "bg-success/10 text-success" 
                  : visionApiStatus === "checking"
                  ? "bg-muted text-muted-foreground"
                  : "bg-destructive/10 text-destructive"
              }`}>
                {visionApiStatus === "connected" && "✓ Connected"}
                {visionApiStatus === "checking" && "Checking..."}
                {visionApiStatus === "disconnected" && "Not Connected"}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Enter your OpenAI API key to enable image analysis
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveApiKey}
                  className="flex-1"
                  disabled={!apiKey.trim()}
                >
                  Save API Key
                </Button>
                <Button 
                  onClick={() => checkVisionApi()}
                  variant="outline"
                  disabled={!apiKey.trim() || isTestingApi}
                  className="flex-1"
                >
                  {isTestingApi ? "Testing..." : "Test Connection"}
                </Button>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
                <p className="font-medium">ℹ️ How to Configure</p>
                <p className="text-muted-foreground">
                  1. Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">platform.openai.com</a>
                </p>
                <p className="text-muted-foreground">
                  2. Test it here to verify it works
                </p>
                <p className="text-muted-foreground">
                  3. The OPENAI_API_KEY secret must be configured in your backend for the app to work
                </p>
                <p className="text-muted-foreground mt-2 font-medium text-warning">
                  ⚠️ Note: This test validates your key, but the actual app uses the backend secret configuration.
                </p>
              </div>
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
              <span className="font-medium">App Version:</span> 11.15.25.13.00
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
