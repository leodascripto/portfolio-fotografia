// src/components/LanguageSelector/LanguageSelector.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/lib/i18n';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  showLabel = true,
  position = 'top-right' 
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: position.includes('top') ? 10 : -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: position.includes('top') ? 10 : -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className={`language-selector-container ${className}`}>
      <motion.button
        className="language-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
      >
        <span className="current-language-flag">{currentLanguage.flag}</span>
        {showLabel && (
          <span className="current-language-name">{currentLanguage.name}</span>
        )}
        <motion.i 
          className="fa fa-chevron-down"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`language-dropdown ${position}`}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className={`language-dropdown-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                whileHover={{ backgroundColor: 'rgba(227, 202, 102, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="language-option-flag">{lang.flag}</span>
                <span className="language-option-name">{lang.name}</span>
                {language === lang.code && (
                  <motion.i 
                    className="fa fa-check"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="language-selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;