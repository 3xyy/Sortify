import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Recycle, Trash2, Leaf, AlertTriangle, MessageCircle, Camera, MapPin, Info, ArrowLeft, Loader2, Sparkles } from "lucide-react";
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
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);
  const { settings } = useSettings();

  const allFacts = [
    "Aluminum can be recycled forever without losing quality",
    "Recycling one plastic bottle saves enough energy to power a light bulb for 3 hours",
    "Glass can be recycled endlessly without losing quality",
    "Composting reduces methane emissions from landfills by up to 50%",
    "Recycling paper saves 17 trees per ton",
    "Americans throw away 25 trillion Styrofoam cups every year",
    "Recycling steel saves 60% of the energy needed to make new steel",
    "E-waste contains valuable materials like gold, silver, and copper",
    "A single recycled tin can saves enough energy to power a TV for 3 hours",
    "Plastic takes up to 1,000 years to decompose in landfills",
    "Recycling one ton of cardboard saves 9 cubic yards of landfill space",
    "The average person generates 4.5 pounds of trash daily",
    "Only 9% of all plastic ever produced has been recycled",
    "Recycling aluminum uses 95% less energy than making new aluminum",
    "Food waste makes up about 30% of what we throw away",
    "A glass bottle takes 4,000 years to decompose",
    "Recycling one aluminum can saves enough energy to run a computer for 3 hours",
    "The US recycles about 35% of its municipal waste",
    "Batteries contain toxic chemicals that can contaminate soil and water",
    "Textiles take 200+ years to decompose in landfills",
    "Recycling paper produces 70% less air pollution than making new paper",
    "One ton of recycled plastic saves 7,200 kWh of electricity",
    "Coffee grounds make excellent compost for gardens",
    "Electronic waste is the fastest-growing waste stream globally",
    "Recycling one newspaper saves enough water for a 10-minute shower",
    "Landfills are the third-largest source of methane in the US",
    "Composting can reduce your household waste by up to 30%",
    "Recycled glass reduces related air pollution by 20%",
    "A plastic bag is used for an average of 12 minutes before being discarded",
    "Recycling creates 6 times more jobs than landfilling",
  ];

  // Shuffle facts on mount to get random order
  const [shuffledFacts] = useState(() => {
    const shuffled = [...allFacts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  
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
      setProgress(0);
      
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

        console.log('=== ANALYZE WASTE REQUEST STARTED ===');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Endpoint:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-waste`);
        console.log('Method: POST');
        console.log('Headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        });
        console.log('Request Body:', {
          imageData: `${imageData.substring(0, 100)}... (${imageData.length} chars total)`,
          city
        });
        console.log('City selected:', city);
        console.log('Image data size:', imageData.length, 'characters');
        
        // Call the edge function
        const { data, error } = await supabase.functions.invoke('analyze-waste', {
          body: { 
            imageData,
            city
          }
        });

        console.log('=== ANALYZE WASTE RESPONSE RECEIVED ===');
        console.log('Response timestamp:', new Date().toISOString());
        console.log('Error:', error);
        console.log('Error type:', error ? typeof error : 'null');
        console.log('Error details:', error ? JSON.stringify(error, null, 2) : 'none');
        console.log('Data:', data);
        console.log('Data type:', data ? typeof data : 'null');
        console.log('Full data object:', data ? JSON.stringify(data, null, 2) : 'null');
        console.log('=== ANALYZE WASTE REQUEST COMPLETED ===');

        if (error) {
          console.error('Edge function error:', error);
          
          // Show detailed error page instead of mock data
          setResult({
            error: true,
            errorTitle: "Analysis Failed",
            errorMessage: data?.error || error.message,
            errorDetails: data?.details || error.toString(),
            imageUrl: URL.createObjectURL(file),
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (!data || typeof data !== 'object') {
          console.error('Invalid data received:', data);
          setResult({
            error: true,
            errorTitle: "Invalid Response",
            errorMessage: "Received invalid data from server",
            errorDetails: JSON.stringify(data, null, 2),
            imageUrl: URL.createObjectURL(file),
            timestamp: new Date().toISOString(),
          });
          return;
        }

        console.log('Analysis result:', data);

        // Convert file to base64 for persistent storage
        const fileToBase64 = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };
        
        const thumbnailBase64 = await fileToBase64(file);
        
        // Save to localStorage with base64 image (persistent)
        const scanItem = {
          id: Date.now().toString(),
          itemName: data.itemName,
          category: data.category,
          date: new Date().toISOString(),
          confidence: data.confidence,
          thumbnail: thumbnailBase64,
          materialType: data.materialType,
          details: {
            contamination: data.contamination,
            instructions: data.instructions,
            localRule: data.localRule,
            co2Saved: data.co2Saved
          }
        };
        
        const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        history.unshift(scanItem);
        localStorage.setItem('scanHistory', JSON.stringify(history));
        
        
        // Set the result with the base64 image
        setResult({
          ...data,
          imageUrl: thumbnailBase64
        });
        
        toast.success("Scan saved to history");

      } catch (error) {
        console.error('Failed to analyze image:', error);
        
        // Show detailed error instead of mock data
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        setResult({
          error: true,
          errorTitle: "Analysis Error",
          errorMessage: errorMessage,
          errorDetails: errorStack || JSON.stringify(error, null, 2),
          imageUrl: file ? URL.createObjectURL(file) : undefined,
          timestamp: new Date().toISOString(),
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeImage();
  }, [state, navigate, settings.selectedCity]);

  // Smoother progress animation during analysis
  useEffect(() => {
    if (!isAnalyzing) return;
    
    let startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Easing function for smooth natural progress
      // Starts slow, speeds up, then slows down before 90%
      let targetProgress: number;
      
      if (elapsed < 500) {
        // First 500ms: slow start (0-15%)
        targetProgress = (elapsed / 500) * 15;
      } else if (elapsed < 2000) {
        // 500ms-2s: faster middle phase (15-70%)
        targetProgress = 15 + ((elapsed - 500) / 1500) * 55;
      } else if (elapsed < 4000) {
        // 2s-4s: slow down approaching 90% (70-88%)
        const t = (elapsed - 2000) / 2000;
        targetProgress = 70 + (1 - Math.pow(1 - t, 3)) * 18;
      } else {
        // After 4s: very slowly creep up (88-92%)
        const t = Math.min((elapsed - 4000) / 10000, 1);
        targetProgress = 88 + t * 4;
      }
      
      setProgress(Math.min(Math.round(targetProgress), 92));
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnalyzing]);
  
  // Complete progress when analysis is done
  useEffect(() => {
    if (!isAnalyzing && progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, progress]);

  // Cycle through shuffled facts during loading
  useEffect(() => {
    if (!isAnalyzing) return;
    
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % shuffledFacts.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [isAnalyzing, shuffledFacts.length]);
  
  // Hide bottom navbar during analysis
  useEffect(() => {
    if (isAnalyzing) {
      document.body.setAttribute('data-hide-nav', 'true');
    } else {
      document.body.removeAttribute('data-hide-nav');
    }
    return () => document.body.removeAttribute('data-hide-nav');
  }, [isAnalyzing]);

  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" data-analyzing="true">
        <div className="text-center space-y-8 max-w-md animate-fade-in">
          <div className="relative">
            <div className="h-24 w-24 mx-auto">
              <Loader2 className="h-24 w-24 text-primary animate-spin" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Analyzing Your Item</h2>
            <p className="text-muted-foreground">
              Our AI is identifying the material and checking local recycling rules...
            </p>
          </div>

          <div className="w-full space-y-3">
            <Progress value={progress} className="h-2 transition-all duration-300" />
            <p className="text-sm text-muted-foreground">
              {progress}% complete
            </p>
          </div>

          <div className="bg-primary/10 rounded-xl p-6 min-h-[100px] flex items-center">
            <div className="flex items-start gap-3 animate-fade-in" key={currentTip}>
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm leading-relaxed text-left">
                {shuffledFacts[currentTip]}
              </p>
            </div>
          </div>
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
  
  // Show error page if analysis failed
  if (result.error) {
    return (
      <div className="min-h-screen gradient-hero pb-32 pt-safe">
        <div className="px-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="px-6 space-y-4 max-w-2xl mx-auto">
          {result.imageUrl && (
            <div className="relative h-60 overflow-hidden rounded-lg">
              <img 
                src={result.imageUrl}
                alt="Failed scan"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-destructive mb-1">
                  {result.errorTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {result.timestamp && new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm">Error Message</h3>
                <Card className="p-3 bg-background">
                  <p className="text-sm font-mono text-destructive">
                    {result.errorMessage}
                  </p>
                </Card>
              </div>
              
              {result.errorDetails && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Technical Details</h3>
                  <Card className="p-3 bg-background max-h-60 overflow-auto">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                      {result.errorDetails}
                    </pre>
                  </Card>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3 text-sm">Common Solutions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>API Key Not Configured:</strong> Make sure the OPENAI_API_KEY secret is set in your backend
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Invalid API Key:</strong> Verify your key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-primary underline">platform.openai.com</a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>No Credits:</strong> Check your OpenAI account has available credits
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Model Access:</strong> Ensure your API key has access to GPT-5 models
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => navigate("/settings")}
                  className="flex-1"
                >
                  Go to Settings
                </Button>
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
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
