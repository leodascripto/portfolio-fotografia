import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import Header from '@/components/Header/Header';
import Filters from '@/components/Filters/Filters';
import Gallery from '@/components/Gallery/Gallery';
import Footer from '@/components/Footer/Footer';
import Loading from '@/components/Loading/Loading';
import { usePhotos } from '@/hooks/usePhotos';

const HomePage: React.FC = () => {
  const { photos, filters, isLoading, error } = usePhotos();
  const [activeFilter, setActiveFilter] = useState<string>('*');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <Layout>
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
  );
};

export default HomePage;