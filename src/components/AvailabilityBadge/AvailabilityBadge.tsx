// src/components/AvailabilityBadge/AvailabilityBadge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface AvailabilityBadgeProps {
  variant?: 'limited' | 'available' | 'busy';
  showOnMobileOnly?: boolean;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ 
  variant = 'limited',
  showOnMobileOnly = false 
}) => {
  const { t } = useLanguage();

  // Configurações por variante
  const config = {
    limited: {
      icon: '⚡',
      text: t.availability?.limited || 'Vagas Limitadas - Janeiro 2025',
      color: '#ff9800',
      pulse: true
    },
    available: {
      icon: '✅',
      text: t.availability?.available || 'Disponível Agora',
      color: '#4caf50',
      pulse: true
    },
    busy: {
      icon: '📅',
      text: t.availability?.busy || 'Agenda Cheia - Fevereiro Disponível',
      color: '#f44336',
      pulse: false
    }
  };

  const current = config[variant];

  return (
    <motion.div
      className={`availability-badge ${showOnMobileOnly ? 'mobile-only' : ''}`}
      style={{ 
        borderColor: current.color,
        '--badge-color': current.color 
      } as React.CSSProperties}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring" }}
    >
      <motion.span 
        className="status-dot"
        style={{ background: current.color }}
        animate={current.pulse ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{
          repeat: current.pulse ? Infinity : 0,
          duration: 2
        }}
      />
      <span className="status-icon">{current.icon}</span>
      <span className="status-text">{current.text}</span>
    </motion.div>
  );
};

export default AvailabilityBadge;