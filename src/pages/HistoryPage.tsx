import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Recycle, Trash2, Leaf, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoContext";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useSettings } from "@/hooks/useSettings";

interface ScanItem {
  id: string;
  itemName: string;
  category: "recycle" | "compost" | "trash" | "hazardous";
  date: string;
  confidence: number;
  thumbnail: string;
  details: {
    contamination: string;
    instructions: string[];
    localRule: string;
    co2Saved: string;
  };
}

const mockHistory: ScanItem[] = [
  {
    id: "1",
    itemName: "Plastic Water Bottle",
    category: "recycle",
    date: "2 hours ago",
    confidence: 95,
    thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    details: {
      contamination: "Clean - ready to recycle",
      instructions: [
        "Remove cap and label if possible",
        "Rinse out any remaining liquid",
        "Crush to save space",
        "Place in blue recycling bin",
      ],
      localRule: "San Francisco accepts #1 PET plastic bottles in curbside recycling",
      co2Saved: "0.5 kg CO₂ saved by recycling",
    },
  },
  {
    id: "2",
    itemName: "Glass Jar",
    category: "recycle",
    date: "Yesterday",
    confidence: 92,
    thumbnail: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&h=400&fit=crop",
    details: {
      contamination: "Clean - no residue detected",
      instructions: [
        "Remove metal lid",
        "Rinse thoroughly",
        "No need to remove label",
        "Place in glass recycling bin",
      ],
      localRule: "All clear glass containers are accepted in San Francisco recycling",
      co2Saved: "0.3 kg CO₂ saved by recycling",
    },
  },
  {
    id: "3",
    itemName: "Pizza Box",
    category: "compost",
    date: "2 days ago",
    confidence: 88,
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    details: {
      contamination: "Grease detected - compost only",
      instructions: [
        "Remove any leftover food",
        "Tear into smaller pieces",
        "Only compost the greasy parts",
        "Recycle clean cardboard parts separately",
      ],
      localRule: "San Francisco accepts food-soiled paper in green compost bins",
      co2Saved: "0.2 kg CO₂ saved by composting",
    },
  },
  {
    id: "4",
    itemName: "AA Battery",
    category: "hazardous",
    date: "3 days ago",
    confidence: 97,
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
    details: {
      contamination: "Hazardous material detected",
      instructions: [
        "Never throw in regular trash",
        "Store in a cool, dry place",
        "Place in a sealed bag",
        "Take to hazardous waste facility",
      ],
      localRule: "San Francisco requires proper disposal at designated collection sites",
      co2Saved: "Prevents soil contamination",
    },
  },
  {
    id: "5",
    itemName: "Aluminum Can",
    category: "recycle",
    date: "4 days ago",
    confidence: 98,
    thumbnail: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=400&fit=crop",
    details: {
      contamination: "Clean - excellent condition",
      instructions: [
        "Empty all contents",
        "Rinse with water",
        "Crushing optional but saves space",
        "Place in metal recycling bin",
      ],
      localRule: "Aluminum cans are highly valuable and accepted everywhere in San Francisco",
      co2Saved: "0.8 kg CO₂ saved by recycling",
    },
  },
];

const categoryConfig = {
  recycle: {
    icon: Recycle,
    label: "Recycle",
    color: "bg-recycle text-recycle-foreground",
  },
  compost: {
    icon: Leaf,
    label: "Compost",
    color: "bg-compost text-compost-foreground",
  },
  trash: {
    icon: Trash2,
    label: "Trash",
    color: "bg-muted text-muted-foreground",
  },
  hazardous: {
    icon: AlertTriangle,
    label: "Hazardous",
    color: "bg-hazard text-hazard-foreground",
  },
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useDemoMode();
  const { triggerHaptic } = useSettings();
  useSwipeNavigation();

  return (
    <div className="min-h-screen gradient-hero pb-32 pt-safe animate-fade-in" data-page-container>
      <div className="px-6 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <History className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Scan History</h1>
        </div>

      <div className="space-y-3 animate-fade-up">
        {!isDemoMode ? (
          <Card className="p-8 text-center shadow-soft">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Scan History</h3>
            <p className="text-sm text-muted-foreground">
              Start scanning items to see your history here
            </p>
          </Card>
        ) : (
          mockHistory.map((item, index) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;
            
            return (
              <Card 
                key={item.id}
                className="p-4 shadow-soft active:shadow-medium transition-smooth cursor-pointer animate-fade-in active:scale-[0.98]"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  triggerHaptic("light");
                  navigate(`/result/${item.id}`, { state: { item } });
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.itemName}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ${config.color} flex items-center justify-center shadow-soft`}>
                      <Icon className="h-3 w-3" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.itemName}</h3>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={config.color}>
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.confidence}% confident
                    </span>
                  </div>
                </div>
          </Card>
        );
      })
        )}
          <div className="h-8" />
        </div>

        {mockHistory.length === 0 && (
          <div className="text-center py-16">
            <History className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
            <p className="text-muted-foreground">
              Start scanning items to build your history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
