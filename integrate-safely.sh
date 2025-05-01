#!/bin/bash

# Script de integração segura
echo "Iniciando integração segura das melhorias..."

# Criar arquivo de inicialização modular
cat > js/portfolio-enhancer.js << 'EOL'
/**
 * Portfolio Enhancer
 * Integra melhorias de forma segura sem interferir com a funcionalidade atual
 */

// Namespace para evitar conflitos
const PortfolioEnhancer = (function() {
  
  // Estado da aplicação
  const state = {
    initialized: false,
    originalIsotopeWorking: false,
    themeEnabled: false,
    lazyLoadingEnabled: false,
    touchOptimizationsEnabled: false
  };
  
  /**
   * Inicializa o enhancer com segurança
   */
  function initialize() {
    if (state.initialized) return;
    
    console.log('Inicializando melhorias de portfolio...');
    
    // Verificar se o Isotope original está funcionando
    if (typeof $.fn.isotope !== 'undefined' && $('#container').data('isotope')) {
      state.originalIsotopeWorking = true;
      console.log('Isotope original detectado e funcionando');
    }
    
    // Iniciar com temporizador para garantir carregamento completo
    setTimeout(function() {
      // Aplicar melhorias visuais que não interferem na funcionalidade
      applyVisualEnhancements();
      
      // Verificar se podemos ativar o tema
      if (typeof ThemeManager !== 'undefined') {
        try {
          // Inicializar apenas os métodos auxiliares do ThemeManager
          initializeThemeSupport();
          state.themeEnabled = true;
        } catch (e) {
          console.warn('Não foi possível inicializar o tema:', e);
        }
      }
      
      // Verificar se o dispositivo é móvel
      if (window.matchMedia("(max-width: 768px)").matches) {
        enhanceMobileExperience();
        state.touchOptimizationsEnabled = true;
      }
      
      state.initialized = true;
    }, 1000);
    
    // Adicionar estilos dinâmicos
    addDynamicStyles();
  }
  
  /**
   * Aplica melhorias visuais seguras
   */
  function applyVisualEnhancements() {
    // Adicionar classes para animações
    $('.grid-item').addClass('enhance-item');
    $('.header h1, .header .portfolio, #logo').addClass('enhance-header-item');
    
    // Adicionar IDs únicos para elementos importantes que não os têm
    if (!$('.loading-indicator').attr('id')) {
      $('.loading-indicator').attr('id', 'loading-indicator');
    }
    
    // Configurar efeitos de hover avançados
    setupAdvancedHoverEffects();
    
    // Adicionar animações após carregamento
    animateElementsOnScroll();
    
    // Melhorar acessibilidade
    enhanceAccessibility();
  }
  
  /**
   * Configura efeitos de hover avançados
   */
  function setupAdvancedHoverEffects() {
    // Adicionar efeitos de hover para filtros
    $('.filters li a').on('mouseenter', function() {
      $(this).parent().addClass('hover-enhanced');
    }).on('mouseleave', function() {
      $(this).parent().removeClass('hover-enhanced');
    });
    
    // Adicionar efeito de hover para botão de WhatsApp
    $('.float').on('mouseenter', function() {
      $(this).addClass('hover-enhanced');
    }).on('mouseleave', function() {
      $(this).removeClass('hover-enhanced');
    });
    
    // Adicionar efeito de clique para botão de WhatsApp
    $('.float').on('click', function() {
      $(this).addClass('clicked');
      setTimeout(() => {
        $(this).removeClass('clicked');
      }, 300);
    });
  }
  
  /**
   * Anima elementos ao entrarem no viewport
   */
  function animateElementsOnScroll() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos para animar
    document.querySelectorAll('.enhance-item, .enhance-header-item').forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Melhora acessibilidade do site
   */
  function enhanceAccessibility() {
    // Adicionar classe para navegação por teclado
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });
    
    // Melhorar navegação por teclado na galeria
    $('.grid-item').attr('tabindex', '0').attr('role', 'button');
    
    // Adicionar suporte a teclado para itens da galeria
    $('.grid-item').on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).find('a')[0].click();
      }
    });
  }
  
  /**
   * Inicializa suporte a tema
   */
  function initializeThemeSupport() {
    // Verificar se já existe tema salvo
    try {
      const savedTheme = localStorage.getItem('portfolioTheme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        $('.theme-toggle i').removeClass('fa-sun-o').addClass('fa-moon-o');
      }
    } catch (e) {
      console.warn('Erro ao acessar localStorage:', e);
    }
    
    // Configurar toggle de tema existente
    $('.theme-toggle').on('click', function() {
      const isLightMode = document.body.classList.toggle('light-mode');
      const icon = $(this).find('i');
      
      if (isLightMode) {
        icon.removeClass('fa-sun-o').addClass('fa-moon-o');
      } else {
        icon.removeClass('fa-moon-o').addClass('fa-sun-o');
      }
      
      // Salvar preferência
      try {
        localStorage.setItem('portfolioTheme', isLightMode ? 'light' : 'dark');
      } catch (e) {
        console.warn('Erro ao salvar tema:', e);
      }
      
      // Re-layout do isotope após mudança de tema
      if ($.fn.isotope) {
        $('#container').isotope('layout');
      }
    });
  }
  
  /**
   * Melhora experiência em dispositivos móveis
   */
  function enhanceMobileExperience() {
    // Verificar se o container de filtros existe e precisa de indicadores de scroll
    const filtersContainer = document.querySelector('.filters ul');
    if (filtersContainer && filtersContainer.scrollWidth > filtersContainer.clientWidth) {
      // Adicionar indicadores de scroll
      addScrollIndicators();
    }
    
    // Mostrar instruções com animação
    $('.mobile-instructions').addClass('animated');
    
    // Otimizar áreas de toque
    $('.grid-item, .filters li a, [role="button"], .float').addClass('touch-optimized');
  }
  
  /**
   * Adiciona indicadores de scroll aos filtros em dispositivos móveis
   */
  function addScrollIndicators() {
    const $filters = $('.filters');
    
    // Evitar duplicação
    if ($filters.hasClass('scrollable')) return;
    
    $filters.addClass('scrollable');
    const $filtersList = $filters.find('ul');
    
    // Adicionar indicadores visuais
    $('<div class="scroll-indicator left"><i class="fa fa-chevron-left"></i></div>').appendTo($filters);
    $('<div class="scroll-indicator right"><i class="fa fa-chevron-right"></i></div>').appendTo($filters);
    
    const $leftIndicator = $filters.find('.scroll-indicator.left');
    const $rightIndicator = $filters.find('.scroll-indicator.right');
    
    // Iniciar com o indicador direito visível
    $rightIndicator.addClass('visible');
    
    // Atualizar indicadores ao rolar
    $filtersList.on('scroll', function() {
      const isScrolledLeft = $(this).scrollLeft() > 20;
      const isScrolledRight = $(this).scrollLeft() < (this[0].scrollWidth - this[0].clientWidth - 20);
      
      $leftIndicator.toggleClass('visible', isScrolledLeft);
      $rightIndicator.toggleClass('visible', isScrolledRight);
    });
    
    // Adicionar funcionalidade aos indicadores
    $leftIndicator.on('click', function() {
      $filtersList.animate({ scrollLeft: '-=100' }, 300);
    });
    
    $rightIndicator.on('click', function() {
      $filtersList.animate({ scrollLeft: '+=100' }, 300);
    });
  }
  
  /**
   * Adiciona estilos dinâmicos para evitar conflitos com CSS existente
   */
  function addDynamicStyles() {
    const styles = `
      /* Estilos para animações seguras */
      .enhance-item, .enhance-header-item {
        transition: transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease;
      }
      
      .enhance-item.animated {
        animation: enhance-fade-in 0.5s ease forwards;
      }
      
      .enhance-header-item.animated {
        animation: enhance-slide-down 0.7s ease forwards;
      }
      
      @keyframes enhance-fade-in {
        0% { opacity: 0.9; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes enhance-slide-down {
        0% { opacity: 0.9; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      /* Melhorias visuais para hover */
      .hover-enhanced {
        background: rgba(227, 202, 102, 0.15) !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .grid-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        z-index: 2;
      }
      
      /* Indicadores de scroll para filtros */
      .filters.scrollable {
        position: relative;
      }
      
      .scroll-indicator {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background-color: rgba(35, 35, 35, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
      
      .scroll-indicator.visible {
        opacity: 0.9;
        pointer-events: all;
      }
      
      .scroll-indicator.left {
        left: 5px;
      }
      
      .scroll-indicator.right {
        right: 5px;
      }
      
      .scroll-indicator i {
        color: var(--primary-gold);
        font-size: 16px;
      }
      
      /* Melhorias para dispositivos móveis */
      .touch-optimized {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .mobile-instructions.animated {
        animation: enhance-slide-up 0.5s ease forwards;
      }
      
      @keyframes enhance-slide-up {
        0% { opacity: 0.8; transform: translateY(5px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      /* Melhorias para botões */
      .float.hover-enhanced {
        transform: scale(1.05) rotate(5deg);
      }
      
      .float.clicked {
        transform: scale(0.95);
        transition: transform 0.2s ease;
      }
      
      /* Acessibilidade */
      body.keyboard-navigation a:focus,
      body.keyboard-navigation button:focus,
      body.keyboard-navigation [role="button"]:focus,
      body.keyboard-navigation [tabindex="0"]:focus {
        outline: 3px solid var(--primary-gold);
        outline-offset: 3px;
      }
    `;
    
    // Adicionar estilos ao documento
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
  
  // API pública
  return {
    initialize,
    getState: function() {
      return { ...state };
    }
  };
})();

// Inicializar após o carregamento do DOM
$(document).ready(function() {
  // Inicializar depois de um pequeno atraso para garantir que tudo foi carregado
  setTimeout(function() {
    PortfolioEnhancer.initialize();
  }, 500);
});
EOL

# Adicionar o script ao index.html
if ! grep -q "js/portfolio-enhancer.js" index.html; then
  echo "Adicionando script enhancer ao index.html..."
  sed -i '/<script src="js\/script.js"><\/script>/a \    <script src="js/portfolio-enhancer.js"></script>' index.html
fi

echo "Integração segura concluída!"
echo "O script foi adicionado e garante compatibilidade com o código existente."
echo "Atualize a página para ver as melhorias visuais sem quebrar a funcionalidade."
echo "Se tudo estiver funcionando, execute 'firebase deploy' para publicar."