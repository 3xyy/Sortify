import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const routes = ["/", "/history", "/articles", "/settings"];

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const verticalThreshold = 100;
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      // Ignore if vertical scroll
      if (diffY > verticalThreshold) return;
      if (Math.abs(diffX) < swipeThreshold) return;

      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex === -1) return;

      // Add haptic feedback
      if ('vibrate' in navigator && navigator.vibrate) {
        try {
          navigator.vibrate([15, 10, 15]);
        } catch (e) {
          console.log("Haptic feedback not supported:", e);
        }
      }

      if (diffX > 0 && currentIndex < routes.length - 1) {
        // Swiped left - go to next page
        navigate(routes[currentIndex + 1]);
      } else if (diffX < 0 && currentIndex > 0) {
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
