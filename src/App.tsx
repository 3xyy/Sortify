import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useServiceWorkerUpdate } from "./hooks/useServiceWorkerUpdate";

const queryClient = new QueryClient();

// App version: 12.13.25.02.04
const AppContent = () => {
  useServiceWorkerUpdate();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DemoProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppContent />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/install" element={<InstallPage />} />
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
