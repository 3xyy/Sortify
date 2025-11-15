import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Recycle, Trash2, Leaf, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoContext";

interface ScanItem {
  id: string;
  itemName: string;
  category: "recycle" | "compost" | "trash" | "hazardous";
  date: string;
  confidence: number;
  thumbnail: string;
}

const mockHistory: ScanItem[] = [
  {
    id: "1",
    itemName: "Plastic Water Bottle",
    category: "recycle",
    date: "2 hours ago",
    confidence: 95,
    thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    itemName: "Glass Jar",
    category: "recycle",
    date: "Yesterday",
    confidence: 92,
    thumbnail: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    itemName: "Pizza Box",
    category: "compost",
    date: "2 days ago",
    confidence: 88,
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop"
  },
  {
    id: "4",
    itemName: "AA Battery",
    category: "hazardous",
    date: "3 days ago",
    confidence: 97,
    thumbnail: "https://images.unsplash.com/photo-1609315582653-0d0e1d0f0b0f?w=400&h=400&fit=crop"
  },
  {
    id: "5",
    itemName: "Aluminum Can",
    category: "recycle",
    date: "4 days ago",
    confidence: 98,
    thumbnail: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=400&fit=crop"
  },
];

const categoryConfig = {
  recycle: {
    icon: Recycle,
    label: "Recycle",
    color: "bg-success text-success-foreground",
  },
  compost: {
    icon: Leaf,
    label: "Compost",
    color: "bg-lime text-lime-foreground",
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

  return (
    <div className="min-h-screen gradient-hero pb-24 pt-safe">
      <div className="px-6 pt-6">
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
                className="p-4 shadow-soft hover:shadow-medium transition-smooth cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/result/${item.id}`)}
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
