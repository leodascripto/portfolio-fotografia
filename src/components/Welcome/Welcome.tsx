// src/components/Welcome/Welcome.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionParticles from '@/components/SectionParticles/SectionParticles';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const { setLanguage, t } = useLanguage();

  // Detecção automática de idioma
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguages = ['pt', 'en', 'ja'];
      const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'pt';
      setLanguage(detectedLang);
    };

    detectLanguage();
  }, [setLanguage]);

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

  return (
    <motion.div
      className="welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="welcome-content">
        {/* Logo (já contém o nome) */}
        <motion.div className="welcome-logo" variants={itemVariants}>
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

        {/* Foto Profissional do Leo */}
        <motion.div className="welcome-profile" variants={itemVariants}>
          <div className="profile-image-container">
            <Image
              src="/assets/img/leo-profile.jpg"
              alt="Leo Oli - Fotógrafo Profissional"
              width={180}
              height={180}
              priority
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '50%',
                border: '4px solid var(--primary-gold)',
                boxShadow: '0 8px 30px rgba(227, 202, 102, 0.3)'
              }}
            />
          </div>
        </motion.div>

        {/* Tagline & Credenciais (SEM repetir o nome) */}
        <motion.div className="welcome-credentials" variants={itemVariants}>
          <p className="welcome-tagline">
            {t.welcome?.tagline || 'Transformo momentos em arte que conta histórias'}
          </p>
          <div className="credentials-badges">
            <span className="credential-badge">
              🎓 {t.welcome?.education || 'Formado em Fotografia Digital - FIAP'}
            </span>
            <span className="credential-badge">
              📍 {t.welcome?.location || 'São Paulo, Brasil'}
            </span>
            <span className="credential-badge">
              ⭐ {t.welcome?.experience || 'Especialista em Retratos & Ensaios'}
            </span>
          </div>
        </motion.div>

        {/* Botão de entrada */}
        <motion.div className="welcome-actions" variants={itemVariants}>
          <motion.button
            className="enter-button"
            onClick={onComplete}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {t.welcome?.enter || 'Ver Meus Trabalhos'}
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

        {/* Nota de idioma */}
        <motion.p 
          className="language-note"
          variants={itemVariants}
        >
          {t.welcome?.languageNote || 'Idioma detectado automaticamente • Altere no menu'}
        </motion.p>
      </div>

      <SectionParticles 
        section="welcome" 
        intensity="high" 
        className="welcome-content intense-particles"
      />
    </motion.div>
  );
};

export default Welcome;