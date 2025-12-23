// src/components/SmartCTA/SmartCTA.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface SmartCTAProps {
  variant?: 'floating' | 'inline' | 'sticky-bottom';
}

const SmartCTA: React.FC<SmartCTAProps> = ({ variant = 'floating' }) => {
  const { t, language } = useLanguage();
  const [showInlineCTA, setShowInlineCTA] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollDepth(scrollPercent);
      
      if (scrollPercent > 30 && !showInlineCTA) {
        setShowInlineCTA(true);
      }

      if (scrollPercent > 10) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showInlineCTA]);

  const whatsappMessages = {
    pt: "Olá Leo! Adorei seu portfolio. Gostaria de agendar uma sessão de fotos profissional 📸✨",
    en: "Hi Leo! I loved your portfolio. I'd like to schedule a professional photo session 📸✨",
    ja: "こんにちはレオ！あなたのポートフォリオが大好きです。プロの写真撮影を予約したいです 📸✨"
  };

  const message = whatsappMessages[language as keyof typeof whatsappMessages] || whatsappMessages.pt;
  const whatsappLink = `https://wa.me/5511983157973?text=${encodeURIComponent(message)}`;

  const handleCTAClick = (ctaType: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': ctaType,
        'scroll_depth': Math.round(scrollDepth)
      });
    }
  };

  if (variant === 'floating') {
    return (
      <motion.a
        href={whatsappLink}
        className="smart-cta-floating"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleCTAClick('floating')}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          y: hasScrolled ? [0, -5, 0] : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          y: {
            repeat: hasScrolled ? Infinity : 0,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Agendar sessão via WhatsApp"
      >
        <motion.div 
          className="cta-icon"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <i className="fa fa-whatsapp" />
        </motion.div>
        
        <motion.div
          className="cta-pulse-ring"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeOut"
          }}
        />

        <AnimatePresence>
          {hasScrolled && (
            <motion.div
              className="cta-badge"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: 0.5 }}
            >
              {t.cta?.scheduleBadge || 'Agendar Sessão'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>
    );
  }

  if (variant === 'inline' && showInlineCTA) {
    return (
      <motion.div
        className="smart-cta-inline"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="cta-inline-content">
          <div className="cta-inline-icon">
            <i className="fa fa-camera" />
          </div>
          
          <div className="cta-inline-text">
            <h3>{t.cta?.inlineTitle || 'Gostou do que viu?'}</h3>
            <p>{t.cta?.inlineSubtitle || 'Vamos criar algo incrível juntos!'}</p>
          </div>
          
          <motion.a
            href={whatsappLink}
            className="cta-inline-button"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCTAClick('inline')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa fa-whatsapp" />
            {t.cta?.inlineButton || 'Chamar no WhatsApp'}
          </motion.a>
        </div>
      </motion.div>
    );
  }

  if (variant === 'sticky-bottom' && scrollDepth > 20) {
    return (
      <motion.div
        className="smart-cta-sticky"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="cta-sticky-content">
          <div className="cta-sticky-text">
            <strong>{t.cta?.stickyTitle || 'Pronto para sua sessão?'}</strong>
            <span>{t.cta?.stickySubtitle || 'Fale comigo agora!'}</span>
          </div>
          
          <motion.a
            href={whatsappLink}
            className="cta-sticky-button"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCTAClick('sticky')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa fa-whatsapp" />
            WhatsApp
          </motion.a>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default SmartCTA;