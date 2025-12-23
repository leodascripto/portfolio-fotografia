// src/components/Filters/Filters.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FilterProps } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

// Mapeamento de ícones por categoria
const categoryIcons: Record<string, string> = {
  '*': '🎨',        // Todos
  'debora': '👤',   // Retratos
  'giovanna': '✨', // Ensaios
  'lisa': '💫',     // Artístico
  'gustavo': '🎭',  // Criativo
  'fernanda': '🌸', // Delicado
  'akira': '⚡',    // Energético
  'leooli': '📸',   // Portfolio
  'mariana': '🌺',  // Feminino
  'vitoria': '👑'   // Elegante
};

const Filters: React.FC<FilterProps> = ({ filters, activeFilter, onFilterChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const { t } = useLanguage();

  const checkScrollable = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      setShowLeftIndicator(scrollLeft > 10);
      setShowRightIndicator(scrollLeft < maxScroll - 10);
    }
  };

  useEffect(() => {
    checkScrollable();
    const container = containerRef.current;
    
    if (container) {
      container.addEventListener('scroll', checkScrollable);
      return () => container.removeEventListener('scroll', checkScrollable);
    }
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const handleFilterClick = (filterValue: string) => {
    onFilterChange(filterValue);
    
    if (window.matchMedia('(max-width: 768px)').matches) {
      const galleryElement = document.getElementById('gallery-container');
      if (galleryElement) {
        const galleryTop = galleryElement.offsetTop - 100;
        window.scrollTo({
          top: galleryTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const getFilterLabel = (filter: any) => {
    if (filter.value === '*') {
      return t.navigation.all || 'Ver Tudo';
    }
    return filter.label;
  };

  const getFilterIcon = (filterValue: string): string => {
    return categoryIcons[filterValue] || '📷';
  };

  return (
    <motion.nav
      className="filters"
      role="navigation"
      aria-label="Filtros de categorias"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="filters-wrapper">
        {showLeftIndicator && (
          <motion.div
            className="scroll-indicator left"
            onClick={scrollLeft}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fa fa-chevron-left" />
          </motion.div>
        )}

        <div className="filters-container" ref={containerRef}>
          <ul className="filters-list">
            {filters.map((filter, index) => (
              <motion.li
                key={filter.value}
                className={activeFilter === filter.value ? 'active' : ''}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
              >
                <motion.button
                  type="button"
                  onClick={() => handleFilterClick(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="filter-icon">{getFilterIcon(filter.value)}</span>
                  <span className="filter-label">{getFilterLabel(filter)}</span>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </div>

        {showRightIndicator && (
          <motion.div
            className="scroll-indicator right"
            onClick={scrollRight}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fa fa-chevron-right" />
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Filters;