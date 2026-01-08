// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import Header from '@/components/Header/Header';
import Filters from '@/components/Filters/Filters';
import Gallery from '@/components/Gallery/Gallery';
import Footer from '@/components/Footer/Footer';
import Loading from '@/components/Loading/Loading';
import Welcome from '@/components/Welcome/Welcome';
import SmartCTA from '@/components/SmartCTA/SmartCTA';
import { usePhotos } from '@/hooks/usePhotos';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePerformance } from '@/hooks/usePerformance';

const HomePage: React.FC = () => {
  const { photos, filters, isLoading, error } = usePhotos();
  const { isLanguageSelected, setIsLanguageSelected } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('*');
  const [showWelcome, setShowWelcome] = useState(!isLanguageSelected);
  const performanceConfig = usePerformance();

  // Scroll progress indicator
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleWelcomeComplete = () => {
    setIsLanguageSelected(true);
    setShowWelcome(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <Welcome key="welcome" onComplete={handleWelcomeComplete} />
        ) : (
          <Layout key="main">
            <Loading isLoading={isLoading} />
            
            <Header />
            
            {!isLoading && filters.length > 0 && (
              <Filters
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            )}
            
            {!isLoading && photos.length > 0 && (
              <>
                <Gallery
                  photos={photos}
                  activeFilter={activeFilter}
                />
                
                {/* CTA Inline - Principal */}
                <SmartCTA variant="inline" />
              </>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            <Footer />
            
            {/* Floating CTA - Esconde quando inline aparece */}
            <SmartCTA variant="floating" />
            
            {/* Sticky Bottom - Apenas no final (>80%) */}
            {performanceConfig.enableAnimations && (
              <SmartCTA variant="sticky-bottom" />
            )}
          </Layout>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;