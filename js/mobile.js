/**
 * Módulo Mobile
 * Otimizações e funcionalidades específicas para dispositivos móveis
 */

const Mobile = (function() {
  'use strict';
  
  let isMobileDevice = false;
  let touchStartX = 0;
  let touchStartY = 0;
  
  /**
   * Inicializa funcionalidades mobile
   */
  function init() {
    detectDevice();
    
    if (isMobileDevice) {
      setupMobileOptimizations();
      setupInstructions();
      preventDoubleTap();
      fixIOSScroll();
    }
  }
  
  /**
   * Detecta se é um dispositivo móvel
   */
  function detectDevice() {
    isMobileDevice = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(max-width: 768px)').matches
    );
    
    if (isMobileDevice) {
      $('body').addClass('is-mobile');
    }
  }
  
  /**
   * Configura otimizações para mobile
   */
  function setupMobileOptimizations() {
    // Desabilitar zoom no iOS
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });
    
    // Melhorar responsividade do toque
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Adicionar feedback visual ao tocar
    $('.grid-item, .filters-list button').on('touchstart', function() {
      $(this).addClass('touch-active');
    }).on('touchend touchcancel', function() {
      $(this).removeClass('touch-active');
    });
  }
  
  /**
   * Configura as instruções mobile
   */
  function setupInstructions() {
    const $instructions = $('.mobile-instructions');
    
    // Verificar se já foi mostrado antes
    if (localStorage.getItem('instructionsShown')) {
      $instructions.addClass('hidden');
      return;
    }
    
    // Mostrar instruções
    $instructions.removeClass('hidden');
    
    // Esconder após 5 segundos
    setTimeout(function() {
      $instructions.fadeOut(500, function() {
        $(this).addClass('hidden');
      });
      localStorage.setItem('instructionsShown', 'true');
    }, 5000);
  }
  
  /**
   * Previne double tap zoom
   */
  function preventDoubleTap() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
  
  /**
   * Corrige problemas de scroll no iOS
   */
  function fixIOSScroll() {
    // Detectar iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Corrigir scroll elástico
      document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.filters-container')) {
          // Permitir scroll nos filtros
          return;
        }
        if (e.target.closest('.mfp-wrap')) {
          // Permitir na galeria popup
          return;
        }
      }, { passive: true });
      
      // Corrigir altura do viewport
      function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
    }
  }
  
  /**
   * Habilita swipe na galeria popup
   */
  function enableGallerySwipe() {
    const $container = $('.mfp-container');
    if (!$container.length) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    $container.on('touchstart', function(e) {
      touchStartX = e.originalEvent.touches[0].pageX;
      touchStartY = e.originalEvent.touches[0].pageY;
    });
    
    $container.on('touchend', function(e) {
      touchEndX = e.originalEvent.changedTouches[0].pageX;
      touchEndY = e.originalEvent.changedTouches[0].pageY;
      
      handleSwipe();
    });
    
    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);
      
      // Verificar se foi um swipe horizontal
      if (Math.abs(diffX) > 50 && diffY < 100) {
        if (diffX > 0) {
          // Swipe para direita - imagem anterior
          $.magnificPopup.instance.prev();
        } else {
          // Swipe para esquerda - próxima imagem
          $.magnificPopup.instance.next();
        }
      }
    }
    
    // Adicionar indicadores visuais
    addSwipeIndicators();
  }
  
  /**
   * Adiciona indicadores de swipe
   */
  function addSwipeIndicators() {
    const $container = $('.mfp-container');
    
    // Evitar duplicação
    if ($container.find('.swipe-hint').length > 0) return;
    
    const hint = $('<div class="swipe-hint">Deslize para navegar</div>');
    $container.append(hint);
    
    // Remover após 3 segundos
    setTimeout(function() {
      hint.fadeOut(500, function() {
        $(this).remove();
      });
    }, 3000);
  }
  
  /**
   * Verifica se é mobile
   */
  function isMobile() {
    return isMobileDevice;
  }
  
  // API pública
  return {
    init: init,
    isMobile: isMobile,
    enableGallerySwipe: enableGallerySwipe
  };
})();

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
  Mobile.init();
});

// Adicionar estilos CSS para mobile
const mobileStyles = `
<style>
.touch-active {
  opacity: 0.8;
  transform: scale(0.98);
}

.swipe-hint {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1001;
  pointer-events: none;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Corrigir altura no iOS */
.is-mobile {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

/* Melhorar performance de scroll */
.filters-container {
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}

.gallery {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
</style>
`;

$('head').append(mobileStyles);