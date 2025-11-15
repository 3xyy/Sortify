import { useState, useEffect } from "react";

interface Settings {
  showConfidence: boolean;
  showContamination: boolean;
  showCO2: boolean;
  enableHaptics: boolean;
  selectedCity: string;
  customColor: string;
}

const DEFAULT_SETTINGS: Settings = {
  showConfidence: true,
  showContamination: true,
  showCO2: true,
  enableHaptics: true,
  selectedCity: "san-francisco",
  customColor: "#2fb89d",
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings));
    
    // Apply custom color to CSS variables
    if (settings.customColor) {
      const root = document.documentElement;
      const hexToHSL = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return "174 62% 47%";
        
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }
        
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `${h} ${s}% ${l}%`;
      };
      
      const hsl = hexToHSL(settings.customColor);
      root.style.setProperty("--primary", hsl);
      root.style.setProperty("--ring", hsl);
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const triggerHaptic = (style: "light" | "medium" | "heavy" = "light") => {
    if (!settings.enableHaptics) return;
    
    if ("vibrate" in navigator && navigator.vibrate) {
      try {
        const patterns = {
          light: [10],
          medium: [15, 10, 15],
          heavy: [25, 10, 25],
        };
        navigator.vibrate(patterns[style]);
      } catch (e) {
        console.log("Haptic feedback not supported on this device");
      }
    }
  };

  return { settings, updateSetting, triggerHaptic };
};
