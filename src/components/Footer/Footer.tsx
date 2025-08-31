// src/components/Footer/Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionParticles from '@/components/SectionParticles/SectionParticles';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="footer"
      style={{ position: 'relative', overflow: 'hidden' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Particles Background */}
      <SectionParticles 
        section="footer" 
        intensity="medium" 
        className="footer-content golden-particles"
      />

      <p style={{ position: 'relative', zIndex: 2 }}>
        &copy; {currentYear} {t.footer.copyright}{' '}
        <motion.a
          href="https://www.instagram.com/leooli321/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Leo Oli
        </motion.a>
      </p>
    </motion.footer>
  );
};

export default Footer;