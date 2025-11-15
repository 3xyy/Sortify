import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Trash2, Recycle, Leaf, Package, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  description: string;
  category: "hazardous" | "recycling" | "composting" | "general";
  icon: typeof AlertTriangle;
  content: string;
  keywords: string[];
}

const articles: Article[] = [
  {
    id: "hazardous-needles",
    title: "Disposing of Needles & Sharps",
    description: "Learn how to safely dispose of medical sharps and needles",
    category: "hazardous",
    icon: AlertTriangle,
    content: `Never throw needles or sharps in regular trash or recycling.

Proper Disposal:
• Use a sharps container or hard plastic bottle
• Seal the container when full
• Take to a designated collection site

Where to Dispose:
• Hospitals and medical centers
• Pharmacies (many offer sharps disposal)
• Household hazardous waste facilities
• Visit safeneedledisposal.org to find locations

Important: Never recap needles. Label containers clearly as "Sharps - Do Not Recycle"`,
    keywords: ["needles", "sharps", "medical", "hazardous", "dangerous"],
  },
  {
    id: "hazardous-explosives",
    title: "Found Explosives or Suspicious Items",
    description: "Emergency procedures for handling found explosives",
    category: "hazardous",
    icon: AlertTriangle,
    content: `DO NOT TOUCH OR MOVE THE ITEM.

Immediate Actions:
1. Leave the area immediately
2. Keep others away from the item
3. Call 911 immediately
4. Provide your location and description

What NOT to Do:
• Do not touch, move, or try to identify the item
• Do not use your phone near the item
• Do not put it in water
• Do not attempt disposal yourself

For Old Fireworks:
• Soak in water for 24 hours
• Double-bag in plastic
• Contact your local fire department for disposal instructions`,
    keywords: ["explosives", "fireworks", "bombs", "dangerous", "emergency", "911"],
  },
  {
    id: "hazardous-chemicals",
    title: "Household Hazardous Waste",
    description: "Guide to disposing of common household hazardous materials",
    category: "hazardous",
    icon: AlertTriangle,
    content: `Common hazardous items that need special disposal:

Products:
• Paint, paint thinner, solvents
• Pesticides and herbicides
• Motor oil and automotive fluids
• Batteries (all types)
• Cleaning chemicals
• Fluorescent bulbs and CFLs

Disposal Options:
• Municipal hazardous waste collection events
• Permanent drop-off centers
• Retailer take-back programs

Find Your Location:
• Visit earth911.com
• Call your local waste management department
• Check with retailers for take-back programs

Never:
• Pour down drains
• Mix different chemicals
• Burn or bury hazardous waste`,
    keywords: ["chemicals", "paint", "batteries", "hazardous", "toxic", "poison"],
  },
  {
    id: "recycling-basics",
    title: "Recycling Basics",
    description: "Essential guide to what can and cannot be recycled",
    category: "recycling",
    icon: Recycle,
    content: `What Can Be Recycled:
• Clean paper and cardboard
• Glass bottles and jars
• Metal cans (aluminum and steel)
• Plastic bottles and containers (#1, #2, #5)

Prepare Items:
• Empty and rinse containers
• Remove caps and lids
• Flatten cardboard boxes
• Keep items dry

What NOT to Recycle:
• Plastic bags
• Styrofoam
• Food-contaminated items
• Broken glass
• Electronics

Tips for Better Recycling:
• When in doubt, check with your local facility
• Don't bag recyclables
• Keep recyclables loose in the bin`,
    keywords: ["recycling", "plastic", "paper", "cardboard", "bottles", "cans"],
  },
  {
    id: "composting-guide",
    title: "Home Composting Guide",
    description: "Start composting at home with this beginner-friendly guide",
    category: "composting",
    icon: Leaf,
    content: `What to Compost (Greens):
• Fruit and vegetable scraps
• Coffee grounds and filters
• Tea bags
• Fresh grass clippings
• Plant trimmings

What to Compost (Browns):
• Dry leaves
• Shredded paper
• Cardboard
• Wood chips
• Straw or hay

Do NOT Compost:
• Meat, fish, or bones
• Dairy products
• Oils or grease
• Pet waste
• Diseased plants

Composting Tips:
• Balance greens and browns (1:3 ratio)
• Keep the pile moist but not wet
• Turn regularly for faster decomposition
• Choose a shady spot with good drainage`,
    keywords: ["composting", "organic", "food scraps", "garden", "waste"],
  },
  {
    id: "plastic-types",
    title: "Understanding Plastic Types",
    description: "Learn about different plastic types and their recyclability",
    category: "recycling",
    icon: Package,
    content: `Plastic Resin Codes:

#1 PET/PETE (Polyethylene Terephthalate)
• Water bottles, soda bottles
• Widely recyclable

#2 HDPE (High-Density Polyethylene)
• Milk jugs, detergent bottles
• Widely recyclable

#3 PVC (Polyvinyl Chloride)
• Pipes, vinyl siding
• Rarely recyclable

#4 LDPE (Low-Density Polyethylene)
• Plastic bags, squeeze bottles
• Check local facilities

#5 PP (Polypropylene)
• Yogurt containers, bottle caps
• Increasingly recyclable

#6 PS (Polystyrene)
• Styrofoam, disposable cups
• Rarely recyclable

#7 Other
• Mixed plastics
• Rarely recyclable

Tips:
• Focus on #1 and #2 for easiest recycling
• Avoid #3, #6, #7 when possible
• Check your local recycling rules`,
    keywords: ["plastic", "types", "numbers", "pet", "hdpe", "recycling"],
  },
  {
    id: "electronics-disposal",
    title: "E-Waste Disposal",
    description: "Properly dispose of electronics and prevent toxic waste",
    category: "hazardous",
    icon: Package,
    content: `Electronic Waste Includes:
• Computers and laptops
• Phones and tablets
• TVs and monitors
• Batteries and chargers
• Small appliances
• Printers and accessories

Why E-Waste Matters:
• Contains toxic materials (lead, mercury)
• Contains valuable materials (gold, copper)
• Takes up landfill space
• Environmental hazard if improperly disposed

Where to Recycle:
• Manufacturer take-back programs
• Retailer trade-in programs
• Local e-waste collection events
• Certified e-waste recyclers
• Municipal hazardous waste facilities

Before Disposal:
• Back up your data
• Factory reset devices
• Remove batteries if possible
• Delete personal information`,
    keywords: ["electronics", "e-waste", "computers", "phones", "batteries"],
  },
];

const categoryConfig = {
  hazardous: { label: "Hazardous", color: "text-hazard" },
  recycling: { label: "Recycling", color: "text-success" },
  composting: { label: "Composting", color: "text-lime" },
  general: { label: "General", color: "text-primary" },
};

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.keywords.some((keyword) => keyword.includes(query))
    );
  });

  if (selectedArticle) {
    const Icon = selectedArticle.icon;
    const config = categoryConfig[selectedArticle.category];
    
    return (
      <div className="min-h-screen gradient-hero pb-24 pt-safe">
        <div className="px-6 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedArticle(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
          
          <Card className="p-6 shadow-soft animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className={cn("h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center")}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {config.label}
                </div>
                <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {selectedArticle.content.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                
                // Bold headers (lines ending with :)
                if (line.trim().endsWith(':')) {
                  return <p key={i} className="font-bold text-foreground mt-4 mb-2">{line}</p>;
                }
                
                // Bullet points
                if (line.trim().startsWith('•')) {
                  return <p key={i} className="text-muted-foreground ml-4">{line}</p>;
                }
                
                // Numbered lists
                if (/^\d+\./.test(line.trim())) {
                  return <p key={i} className="text-muted-foreground ml-4">{line}</p>;
                }
                
                return <p key={i} className="text-muted-foreground">{line}</p>;
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-24 pt-safe">
      <div className="px-6 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Articles</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Articles List */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {filteredArticles.map((article) => {
            const Icon = article.icon;
            const config = categoryConfig[article.category];

            return (
              <Card
                key={article.id}
                className="p-4 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0")}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {config.label}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
