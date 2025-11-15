import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Trash2, Recycle, Leaf, Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  category: "hazardous" | "recycling" | "composting" | "general";
  icon: typeof AlertTriangle;
  content: string;
  keywords: string[];
}

const articles: Article[] = [
  {
    id: "hazardous-needles",
    title: "Disposing of Needles & Sharps",
    category: "hazardous",
    icon: AlertTriangle,
    content: `**Never throw needles or sharps in regular trash or recycling.**

**Proper Disposal:**
- Use a sharps container or hard plastic bottle
- Seal the container when full
- Take to a designated collection site

**Where to Dispose:**
- Hospitals and medical centers
- Pharmacies (many offer sharps disposal)
- Household hazardous waste facilities
- Visit [safeneedledisposal.org](https://safeneedledisposal.org) to find locations

**Important:** Never recap needles. Label containers clearly as "Sharps - Do Not Recycle"`,
    keywords: ["needles", "sharps", "medical", "hazardous", "dangerous"],
  },
  {
    id: "hazardous-explosives",
    title: "Found Explosives or Suspicious Items",
    category: "hazardous",
    icon: AlertTriangle,
    content: `**DO NOT TOUCH OR MOVE THE ITEM.**

**Immediate Actions:**
1. Leave the area immediately
2. Keep others away from the item
3. Call 911 immediately
4. Provide your location and description

**What NOT to Do:**
- Do not touch, move, or try to identify the item
- Do not use your phone near the item
- Do not put it in water
- Do not attempt disposal yourself

**For Old Fireworks:**
- Soak in water for 24 hours
- Double-bag in plastic
- Contact your local fire department for disposal instructions`,
    keywords: ["explosives", "fireworks", "bombs", "dangerous", "emergency", "911"],
  },
  {
    id: "hazardous-chemicals",
    title: "Household Hazardous Waste",
    category: "hazardous",
    icon: AlertTriangle,
    content: `**Common hazardous items that need special disposal:**

**Products:**
- Paint, paint thinner, solvents
- Pesticides and herbicides
- Motor oil and automotive fluids
- Batteries (all types)
- Cleaning chemicals
- Fluorescent bulbs and CFLs

**Disposal Options:**
- Municipal hazardous waste collection events
- Permanent drop-off centers
- Retailer take-back programs

**Find Your Location:**
- Visit [earth911.com](https://earth911.com)
- Call your local waste management department
- Check with retailers for take-back programs

**Never:**
- Pour down drains
- Mix different chemicals
- Burn or bury hazardous waste`,
    keywords: ["chemicals", "paint", "batteries", "hazardous", "toxic", "poison"],
  },
  {
    id: "recycling-basics",
    title: "Recycling Basics",
    category: "recycling",
    icon: Recycle,
    content: `**What Can Be Recycled:**
- Clean paper and cardboard
- Glass bottles and jars
- Metal cans (aluminum and steel)
- Plastic bottles and containers (#1, #2, #5)

**Prepare Items:**
- Empty and rinse containers
- Remove caps and lids
- Flatten cardboard boxes
- Keep items dry

**What NOT to Recycle:**
- Plastic bags
- Styrofoam
- Food-contaminated items
- Broken glass
- Electronics

**Tips for Better Recycling:**
- When in doubt, check with your local facility
- Don't bag recyclables
- Keep recyclables loose in the bin`,
    keywords: ["recycling", "plastic", "paper", "cardboard", "bottles", "cans"],
  },
  {
    id: "composting-guide",
    title: "Home Composting Guide",
    category: "composting",
    icon: Leaf,
    content: `**What to Compost (Greens):**
- Fruit and vegetable scraps
- Coffee grounds and filters
- Tea bags
- Grass clippings
- Fresh plant material

**What to Compost (Browns):**
- Dry leaves
- Shredded paper and cardboard
- Wood chips
- Straw or hay

**What NOT to Compost:**
- Meat, fish, or bones
- Dairy products
- Oils or fats
- Pet waste
- Diseased plants

**Tips:**
- Maintain a 3:1 ratio of browns to greens
- Keep compost moist but not soggy
- Turn regularly for faster decomposition
- Compost is ready when dark and crumbly`,
    keywords: ["compost", "organic", "food scraps", "garden", "soil"],
  },
  {
    id: "electronics-recycling",
    title: "Electronic Waste (E-Waste)",
    category: "recycling",
    icon: Package,
    content: `**E-Waste Includes:**
- Computers and laptops
- Phones and tablets
- TVs and monitors
- Printers and scanners
- Small appliances
- Cables and chargers

**Why E-Waste Matters:**
- Contains valuable materials (gold, silver, copper)
- May contain hazardous substances (lead, mercury)
- Should never go in regular trash

**Disposal Options:**
- Manufacturer take-back programs (Apple, Best Buy, etc.)
- E-waste recycling events
- Certified e-waste recyclers
- Donation to schools or nonprofits (if working)

**Before Recycling:**
- Back up your data
- Perform a factory reset
- Remove SIM cards and memory cards
- Delete personal information`,
    keywords: ["electronics", "e-waste", "computers", "phones", "recycling"],
  },
  {
    id: "plastic-types",
    title: "Understanding Plastic Numbers",
    category: "general",
    icon: Recycle,
    content: `**Plastic Resin Codes:**

**#1 PET (Polyethylene Terephthalate)**
- Water bottles, soda bottles
- Usually recyclable

**#2 HDPE (High-Density Polyethylene)**
- Milk jugs, detergent bottles
- Usually recyclable

**#3 PVC (Polyvinyl Chloride)**
- Pipes, vinyl siding
- Rarely recyclable

**#4 LDPE (Low-Density Polyethylene)**
- Plastic bags, squeeze bottles
- Sometimes recyclable

**#5 PP (Polypropylene)**
- Yogurt containers, bottle caps
- Increasingly recyclable

**#6 PS (Polystyrene)**
- Styrofoam, takeout containers
- Rarely recyclable

**#7 Other**
- Mixed plastics
- Usually not recyclable

**Tip:** Check with your local recycling program - accepted plastics vary by location!`,
    keywords: ["plastic", "numbers", "resin codes", "pet", "hdpe", "recycling"],
  },
];

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.keywords.some(keyword => keyword.includes(query))
    );
  });

  const categoryColors = {
    hazardous: "border-hazard bg-hazard/5",
    recycling: "border-primary bg-primary/5",
    composting: "border-success bg-success/5",
    general: "border-accent bg-accent/5",
  };

  return (
    <div className="min-h-screen gradient-hero pb-24 pt-6">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Recycling Guide</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base shadow-soft"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4 animate-fade-up">
          {filteredArticles.length === 0 ? (
            <Card className="p-8 text-center shadow-soft">
              <p className="text-muted-foreground">No articles found matching "{searchQuery}"</p>
            </Card>
          ) : (
            filteredArticles.map((article, index) => {
              const Icon = article.icon;
              return (
                <Card
                  key={article.id}
                  className={cn(
                    "p-6 shadow-soft hover:shadow-medium transition-smooth border-l-4",
                    categoryColors[article.category]
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                      article.category === "hazardous" && "bg-hazard/10",
                      article.category === "recycling" && "bg-primary/10",
                      article.category === "composting" && "bg-success/10",
                      article.category === "general" && "bg-accent/10"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        article.category === "hazardous" && "text-hazard",
                        article.category === "recycling" && "text-primary",
                        article.category === "composting" && "text-success",
                        article.category === "general" && "text-accent"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-3">{article.title}</h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground space-y-2">
                        {article.content.split('\n\n').map((paragraph, i) => {
                          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <p key={i} className="font-semibold text-foreground">
                                {paragraph.replace(/\*\*/g, '')}
                              </p>
                            );
                          }
                          if (paragraph.startsWith('- ')) {
                            return (
                              <ul key={i} className="list-disc pl-5 space-y-1">
                                {paragraph.split('\n').map((item, j) => (
                                  <li key={j}>{item.replace(/^- /, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={i}>{paragraph}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
