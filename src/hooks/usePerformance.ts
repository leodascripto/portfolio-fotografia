// src/hooks/usePerformance.ts
import { useState, useEffect } from 'react';

interface PerformanceConfig {
  particleDensity: 'none' | 'low' | 'medium' | 'high';
  enableAnimations: boolean;
  enableParticles: boolean;
  imageQuality: 'low' | 'medium' | 'high';
}

export const usePerformance = () => {
  const [config, setConfig] = useState<PerformanceConfig>({
    particleDensity: 'medium',
    enableAnimations: true,
    enableParticles: true,
    imageQuality: 'high'
  });

  useEffect(() => {
    const detectPerformance = () => {
      // Detecção de dispositivo low-end
      const isLowEndDevice = () => {
        // RAM disponível (Chrome/Edge)
        const memory = (navigator as any).deviceMemory;
        if (memory && memory < 4) return true;

        // Tipo de conexão
        const connection = (navigator as any).connection;
        if (connection) {
          // Data saver ativo
          if (connection.saveData) return true;
          
          // Conexão lenta
          if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
            return true;
          }
        }

        // Cores da tela (dispositivos muito antigos)
        if (screen.colorDepth < 24) return true;

        // Largura da tela (smartphones básicos)
        if (window.innerWidth < 375) return true;

        return false;
      };

      // Detecção de preferências do usuário
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;

      // Configuração adaptativa
      if (prefersReducedMotion) {
        setConfig({
          particleDensity: 'none',
          enableAnimations: false,
          enableParticles: false,
          imageQuality: 'high'
        });
      } else if (isLowEndDevice() || prefersReducedData) {
        setConfig({
          particleDensity: 'low',
          enableAnimations: true,
          enableParticles: true,
          imageQuality: 'medium'
        });
      } else {
        // Dispositivo médio/alto
        setConfig({
          particleDensity: 'medium',
          enableAnimations: true,
          enableParticles: true,
          imageQuality: 'high'
        });
      }
    };

    detectPerformance();

    // Re-detectar se conexão mudar
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', detectPerformance);
      return () => connection.removeEventListener('change', detectPerformance);
    }
  }, []);

  return config;
};