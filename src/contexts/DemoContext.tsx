import React, { createContext, useContext, useState, useEffect } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("demo-mode");
    if (stored === "true") {
      setIsDemoMode(true);
    }
  }, []);

  const enterDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem("demo-mode", "true");
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem("demo-mode");
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, enterDemoMode, exitDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoMode must be used within DemoProvider");
  }
  return context;
};
