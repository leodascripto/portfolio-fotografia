// src/components/SectionParticles/SectionParticles.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectionParticlesProps {
  section?: 'header' | 'gallery' | 'footer' | 'welcome';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const SectionParticles: React.FC<SectionParticlesProps> = ({
  section = 'gallery',
  intensity = 'low',
  className = ''
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Configurações por seção
  const sectionConfigs = {
    header: {
      density: intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8,
      speed: 0.8,
      opacity: 0.2,
      size: 3,
      color: 'var(--primary-gold)'
    },
    gallery: {
      density: intensity === 'low' ? 8 : intensity === 'medium' ? 12 : 18,
      speed: 1,
      opacity: 0.15,
      size: 4,
      color: 'var(--primary-gold)'
    },
    footer: {
      density: intensity === 'low' ? 4 : intensity === 'medium' ? 6 : 10,
      speed: 1.2,
      opacity: 0.25,
      size: 3,
      color: 'var(--secondary-gold)'
    },
    welcome: {
      density: intensity === 'low' ? 15 : intensity === 'medium' ? 20 : 30,
      speed: 0.7,
      opacity: 0.3,
      size: 4,
      color: 'var(--primary-gold)'
    }
  };

  const config = sectionConfigs[section];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        const container = document.querySelector(`.${className}`) as HTMLElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          setDimensions({
            width: rect.width || window.innerWidth,
            height: rect.height || window.innerHeight
          });
        } else {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
          });
        }
      };

      updateDimensions();
      setIsVisible(true);

      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [className]);

  if (!isVisible || dimensions.width === 0) return null;

  const particles = Array.from({ length: config.density }, (_, i) => ({
    id: i,
    initialX: Math.random() * dimensions.width,
    initialY: dimensions.height + Math.random() * 50,
    duration: (Math.random() * 3 + 4) * config.speed,
    delay: Math.random() * 4,
    drift: (Math.random() - 0.5) * 60,
    rotation: Math.random() * 180,
    pulseDelay: Math.random() * 2
  }));

  return (
    <div className={`section-particles ${section}-particles ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="section-particle"
          style={{
            width: `${config.size}px`,
            height: `${config.size}px`,
            background: config.color,
            position: 'absolute',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
          initial={{
            opacity: 0,
            x: particle.initialX,
            y: particle.initialY,
            rotate: 0,
            scale: 0.3
          }}
          animate={{
            opacity: [0, config.opacity, config.opacity * 0.8, 0],
            x: [
              particle.initialX,
              particle.initialX + particle.drift * 0.4,
              particle.initialX + particle.drift * 0.8,
              particle.initialX + particle.drift
            ],
            y: [
              particle.initialY,
              particle.initialY - dimensions.height * 0.4,
              particle.initialY - dimensions.height * 0.8,
              particle.initialY - dimensions.height - 50
            ],
            rotate: [0, particle.rotation * 0.6, particle.rotation],
            scale: [0.3, 1.2, 1, 0.4]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          {/* Efeito de pulso para algumas partículas */}
          {Math.random() > 0.7 && (
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${config.size * 2}px`,
                height: `${config.size * 2}px`,
                background: config.color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 2,
                delay: particle.pulseDelay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SectionParticles;