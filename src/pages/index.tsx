// src/pages/index.tsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import Header from '@/components/Header/Header';
import Filters from '@/components/Filters/Filters';
import Gallery from '@/components/Gallery/Gallery';
import Footer from '@/components/Footer/Footer';
import Loading from '@/components/Loading/Loading';
import Welcome from '@/components/Welcome/Welcome';
import { usePhotos } from '@/hooks/usePhotos';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { photos, filters, isLoading, error } = usePhotos();
  const { isLanguageSelected, setIsLanguageSelected } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('*');
  const [showWelcome, setShowWelcome] = useState(!isLanguageSelected);

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
              <Gallery
                photos={photos}
                activeFilter={activeFilter}
              />
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            <Footer />
          </Layout>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;