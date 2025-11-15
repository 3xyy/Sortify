import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const routes = ["/", "/history", "/articles", "/settings"];

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 100;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < swipeThreshold) return;

      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex === -1) return;

      if (diff > 0 && currentIndex < routes.length - 1) {
        // Swiped left - go to next page
        navigate(routes[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        // Swiped right - go to previous page
        navigate(routes[currentIndex - 1]);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate, location.pathname]);
};
