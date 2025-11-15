import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  itemName: string;
  category: string;
  categoryLabel: string;
  instructions: string[];
  co2Saved: string;
  onClose: () => void;
}

export const ChatInterface = ({ itemName, category, categoryLabel, instructions, co2Saved, onClose }: ChatInterfaceProps) => {
  const suggestedQuestions = [
    `Why is this ${categoryLabel.toLowerCase()}?`,
    "What should I do before disposing?",
    "How much environmental impact does this have?",
  ];
  const chatKey = `chat_history_${itemName.replace(/\s+/g, '_')}`;
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        role: "assistant",
        content: `Hi! I'm here to answer questions about your ${itemName}. What would you like to know?`,
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, chatKey]);

  // Hide bottom nav when chat is open
  useEffect(() => {
    const bottomNav = document.querySelector('nav');
    if (bottomNav) {
      (bottomNav as HTMLElement).style.display = 'none';
    }
    return () => {
      if (bottomNav) {
        (bottomNav as HTMLElement).style.cssText = `
          display: block !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          transform: translate3d(0, 0, 0) !important;
        `;
      }
    };
  }, []);

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setIsLoading(true);

    // Generate response based on actual data
    setTimeout(() => {
      let response = "";
      
      if (messageText.toLowerCase().includes("why is this")) {
        response = `The material ${itemName} is ${categoryLabel.toLowerCase()} because it can be properly processed through ${category === "recycle" ? "recycling facilities" : category === "compost" ? "composting systems" : category === "hazardous" ? "specialized hazardous waste facilities" : "standard waste disposal"}.`;
      } else if (messageText.toLowerCase().includes("before disposing")) {
        response = `Before disposing:\n${instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}`;
      } else if (messageText.toLowerCase().includes("environmental impact")) {
        const co2Value = parseFloat(co2Saved.match(/[\d.]+/)?.[0] || "0");
        response = `This has ${co2Saved}. That's equivalent to ${(co2Value * 2.2).toFixed(1)} miles driven in an average car, or charging ${Math.round(co2Value * 121)} smartphones. By properly disposing of this item, you're making a positive environmental impact!`;
      } else {
        response = "I can help answer questions about why this item fits its category, proper disposal steps, or its environmental impact. Try one of the suggested questions below!";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 max-h-[85vh] animate-slide-up">
        <Card className="rounded-t-3xl rounded-b-none border-t shadow-large">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Ask About This Item</h3>
                <p className="text-xs text-muted-foreground">{itemName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[50vh] p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[75%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions - Always visible */}
          <div className="px-4 py-3 pb-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Tap a question to ask:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
