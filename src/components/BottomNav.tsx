import { Home, History, Settings, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: History, label: "History", path: "/history" },
  { icon: BookOpen, label: "Articles", path: "/articles" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const BottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsVisible(false);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Small delay to allow keyboard to close before showing navbar
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border pb-safe" style={{ 
      transform: 'translate3d(0, 0, 0)',
      WebkitTransform: 'translate3d(0, 0, 0)',
      position: 'fixed',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden'
    }}>
      <div className="max-w-md mx-auto px-6 py-0.5 mb-0.5">
        <div className="flex items-center justify-around gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-2xl transition-smooth min-w-[70px]",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-medium m-1" 
                    : "text-muted-foreground active:text-foreground active:bg-accent/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-scale-in")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
