import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Recycle, Trash2, Leaf, AlertTriangle, MessageCircle, Camera, MapPin, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";

const categoryConfig = {
  recycle: {
    icon: Recycle,
    label: "Recyclable",
    color: "bg-success text-success-foreground",
    description: "This item can be recycled",
  },
  compost: {
    icon: Leaf,
    label: "Compostable",
    color: "bg-lime text-lime-foreground",
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
};

// Mock result data
const mockResult = {
  itemName: "Plastic Water Bottle",
  category: "recycle" as const,
  confidence: 95,
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
  const [showChat, setShowChat] = useState(false);
  
  const config = categoryConfig[mockResult.category];
  const Icon = config.icon;

  return (
    <div className="min-h-screen gradient-hero pb-24">
      <div className="relative">
        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={mockResult.imageUrl}
            alt={mockResult.itemName}
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
            {mockResult.itemName}
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            {config.description}
          </p>

          {/* Confidence */}
          <Card className="p-4 shadow-soft mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Confidence</span>
              <span className="text-sm font-bold text-primary">{mockResult.confidence}%</span>
            </div>
            <Progress value={mockResult.confidence} className="h-2" />
          </Card>

          {/* Contamination Status */}
          <Card className="p-4 shadow-soft mb-4 border-l-4 border-success">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-success mt-0.5" />
              <div>
                <div className="font-medium mb-1">Contamination Check</div>
                <div className="text-sm text-muted-foreground">{mockResult.contamination}</div>
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
              {mockResult.instructions.map((instruction, index) => (
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
                <div className="text-sm text-muted-foreground">{mockResult.localRule}</div>
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
              <span className="font-bold">{mockResult.co2Saved}</span>
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
              onClick={() => navigate("/")}
            >
              <Camera className="h-5 w-5" />
              Scan Another Item
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <ChatInterface 
          itemName={mockResult.itemName}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default ResultPage;
