// src/components/PWA/PWAInstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { t } = useLanguage();

  // Detectar iOS e modo standalone
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator && (window.navigator as any).standalone) || 
                               window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);
    setIsInstalled(isInStandaloneMode);

    // Verificar se já foi instalado
    const hasShownPrompt = localStorage.getItem('pwa-install-prompted');
    const installDismissed = localStorage.getItem('pwa-install-dismissed');

    if (!isInStandaloneMode && !installDismissed) {
      // Para iOS, mostrar prompt personalizado
      if (isIOSDevice && !hasShownPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  // Listener para beforeinstallprompt (Android/Chrome)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle install (Android/Chrome)
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
      } else {
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setShowPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-prompted', 'true');
    
    // Reagendar para mostrar novamente em 1 semana
    const nextPrompt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-next-prompt', nextPrompt.toString());
  };

  // Handle "Maybe later"
  const handleMaybeLater = () => {
    setShowPrompt(false);
    
    // Reagendar para 24 horas
    const nextPrompt = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-next-prompt', nextPrompt.toString());
  };

  // iOS Instructions Component
  const IOSInstructions: React.FC = () => (
    <div className="ios-instructions">
      <div className="ios-step">
        <i className="fa fa-share" />
        <p>Toque em <strong>Compartilhar</strong></p>
      </div>
      <div className="ios-step">
        <i className="fa fa-plus-square-o" />
        <p>Selecione <strong>"Adicionar à Tela de Início"</strong></p>
      </div>
      <div className="ios-step">
        <i className="fa fa-check" />
        <p>Toque em <strong>"Adicionar"</strong></p>
      </div>
    </div>
  );

  if (isInstalled || isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pwa-install-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="pwa-install-prompt"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="pwa-header">
            <div className="pwa-icon">
              <img src="/assets/img/favicon.png" alt="Leo Oli" />
            </div>
            <div className="pwa-info">
              <h3>Leo Oli Portfolio</h3>
              <p>Acesso rápido e offline</p>
            </div>
            <button className="pwa-close" onClick={handleDismiss}>
              <i className="fa fa-times" />
            </button>
          </div>

          {/* Content */}
          <div className="pwa-content">
            <h4>
              {isIOS ? 'Adicionar à Tela de Início' : 'Instalar App'}
            </h4>
            
            <div className="pwa-benefits">
              <div className="benefit">
                <i className="fa fa-bolt" />
                <span>Acesso instantâneo</span>
              </div>
              <div className="benefit">
                <i className="fa fa-wifi" />
                <span>Funciona offline</span>
              </div>
              <div className="benefit">
                <i className="fa fa-mobile" />
                <span>Experiência nativa</span>
              </div>
            </div>

            {isIOS ? (
              <IOSInstructions />
            ) : (
              <p className="pwa-description">
                Instale o app para ter acesso rápido ao portfolio, 
                notificações e experiência otimizada.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pwa-actions">
            {!isIOS && (
              <motion.button
                className="pwa-install-btn"
                onClick={handleInstall}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa fa-download" />
                Instalar Agora
              </motion.button>
            )}
            
            <div className="pwa-secondary-actions">
              <button 
                className="pwa-maybe-later"
                onClick={handleMaybeLater}
              >
                Depois
              </button>
              <button 
                className="pwa-dismiss"
                onClick={handleDismiss}
              >
                Não mostrar novamente
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;