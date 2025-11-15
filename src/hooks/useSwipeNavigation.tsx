import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const routes = ["/", "/history", "/articles", "/settings"];

export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isTouching = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);
      
      // Ignore if vertical scroll
      if (diffY > 50) {
        setIsSwiping(false);
        return;
      }
      
      // Show swipe progress if horizontal movement is detected
      if (Math.abs(diffX) > 20) {
        setIsSwiping(true);
        const progress = Math.min(Math.abs(diffX) / 100, 1);
        setSwipeProgress(progress);
        
        // Get current and target page indices
        const currentIndex = routes.indexOf(location.pathname);
        const nextIndex = diffX > 0 ? currentIndex + 1 : currentIndex - 1;
        
        // Only show animation if there's a valid next page
        if (nextIndex >= 0 && nextIndex < routes.length) {
          // Apply smooth transform showing both current and next page
          const containers = document.querySelectorAll('[data-page-container]');
          containers.forEach((container) => {
            (container as HTMLElement).style.transform = `translateX(${-diffX}px)`;
            (container as HTMLElement).style.transition = 'none';
            (container as HTMLElement).style.opacity = String(1 - Math.abs(diffX) / 200);
          });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouching) return;
      
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      isTouching = false;
      
      // Reset visual state with smooth animation
      const containers = document.querySelectorAll('[data-page-container]');
      containers.forEach((container) => {
        (container as HTMLElement).style.transform = '';
        (container as HTMLElement).style.opacity = '1';
        (container as HTMLElement).style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      });
      
      setTimeout(() => {
        containers.forEach((container) => {
          (container as HTMLElement).style.transition = '';
        });
        setIsSwiping(false);
        setSwipeProgress(0);
      }, 300);
      
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 100; // Increased from 50 to make it less sensitive
      const verticalThreshold = 50;
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      // Ignore if vertical scroll
      if (diffY > verticalThreshold) return;
      if (Math.abs(diffX) < swipeThreshold) return;

      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex === -1) return;

      // Add haptic feedback
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(50); // Single strong vibration
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

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      
      // Clean up any stuck transforms
      const containers = document.querySelectorAll('[data-page-container]');
      containers.forEach((container) => {
        (container as HTMLElement).style.transform = '';
        (container as HTMLElement).style.transition = '';
        (container as HTMLElement).style.opacity = '1';
      });
    };
  }, [navigate, location.pathname]);

  return { swipeProgress, isSwiping };
};
