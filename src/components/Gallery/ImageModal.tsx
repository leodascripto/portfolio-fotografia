// src/components/Gallery/ImageModal.tsx
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Photo } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageModalProps {
  isOpen: boolean;
  images: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  const { t } = useLanguage();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onPrev();
        break;
      case 'ArrowRight':
        onNext();
        break;
    }
  }, [isOpen, onClose, onNext, onPrev]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const startX = event.touches[0].clientX;
    const startY = event.touches[0].clientY;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const endY = endEvent.changedTouches[0].clientY;
      
      const diffX = endX - startX;
      const diffY = Math.abs(endY - startY);

      // Verificar se foi um swipe horizontal
      if (Math.abs(diffX) > 50 && diffY < 100) {
        if (diffX > 0) {
          onPrev(); // Swipe para direita - imagem anterior
        } else {
          onNext(); // Swipe para esquerda - próxima imagem
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  }, [onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('touchstart', handleTouchStart);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown, handleTouchStart]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="image-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="image-modal-container"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            className="modal-close"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t.modal.close}
          >
            <i className="fa fa-times" />
          </motion.button>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <motion.button
              className="modal-nav modal-nav-prev"
              onClick={onPrev}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t.modal.previous}
            >
              <i className="fa fa-chevron-left" />
            </motion.button>
          )}

          {currentIndex < images.length - 1 && (
            <motion.button
              className="modal-nav modal-nav-next"
              onClick={onNext}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t.modal.next}
            >
              <i className="fa fa-chevron-right" />
            </motion.button>
          )}

          {/* Image */}
          <div className="modal-image-container">
            <Image
              src={currentImage.src}
              alt={currentImage.name}
              width={1200}
              height={800}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
              priority
            />
          </div>

          {/* Image Info */}
          <motion.div
            className="modal-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>{currentImage.name}</h3>
            <p>{currentIndex + 1} {t.gallery.imageInfo} {images.length}</p>
          </motion.div>

          {/* Mobile Swipe Hint */}
          <MobileSwipeHint />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const MobileSwipeHint: React.FC = () => {
  const [showHint, setShowHint] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showHint) return null;

  return (
    <motion.div
      className="swipe-hint"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {t.gallery.swipeHint}
    </motion.div>
  );
};

export default ImageModal;