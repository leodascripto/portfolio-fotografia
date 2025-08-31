// src/components/PullToRefresh/PullToRefresh.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false,
  refreshingText = "Atualizando...",
  pullText = "Puxe para atualizar",
  releaseText = "Solte para atualizar"
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values para animação suave
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.5, 1]);
  const rotation = useTransform(y, [0, maxPullDistance], [0, 180]);

  // Verificar se pode fazer refresh (topo da página)
  const canStartRefresh = useCallback(() => {
    if (disabled || isRefreshing) return false;
    
    const container = containerRef.current;
    if (!container) return false;
    
    return container.scrollTop <= 0;
  }, [disabled, isRefreshing]);

  // Executar refresh
  const executeRefresh = useCallback(async () => {
    if (isRefreshing || !canRefresh) return;
    
    setIsRefreshing(true);
    setCanRefresh(false);
    
    try {
      await onRefresh();
      
      // Feedback haptic de sucesso
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      
      // Feedback haptic de erro
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    } finally {
      // Delay para mostrar animação de conclusão
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }, 500);
    }
  }, [isRefreshing, canRefresh, onRefresh, y]);

  // Configurar swipe gestures
  const { elementRef, triggerHaptic } = useSwipeGestures({
    onSwipeStart: (direction) => {
      if (direction === 'down' && canStartRefresh()) {
        triggerHaptic('light');
      }
    },
    
    onSwipeMove: (progress, direction) => {
      if (direction !== 'down' || !canStartRefresh()) return;
      
      const distance = Math.min(progress * maxPullDistance, maxPullDistance);
      setPullDistance(distance);
      y.set(distance);
      
      const shouldRefresh = distance >= threshold;
      if (shouldRefresh !== canRefresh) {
        setCanRefresh(shouldRefresh);
        triggerHaptic(shouldRefresh ? 'medium' : 'light');
      }
    },
    
    onSwipeEnd: () => {
      if (canRefresh && !isRefreshing) {
        executeRefresh();
      } else {
        // Voltar ao estado inicial
        setPullDistance(0);
        setCanRefresh(false);
        y.set(0);
      }
    }
  }, {
    threshold: threshold,
    velocity: 0.5,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    hapticFeedback: true
  });

  // Combinar refs
  useEffect(() => {
    if (containerRef.current) {
      elementRef.current = containerRef.current;
    }
  }, [elementRef]);

  // Texto atual baseado no estado
  const getCurrentText = () => {
    if (isRefreshing) return refreshingText;
    if (canRefresh) return releaseText;
    return pullText;
  };

  // Ícone atual baseado no estado
  const getCurrentIcon = () => {
    if (isRefreshing) return 'fa-refresh fa-spin';
    if (canRefresh) return 'fa-arrow-up';
    return 'fa-arrow-down';
  };

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container"
    >
      {/* Pull to refresh indicator */}
      <motion.div
        className="pull-to-refresh-indicator"
        style={{
          opacity,
          scale,
          y: -60
        }}
      >
        <motion.div
          className="refresh-icon-container"
          style={{ rotate: rotation }}
        >
          <i className={`fa ${getCurrentIcon()}`} />
        </motion.div>
        
        <motion.p
          className="refresh-text"
          animate={{ 
            color: canRefresh ? 'var(--primary-gold)' : 'var(--text-light)',
            scale: canRefresh ? 1.1 : 1
          }}
        >
          {getCurrentText()}
        </motion.p>
        
        {/* Progress indicator */}
        <div className="refresh-progress">
          <motion.div
            className="progress-bar"
            style={{
              width: `${Math.min((pullDistance / threshold) * 100, 100)}%`
            }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="pull-to-refresh-content"
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;