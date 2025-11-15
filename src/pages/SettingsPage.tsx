import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, MapPin, Palette, Gauge, Zap } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const [showConfidence, setShowConfidence] = useState(true);
  const [showContamination, setShowContamination] = useState(true);
  const [showCO2, setShowCO2] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [selectedCity, setSelectedCity] = useState("san-francisco");
  const [theme, setTheme] = useState("auto");

  return (
    <div className="min-h-screen gradient-hero pb-24 pt-6">
      <div className="px-6">
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
                  checked={showConfidence}
                  onCheckedChange={setShowConfidence}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="contamination" className="flex-1 cursor-pointer">
                  <div className="font-medium">Contamination Warnings</div>
                  <div className="text-sm text-muted-foreground">Alert about dirty items</div>
                </Label>
                <Switch 
                  id="contamination"
                  checked={showContamination}
                  onCheckedChange={setShowContamination}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="co2" className="flex-1 cursor-pointer">
                  <div className="font-medium">CO₂ Reduction Estimates</div>
                  <div className="text-sm text-muted-foreground">Show environmental impact</div>
                </Label>
                <Switch 
                  id="co2"
                  checked={showCO2}
                  onCheckedChange={setShowCO2}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="haptics" className="flex-1 cursor-pointer">
                  <div className="font-medium">Enable Haptics</div>
                  <div className="text-sm text-muted-foreground">Vibration feedback</div>
                </Label>
                <Switch 
                  id="haptics"
                  checked={haptics}
                  onCheckedChange={setHaptics}
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
              <Select value={selectedCity} onValueChange={setSelectedCity}>
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
              <Select value={theme} onValueChange={setTheme}>
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
