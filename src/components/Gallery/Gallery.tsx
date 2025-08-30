import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GalleryProps, Photo } from '@/types';
import ImageModal from './ImageModal';

const Gallery: React.FC<GalleryProps> = ({ photos, activeFilter }) => {
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(photos);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activeFilter === '*') {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter(photo => photo.filter === activeFilter);
      setFilteredPhotos(filtered);
    }
  }, [photos, activeFilter]);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < filteredPhotos.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => new Set(prev).add(index));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Mobile Instructions */}
      <MobileInstructions />

      {/* Gallery */}
      <motion.main
        id="gallery-container"
        className="gallery"
        role="main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            className="gallery-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={`${photo.filter}-${photo.name}-${index}`}
                className="grid-item"
                variants={itemVariants}
                layout
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleImageClick(index)}
              >
                <div className="image-container">
                  <Image
                    src={photo.src}
                    alt={photo.name}
                    width={400}
                    height={400}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onLoad={() => handleImageLoad(index)}
                    priority={index < 6}
                  />
                  
                  <motion.div 
                    className="overlay"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {photo.name}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Image Modal */}
      <ImageModal
        isOpen={selectedImage !== null}
        images={filteredPhotos}
        currentIndex={selectedImage || 0}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
};

const MobileInstructions: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const instructionsShown = localStorage.getItem('instructionsShown');
    
    if (isMobile && !instructionsShown) {
      setShowInstructions(true);
      
      const timer = setTimeout(() => {
        setShowInstructions(false);
        localStorage.setItem('instructionsShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showInstructions) return null;

  return (
    <motion.div
      className="mobile-instructions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <p>
        <i className="fa fa-hand-o-up"></i> Toque para ampliar
      </p>
      <p>
        <i className="fa fa-arrows-h"></i> Deslize para navegar
      </p>
    </motion.div>
  );
};

export default Gallery;