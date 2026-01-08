// src/components/PullToRefresh/PullToRefresh.tsx
import React from 'react';

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

/**
 * PullToRefresh Component
 * TODO: Implementar quando necessário
 * Atualmente desabilitado para evitar erros de build
 */
const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  return <>{children}</>;
};

export default PullToRefresh;