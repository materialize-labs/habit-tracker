import { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  minVelocity?: number;
  maxVerticalMovement?: number;
}

interface TouchInfo {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  minVelocity = 0.2,
  maxVerticalMovement = 50
}: SwipeInput = {}) {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const touchInfo = useRef<TouchInfo | null>(null);
  const frameRef = useRef<number>();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (touchInfo.current) return;

    touchInfo.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchInfo.current) return;

    const deltaX = e.touches[0].clientX - touchInfo.current.startX;
    const deltaY = Math.abs(e.touches[0].clientY - touchInfo.current.startY);

    // Cancel swipe if vertical movement is too large
    if (deltaY > maxVerticalMovement) {
      touchInfo.current = null;
      setSwipeProgress(0);
      return;
    }

    // Calculate progress as a value between -1 and 1
    const progress = Math.max(-1, Math.min(1, deltaX / threshold));
    
    // Use requestAnimationFrame for smooth updates
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      setSwipeProgress(progress);
    });
  }, [threshold, maxVerticalMovement]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchInfo.current) return;

    const deltaX = e.changedTouches[0].clientX - touchInfo.current.startX;
    const deltaTime = Date.now() - touchInfo.current.startTime;
    const velocity = Math.abs(deltaX) / deltaTime; // pixels per millisecond

    // Reset touch info
    touchInfo.current = null;

    // Reset progress with animation
    setSwipeProgress(0);

    // Check if swipe was fast enough
    if (velocity < minVelocity) return;

    // Determine swipe direction and trigger callback if threshold is met
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
  }, [threshold, minVelocity, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Clean up event listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Cancel any pending animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { swipeProgress };
} 