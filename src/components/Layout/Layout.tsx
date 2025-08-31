// src/components/Layout/Layout.tsx
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector';
import GlobalParticles from '@/components/GlobalParticles/GlobalParticles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Portfolio fotográfico de Leo Oli - Fotógrafo profissional especializado em retratos e ensaios fotográficos." />
        <meta name="theme-color" content="#212121" />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
        <title>Leo Oli - Portfolio Fotográfico</title>
      </Head>

      {/* Global Particles Background */}
      <GlobalParticles 
        density={12}
        speed={1.2}
        opacity={0.1}
        size={3}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>

      {/* Language Selector */}
      <motion.div 
        className="header-language-selector"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <LanguageSelector showLabel={false} position="top-left" />
      </motion.div>

      {/* WhatsApp Float */}
      <motion.a
        href="https://wa.me/5511983157973?text=Me+chama+pra+fotografar+%F0%9F%98%AD%F0%9F%"
        className="whatsapp-float"
        aria-label="Contato pelo WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <i className="fa fa-whatsapp" aria-hidden="true"></i>
      </motion.a>

      {/* Scroll to Top */}
      <ScrollToTop />
    </>
  );
};

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className="scroll-to-top"
      aria-label="Voltar ao topo"
      type="button"
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <i className="fa fa-chevron-up" aria-hidden="true"></i>
    </motion.button>
  );
};

export default Layout;