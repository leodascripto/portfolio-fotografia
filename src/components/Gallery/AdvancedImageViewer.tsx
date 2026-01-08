// src/components/Gallery/AdvancedImageViewer.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { Photo } from '@/types';

interface AdvancedImageViewerProps {
  photo: Photo;
  isActive: boolean;
  onClose: () => void;
}

interface TouchPoint {
  x: number;
  y: number;
}

interface GestureState {
  scale: number;
  x: number;
  y: number;
  lastDistance: number;
  lastCenter: TouchPoint;
  isPinching: boolean;
  isPanning: boolean;
}

const AdvancedImageViewer: React.FC<AdvancedImageViewerProps> = ({
  photo,
  isActive,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const [gestureState, setGestureState] = useState<GestureState>({
    scale: 1,
    x: 0,
    y: 0,
    lastDistance: 0,
    lastCenter: { x: 0, y: 0 },
    isPinching: false,
    isPanning: false
  });
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [doubleTapTimeout, setDoubleTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      // @ts-ignore
      if (navigator.vibrate) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30]
        };
        navigator.vibrate(patterns[type]);
      }
    }
  }, []);

  // FIX: Converter React.TouchList para array
  const getDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const getCenter = useCallback((touches: React.TouchList): TouchPoint => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }, []);

  const constrainPosition = useCallback((newX: number, newY: number, currentScale: number) => {
    if (!containerRef.current) return { x: newX, y: newY };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const maxX = (containerRect.width * (currentScale - 1)) / 2;
    const maxY = (containerRect.height * (currentScale - 1)) / 2;
    
    return {
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    };
  }, []);

  const resetImage = useCallback(() => {
    scale.set(1);
    x.set(0);
    y.set(0);
    setGestureState(prev => ({ ...prev, scale: 1, x: 0, y: 0 }));
    triggerHaptic('light');
  }, [scale, x, y, triggerHaptic]);

  const zoomToPosition = useCallback((targetScale: number, centerX: number, centerY: number) => {
    const currentScale = gestureState.scale;
    const scaleRatio = targetScale / currentScale;
    
    const newX = (gestureState.x - centerX) * scaleRatio + centerX;
    const newY = (gestureState.y - centerY) * scaleRatio + centerY;
    
    const constrainedPos = constrainPosition(newX, newY, targetScale);
    
    scale.set(targetScale);
    x.set(constrainedPos.x);
    y.set(constrainedPos.y);
    
    setGestureState(prev => ({
      ...prev,
      scale: targetScale,
      x: constrainedPos.x,
      y: constrainedPos.y
    }));
    
    triggerHaptic('medium');
  }, [gestureState, scale, x, y, constrainPosition, triggerHaptic]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      const center = getCenter(e.touches);
      
      setGestureState(prev => ({
        ...prev,
        lastDistance: distance,
        lastCenter: center,
        isPinching: true,
        isPanning: false
      }));
    } else if (e.touches.length === 1) {
      setGestureState(prev => ({
        ...prev,
        isPanning: true,
        isPinching: false
      }));
    }
  }, [getDistance, getCenter]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && gestureState.isPinching) {
      const distance = getDistance(e.touches);
      const center = getCenter(e.touches);
      
      if (gestureState.lastDistance > 0) {
        const scaleChange = distance / gestureState.lastDistance;
        const newScale = Math.max(0.5, Math.min(5, gestureState.scale * scaleChange));
        
        const centerDeltaX = center.x - gestureState.lastCenter.x;
        const centerDeltaY = center.y - gestureState.lastCenter.y;
        
        const newX = gestureState.x + centerDeltaX;
        const newY = gestureState.y + centerDeltaY;
        
        const constrainedPos = constrainPosition(newX, newY, newScale);
        
        scale.set(newScale);
        x.set(constrainedPos.x);
        y.set(constrainedPos.y);
        
        setGestureState(prev => ({
          ...prev,
          scale: newScale,
          x: constrainedPos.x,
          y: constrainedPos.y,
          lastDistance: distance,
          lastCenter: center
        }));
      }
    }
  }, [gestureState, getDistance, getCenter, scale, x, y, constrainPosition]);

  const handleTouchEnd = useCallback(() => {
    setGestureState(prev => ({
      ...prev,
      isPinching: false,
      isPanning: false
    }));
  }, []);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (gestureState.isPinching || gestureState.scale <= 1) return;
    
    const newX = gestureState.x + info.delta.x;
    const newY = gestureState.y + info.delta.y;
    
    const constrainedPos = constrainPosition(newX, newY, gestureState.scale);
    
    x.set(constrainedPos.x);
    y.set(constrainedPos.y);
    
    setGestureState(prev => ({
      ...prev,
      x: constrainedPos.x,
      y: constrainedPos.y
    }));
  }, [gestureState, x, y, constrainPosition]);

  const handleTap = useCallback((e: React.TouchEvent) => {
    if (doubleTapTimeout) {
      clearTimeout(doubleTapTimeout);
      setDoubleTapTimeout(null);
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.changedTouches[0];
        const centerX = touch.clientX - rect.left - rect.width / 2;
        const centerY = touch.clientY - rect.top - rect.height / 2;
        
        if (gestureState.scale > 1.5) {
          resetImage();
        } else {
          zoomToPosition(2.5, centerX, centerY);
        }
      }
    } else {
      const timeout = setTimeout(() => {
        setDoubleTapTimeout(null);
      }, 300);
      setDoubleTapTimeout(timeout);
    }
  }, [doubleTapTimeout, gestureState.scale, resetImage, zoomToPosition]);

  useEffect(() => {
    return () => {
      if (doubleTapTimeout) {
        clearTimeout(doubleTapTimeout);
      }
    };
  }, [doubleTapTimeout]);

  useEffect(() => {
    if (isActive) {
      resetImage();
      setImageLoaded(false);
    }
  }, [isActive, photo.src, resetImage]);

  if (!isActive) return null;

  return (
    <motion.div
      ref={containerRef}
      className="advanced-image-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchEndCapture={handleTap}
    >
      {!imageLoaded && (
        <div className="image-loading">
          <div className="loading-spinner" />
        </div>
      )}

      <div className="zoom-controls">
        <button 
          className="zoom-control zoom-out"
          onTouchStart={(e) => e.stopPropagation()}
          onClick={() => {
            const newScale = Math.max(0.5, gestureState.scale - 0.5);
            zoomToPosition(newScale, 0, 0);
          }}
        >
          <i className="fa fa-minus" />
        </button>
        
        <div className="zoom-indicator">
          {Math.round(gestureState.scale * 100)}%
        </div>
        
        <button 
          className="zoom-control zoom-in"
          onTouchStart={(e) => e.stopPropagation()}
          onClick={() => {
            const newScale = Math.min(5, gestureState.scale + 0.5);
            zoomToPosition(newScale, 0, 0);
          }}
        >
          <i className="fa fa-plus" />
        </button>
      </div>

      {gestureState.scale > 1 && (
        <motion.button
          className="reset-zoom"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={resetImage}
        >
          <i className="fa fa-refresh" />
        </motion.button>
      )}

      <motion.div
        ref={imageRef}
        className="image-container-advanced"
        style={{
          scale,
          x,
          y
        }}
        drag={gestureState.scale > 1}
        dragConstraints={containerRef}
        dragElastic={0.1}
        onPan={handlePan}
      >
        <Image
          src={photo.src}
          alt={photo.name}
          width={800}
          height={600}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          onLoad={() => setImageLoaded(true)}
          priority
        />
      </motion.div>

      <button 
        className="close-advanced-viewer"
        onTouchStart={(e) => e.stopPropagation()}
        onClick={onClose}
      >
        <i className="fa fa-times" />
      </button>

      <div className="viewer-instructions">
        <p>Pinça para zoom • Arraste para mover • Toque duplo para zoom rápido</p>
      </div>
    </motion.div>
  );
};

export default AdvancedImageViewer;