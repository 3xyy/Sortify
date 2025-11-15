import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<"entering" | "exiting" | "idle">("idle");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("exiting");
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-transform duration-300 ease-out ${
        transitionStage === "exiting" ? "animate-slide-out-left" : "animate-slide-in-right"
      }`}
      onAnimationEnd={() => {
        if (transitionStage === "exiting") {
          setTransitionStage("entering");
          setDisplayLocation(location);
        } else {
          setTransitionStage("idle");
        }
      }}
    >
      {children}
    </div>
  );
};
