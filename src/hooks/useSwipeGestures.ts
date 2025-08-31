// src/hooks/useSwipeGestures.ts
import { useCallback, useRef, useEffect } from 'react';

interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
  trackTouch?: boolean;
  hapticFeedback?: boolean;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeMove?: (progress: number, direction: SwipeDirection) => void;
  onSwipeEnd?: () => void;
}

type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

interface SwipeState {
  start: TouchPoint | null;
  current: TouchPoint | null;
  direction: SwipeDirection;
  isActive: boolean;
  distance: number;
  velocity: number;
  progress: number;
}

const defaultConfig: Required<SwipeConfig> = {
  threshold: 50,
  velocity: 0.3,
  preventDefaultTouchmoveEvent: false,
  trackMouse: false,
  trackTouch: true,
  hapticFeedback: true
};

export const useSwipeGestures = (
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const finalConfig = { ...defaultConfig, ...config };
  const elementRef = useRef<HTMLElement>(null);
  const swipeStateRef = useRef<SwipeState>({
    start: null,
    current: null,
    direction: null,
    isActive: false,
    distance: 0,
    velocity: 0,
    progress: 0
  });

  // Haptic feedback function
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!finalConfig.hapticFeedback) return;
    
    if (typeof window !== 'undefined' && 'navigator' in window) {
      // @ts-ignore - Haptic feedback API
      if (navigator.vibrate) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30]
        };
        navigator.vibrate(patterns[type]);
      }
      
      // iOS Haptic Feedback
      // @ts-ignore
      if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        // @ts-ignore
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(patterns[type]);
        }
      }
    }
  }, [finalConfig.hapticFeedback]);

  // Get touch/mouse coordinates
  const getCoordinates = useCallback((event: TouchEvent | MouseEvent): TouchPoint => {
    const isTouch = 'touches' in event;
    const clientX = isTouch ? event.touches[0]?.clientX : (event as MouseEvent).clientX;
    const clientY = isTouch ? event.touches[0]?.clientY : (event as MouseEvent).clientY;
    
    return {
      x: clientX || 0,
      y: clientY || 0,
      time: Date.now()
    };
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((start: TouchPoint, end: TouchPoint): number => {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  }, []);

  // Determine swipe direction
  const getSwipeDirection = useCallback((start: TouchPoint, end: TouchPoint): SwipeDirection => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Calculate velocity
  const calculateVelocity = useCallback((start: TouchPoint, end: TouchPoint, distance: number): number => {
    const timeDelta = end.time - start.time;
    return timeDelta > 0 ? distance / timeDelta : 0;
  }, []);

  // Calculate progress (0-1) based on distance and threshold
  const calculateProgress = useCallback((distance: number): number => {
    return Math.min(distance / finalConfig.threshold, 1);
  }, [finalConfig.threshold]);

  // Handle start
  const handleStart = useCallback((event: TouchEvent | MouseEvent) => {
    if (!finalConfig.trackTouch && 'touches' in event) return;
    if (!finalConfig.trackMouse && !('touches' in event)) return;

    const coordinates = getCoordinates(event);
    swipeStateRef.current = {
      start: coordinates,
      current: coordinates,
      direction: null,
      isActive: true,
      distance: 0,
      velocity: 0,
      progress: 0
    };

    triggerHaptic('light');
  }, [finalConfig.trackTouch, finalConfig.trackMouse, getCoordinates, triggerHaptic]);

  // Handle move
  const handleMove = useCallback((event: TouchEvent | MouseEvent) => {
    const state = swipeStateRef.current;
    if (!state.isActive || !state.start) return;

    if (finalConfig.preventDefaultTouchmoveEvent && 'preventDefault' in event) {
      event.preventDefault();
    }

    const current = getCoordinates(event);
    const distance = calculateDistance(state.start, current);
    const direction = getSwipeDirection(state.start, current);
    const progress = calculateProgress(distance);
    const velocity = calculateVelocity(state.start, current, distance);

    swipeStateRef.current = {
      ...state,
      current,
      direction,
      distance,
      velocity,
      progress
    };

    // Trigger haptic feedback at 50% progress
    if (progress >= 0.5 && state.progress < 0.5) {
      triggerHaptic('medium');
    }

    // Call onSwipeStart when direction is first determined
    if (direction && !state.direction && handlers.onSwipeStart) {
      handlers.onSwipeStart(direction);
    }

    // Call onSwipeMove
    if (handlers.onSwipeMove && direction) {
      handlers.onSwipeMove(progress, direction);
    }
  }, [
    finalConfig.preventDefaultTouchmoveEvent,
    getCoordinates,
    calculateDistance,
    getSwipeDirection,
    calculateProgress,
    calculateVelocity,
    triggerHaptic,
    handlers
  ]);

  // Handle end
  const handleEnd = useCallback(() => {
    const state = swipeStateRef.current;
    if (!state.isActive || !state.start || !state.current) return;

    const { distance, velocity, direction } = state;
    const meetsThreshold = distance >= finalConfig.threshold;
    const meetsVelocity = velocity >= finalConfig.velocity;

    if ((meetsThreshold || meetsVelocity) && direction) {
      // Trigger appropriate handler
      switch (direction) {
        case 'left':
          if (handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
            triggerHaptic('heavy');
          }
          break;
        case 'right':
          if (handlers.onSwipeRight) {
            handlers.onSwipeRight();
            triggerHaptic('heavy');
          }
          break;
        case 'up':
          if (handlers.onSwipeUp) {
            handlers.onSwipeUp();
            triggerHaptic('heavy');
          }
          break;
        case 'down':
          if (handlers.onSwipeDown) {
            handlers.onSwipeDown();
            triggerHaptic('heavy');
          }
          break;
      }
    }

    // Reset state
    swipeStateRef.current = {
      start: null,
      current: null,
      direction: null,
      isActive: false,
      distance: 0,
      velocity: 0,
      progress: 0
    };

    if (handlers.onSwipeEnd) {
      handlers.onSwipeEnd();
    }
  }, [finalConfig.threshold, finalConfig.velocity, handlers, triggerHaptic]);

  // Setup event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events
    if (finalConfig.trackTouch) {
      element.addEventListener('touchstart', handleStart, { passive: false });
      element.addEventListener('touchmove', handleMove, { passive: !finalConfig.preventDefaultTouchmoveEvent });
      element.addEventListener('touchend', handleEnd, { passive: true });
      element.addEventListener('touchcancel', handleEnd, { passive: true });
    }

    // Mouse events
    if (finalConfig.trackMouse) {
      element.addEventListener('mousedown', handleStart);
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseup', handleEnd);
      element.addEventListener('mouseleave', handleEnd);
    }

    return () => {
      if (finalConfig.trackTouch) {
        element.removeEventListener('touchstart', handleStart);
        element.removeEventListener('touchmove', handleMove);
        element.removeEventListener('touchend', handleEnd);
        element.removeEventListener('touchcancel', handleEnd);
      }

      if (finalConfig.trackMouse) {
        element.removeEventListener('mousedown', handleStart);
        element.removeEventListener('mousemove', handleMove);
        element.removeEventListener('mouseup', handleEnd);
        element.removeEventListener('mouseleave', handleEnd);
      }
    };
  }, [
    finalConfig.trackTouch,
    finalConfig.trackMouse,
    finalConfig.preventDefaultTouchmoveEvent,
    handleStart,
    handleMove,
    handleEnd
  ]);

  return {
    elementRef,
    swipeState: swipeStateRef.current,
    triggerHaptic
  };
};