import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Recycle, Trash2, Leaf, AlertTriangle, MessageCircle, Camera, MapPin, Info, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const categoryConfig = {
  recycle: {
    icon: Recycle,
    label: "Recyclable",
    color: "bg-recycle text-recycle-foreground",
    description: "This item can be recycled",
  },
  compost: {
    icon: Leaf,
    label: "Compostable",
    color: "bg-compost text-compost-foreground",
    description: "Add to compost bin",
  },
  trash: {
    icon: Trash2,
    label: "Trash",
    color: "bg-muted text-muted-foreground",
    description: "Goes to landfill",
  },
  hazardous: {
    icon: AlertTriangle,
    label: "Hazardous Waste",
    color: "bg-hazard text-hazard-foreground",
    description: "Requires special disposal",
  },
  garbage: {
    icon: Trash2,
    label: "Landfill",
    color: "bg-garbage text-garbage-foreground",
    description: "Goes to landfill",
  },
};

// Mock result data
const mockResult = {
  itemName: "Plastic Water Bottle",
  category: "recycle" as const,
  confidence: 95,
  materialType: "#1 PET plastic",
  contamination: "Clean - ready to recycle",
  instructions: [
    "Remove cap and label if possible",
    "Rinse out any remaining liquid",
    "Crush to save space",
    "Place in blue recycling bin",
  ],
  localRule: "San Francisco accepts #1 PET plastic bottles in curbside recycling",
  co2Saved: "0.5 kg CO₂ saved by recycling",
  imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
};

const ResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { settings } = useSettings();
  
  useEffect(() => {
    const analyzeImage = async () => {
      // Check if we have item data from history
      if (state?.item) {
        setResult({
          itemName: state.item.itemName,
          category: state.item.category,
          confidence: state.item.confidence,
          contamination: state.item.details.contamination,
          instructions: state.item.details.instructions,
          localRule: state.item.details.localRule,
          co2Saved: state.item.details.co2Saved,
          imageUrl: state.item.thumbnail,
          materialType: state.item.details.materialType || "Unknown"
        });
        return;
      }

      // Check if we have a file to analyze
      const file = state?.file;
      if (!file) {
        toast.error("No image provided");
        navigate("/");
        return;
      }

      setIsAnalyzing(true);
      
      try {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            // Extract just the base64 part (remove data:image/...;base64, prefix)
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(file);
        const imageData = await base64Promise;

        // Get city name from settings
        const cityMap: Record<string, string> = {
          "san-francisco": "San Francisco",
          "new-york": "New York",
          "los-angeles": "Los Angeles",
          "chicago": "Chicago",
          "seattle": "Seattle"
        };
        const city = cityMap[settings.selectedCity] || settings.selectedCity;

        console.log('Calling analyze-waste function...');
        
        // Call the edge function
        const { data, error } = await supabase.functions.invoke('analyze-waste', {
          body: { 
            imageData,
            city
          }
        });

        if (error) {
          console.error('Error analyzing image:', error);
          throw error;
        }

        console.log('Analysis result:', data);

        // Create object URL for the image
        const imageUrl = URL.createObjectURL(file);
        
        // Set the result with the image URL
        setResult({
          ...data,
          imageUrl
        });

      } catch (error) {
        console.error('Failed to analyze image:', error);
        toast.error("Failed to analyze image. Please try again.");
        // Use mock data as fallback
        setResult(mockResult);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeImage();
  }, [state, navigate, settings.selectedCity]);
  
  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center" data-page-container>
        <div className="text-center space-y-4 px-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Analyzing Your Item</h2>
          <p className="text-muted-foreground">Our AI is identifying the best way to dispose of this item...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center" data-page-container>
        <div className="text-center space-y-4 px-6">
          <h2 className="text-2xl font-bold">No Image Found</h2>
          <p className="text-muted-foreground">Please scan an item first</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  const config = categoryConfig[result.category];
  const Icon = config.icon;

  return (
    <div className="min-h-screen gradient-hero pb-32 pt-safe">
      <div className="px-6 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/history")}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="relative">
        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={result.imageUrl}
            alt={result.itemName}
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 -mt-12 relative z-10 animate-fade-up">
          {/* Category Badge */}
          <div className="flex justify-center mb-4">
            <Card className={`${config.color} px-6 py-3 shadow-large`}>
              <div className="flex items-center gap-2">
                <Icon className="h-6 w-6" />
                <span className="font-bold text-lg">{config.label}</span>
              </div>
            </Card>
          </div>

          {/* Item Name */}
          <h1 className="text-3xl font-bold text-center mb-2">
            {result.itemName}
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            {config.description}
          </p>

          {/* Confidence */}
          <Card className="p-4 shadow-soft mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Confidence</span>
              <span className="text-sm font-bold text-primary">{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </Card>

          {/* Contamination Status */}
          <Card className="p-4 shadow-soft mb-4 border-l-4 border-success">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-success mt-0.5" />
              <div>
                <div className="font-medium mb-1">Contamination Check</div>
                <div className="text-sm text-muted-foreground">{result.contamination}</div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 shadow-soft mb-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Recycle className="h-4 w-4 text-primary" />
              Disposal Instructions
            </h2>
            <ol className="space-y-3">
              {result.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Local Rule */}
          <Card className="p-4 shadow-soft mb-4 bg-accent/5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <div className="font-medium mb-1">Local Recycling Rule</div>
                <div className="text-sm text-muted-foreground">{result.localRule}</div>
              </div>
            </div>
          </Card>

          {/* CO2 Impact */}
          <Card className="p-4 shadow-soft mb-6 gradient-primary">
            <div className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                <span className="font-medium">Environmental Impact</span>
              </div>
              <span className="font-bold">{result.co2Saved}</span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="xl"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-5 w-5" />
              Ask Follow-Up Question
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="xl"
              onClick={() => navigate("/articles", { state: { category: result.category } })}
            >
              <Icon className="h-5 w-5" />
              Go To Article
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <ChatInterface 
          itemName={result.itemName}
          category={result.category}
          categoryLabel={config.label}
          instructions={result.instructions}
          co2Saved={result.co2Saved}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default ResultPage;
