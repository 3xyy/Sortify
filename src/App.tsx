import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import ResultPage from "./pages/ResultPage";
import InstallPage from "./pages/InstallPage";
import ArticlesPage from "./pages/ArticlesPage";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";
import { DemoProvider } from "./contexts/DemoContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const PWAGuard = ({ children }: { children: React.ReactNode }) => {
  const [isPWA, setIsPWA] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      setIsPWA(isStandalone);
      setIsChecking(false);
    };
    
    checkPWA();
  }, []);

  if (isChecking) {
    return null;
  }

  if (!isPWA) {
    return <Navigate to="/install" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DemoProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/install" replace />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="/home" element={<PWAGuard><Home /></PWAGuard>} />
              <Route path="/history" element={<PWAGuard><HistoryPage /></PWAGuard>} />
              <Route path="/articles" element={<PWAGuard><ArticlesPage /></PWAGuard>} />
              <Route path="/settings" element={<PWAGuard><SettingsPage /></PWAGuard>} />
              <Route path="/result/:id" element={<PWAGuard><ResultPage /></PWAGuard>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </TooltipProvider>
      </DemoProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
