// src/components/Welcome/Welcome.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/lib/i18n';
import SectionParticles from '@/components/SectionParticles/SectionParticles';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
  };

  const handleEnter = () => {
    onComplete();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="welcome-content">
        {/* Logo */}
        <motion.div className="welcome-logo" variants={logoVariants}>
          <Image
            src="/assets/img/logo.png"
            alt="Leo Oli - Fotógrafo"
            width={400}
            height={230}
            priority
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto'
            }}
          />
        </motion.div>

        {/* Textos de boas-vindas */}
        <motion.div className="welcome-texts" variants={itemVariants}>
          <h1 className="welcome-title">{t.welcome.title}</h1>
          <p className="welcome-subtitle">{t.welcome.subtitle}</p>
        </motion.div>

        {/* Seleção de idioma */}
        <motion.div className="language-selection" variants={itemVariants}>
          <h2 className="language-label">{t.welcome.selectLanguage}</h2>
          <div className="language-options">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className={`language-option ${selectedLang === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Botão de entrada */}
        <motion.div className="welcome-actions" variants={itemVariants}>
          <motion.button
            className="enter-button"
            onClick={handleEnter}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {t.welcome.enter}
            <motion.i
              className="fa fa-arrow-right"
              initial={{ x: 0 }}
              animate={{ x: 5 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Partículas decorativas */}
      <SectionParticles 
        section="welcome" 
        intensity="high" 
        className="welcome-content intense-particles"
      />
    </motion.div>
  );
};

export default Welcome;