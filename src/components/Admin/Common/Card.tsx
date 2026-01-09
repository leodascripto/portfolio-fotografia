// src/components/Admin/Common/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, actions, className = '' }) => {
  return (
    <motion.div
      className={`admin-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || actions) && (
        <div className="admin-card-header">
          {title && <h3>{title}</h3>}
          {actions && <div className="admin-card-actions">{actions}</div>}
        </div>
      )}
      <div className="admin-card-body">{children}</div>
    </motion.div>
  );
};

export default Card;