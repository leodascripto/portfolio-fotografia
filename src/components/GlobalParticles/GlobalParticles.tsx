// src/components/GlobalParticles/GlobalParticles.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlobalParticlesProps {
  density?: number; // Número de partículas (padrão: 15)
  speed?: number; // Velocidade da animação (padrão: 1)
  opacity?: number; // Opacidade das partículas (padrão: 0.3)
  size?: number; // Tamanho das partículas (padrão: 4px)
  color?: string; // Cor das partículas (padrão: --primary-gold)
}

const GlobalParticles: React.FC<GlobalParticlesProps> = ({
  density = 15,
  speed = 1,
  opacity = 0.3,
  size = 4,
  color = 'var(--primary-gold)'
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsVisible(true);

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Não renderizar até ter as dimensões
  if (!isVisible || dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  const particles = Array.from({ length: density }, (_, i) => ({
    id: i,
    initialX: Math.random() * dimensions.width,
    initialY: dimensions.height + Math.random() * 100,
    duration: (Math.random() * 4 + 3) * speed, // 3-7 segundos * speed
    delay: Math.random() * 3 * speed,
    drift: (Math.random() - 0.5) * 100, // Deriva horizontal
    rotation: Math.random() * 360
  }));

  return (
    <div className="global-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="global-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            opacity: opacity
          }}
          initial={{
            opacity: 0,
            x: particle.initialX,
            y: particle.initialY,
            rotate: 0,
            scale: 0.5
          }}
          animate={{
            opacity: [0, opacity, opacity, 0],
            x: [
              particle.initialX,
              particle.initialX + particle.drift * 0.3,
              particle.initialX + particle.drift * 0.7,
              particle.initialX + particle.drift
            ],
            y: [
              particle.initialY,
              particle.initialY - dimensions.height * 0.3,
              particle.initialY - dimensions.height * 0.7,
              particle.initialY - dimensions.height - 100
            ],
            rotate: [0, particle.rotation * 0.5, particle.rotation],
            scale: [0.5, 1, 0.8, 0.3]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default GlobalParticles;