// src/components/Header/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionParticles from '@/components/SectionParticles/SectionParticles';
import AvailabilityBadge from '@/components/AvailabilityBadge/AvailabilityBadge';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.header 
      className="header"
      style={{ position: 'relative', overflow: 'hidden' }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SectionParticles 
        section="header" 
        intensity="low" 
        className="header-content"
      />

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <Image
          id="logo"
          src="/assets/img/logo.png"
          alt="Leo Oli - Fotógrafo"
          width={350}
          height={200}
          priority
          style={{
            width: '90%',
            maxWidth: '350px',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </motion.h1>
      
      {/* Tagline Profissional */}
      <motion.div
        className="header-tagline"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <h2 className="main-tagline">
          {t.header?.mainTagline || 'Fotógrafo Profissional em São Paulo'}
        </h2>
        <p className="sub-tagline">
          {t.header?.subTagline || 'Ensaios • Eventos • Retratos Artísticos'}
        </p>
        <p className="credentials">
          📸 {t.header?.credentials || 'Formado em Fotografia Digital pela FIAP'}
        </p>
      </motion.div>

      {/* Badge de Disponibilidade */}
      <AvailabilityBadge variant="limited" />

      <motion.p 
        className="portfolio-text"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {t.navigation.portfolio}
      </motion.p>
    </motion.header>
  );
};

export default Header;