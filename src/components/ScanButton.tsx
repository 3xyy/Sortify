import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScanButtonProps {
  onScan: (file: File, type: "camera" | "upload") => void;
}

export const ScanButton = ({ onScan }: ScanButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "camera" | "upload") => {
    const file = e.target.files?.[0];
    if (file) {
      onScan(file, type);
      setIsExpanded(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <div className={cn(
        "flex flex-col gap-3 transition-all duration-300",
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <label htmlFor="camera-input">
          <Button 
            variant="fab" 
            size="icon-lg"
            className="w-full"
            onClick={() => {}}
            asChild
          >
            <div className="cursor-pointer">
              <Camera className="h-6 w-6" />
            </div>
          </Button>
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e, "camera")}
          />
        </label>

        <label htmlFor="upload-input">
          <Button 
            variant="fab" 
            size="icon-lg"
            className="w-full bg-accent hover:bg-accent-light"
            onClick={() => {}}
            asChild
          >
            <div className="cursor-pointer">
              <Upload className="h-6 w-6" />
            </div>
          </Button>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "upload")}
          />
        </label>
      </div>

      <Button
        variant="fab"
        size="icon-xl"
        className="mt-3 w-full gradient-primary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          "transition-transform duration-300",
          isExpanded && "rotate-45"
        )}>
          {isExpanded ? (
            <span className="text-2xl">×</span>
          ) : (
            <Camera className="h-7 w-7" />
          )}
        </div>
      </Button>
    </div>
  );
};
