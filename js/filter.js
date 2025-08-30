/**
 * Módulo de Filtros
 * Gerencia os filtros de categorias
 */

const Filters = (function() {
  'use strict';
  
  let currentFilter = '*';
  
  /**
   * Inicializa os filtros
   */
  function init() {
    setupEventListeners();
    checkScrollable();
  }
  
  /**
   * Configura os event listeners dos filtros
   */
  function setupEventListeners() {
    // Remover eventos anteriores para evitar duplicação
    $('.filters-list button').off('click touchend');
    
    // Clique nos botões de filtro
    $('.filters-list button').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const $button = $(this);
      let filterValue = $button.data('filter');
      
      // Adiciona o ponto no início do valor do filtro
      if (filterValue !== '*' && !filterValue.startsWith('.')) {
        filterValue = '.' + filterValue;
      }

      // Evitar duplo clique
      if (filterValue === currentFilter) return;
      
      // Atualizar estado ativo
      updateActiveState($button);
      
      // Aplicar filtro
      currentFilter = filterValue;
      
      // Chamar o Gallery para filtrar
      if (window.Gallery && typeof window.Gallery.filter === 'function') {
        Gallery.filter(filterValue);
      }
      
      // Scroll suave para o topo da galeria em mobile
      if (window.Mobile && window.Mobile.isMobile()) {
        smoothScrollToGallery();
      }
    });
    
    // Prevenir comportamento padrão do touch
    $('.filters-list button').on('touchstart', function(e) {
      $(this).addClass('touching');
    }).on('touchend touchcancel', function() {
      $(this).removeClass('touching');
    });
  }
  
  /**
   * Atualiza o estado ativo do filtro
   */
  function updateActiveState($button) {
    // Remover active de todos
    $('.filters-list li').removeClass('active');
    $('.filters-list button').attr('aria-pressed', 'false');
    
    // Adicionar active ao clicado
    $button.parent().addClass('active');
    $button.attr('aria-pressed', 'true');
  }
  
  /**
   * Verifica se os filtros precisam de scroll horizontal
   */
  function checkScrollable() {
    const container = document.querySelector('.filters-container');
    const list = document.querySelector('.filters-list');
    
    if (!container || !list) return;
    
    // Adicionar indicadores se necessário
    if (list.scrollWidth > container.clientWidth) {
      addScrollIndicators();
    }
  }
  
  /**
   * Adiciona indicadores de scroll para mobile
   */
  function addScrollIndicators() {
    const $filters = $('.filters');
    
    // Evitar duplicação
    if ($filters.find('.scroll-indicator').length > 0) return;
    
    // Criar indicadores
    const leftIndicator = $('<div class="scroll-indicator left"><i class="fa fa-chevron-left"></i></div>');
    const rightIndicator = $('<div class="scroll-indicator right"><i class="fa fa-chevron-right"></i></div>');
    
    $filters.append(leftIndicator);
    $filters.append(rightIndicator);
    
    // Container de filtros
    const $container = $('.filters-container');
    
    // Atualizar visibilidade dos indicadores
    function updateIndicators() {
      const scrollLeft = $container.scrollLeft();
      const maxScroll = $container[0].scrollWidth - $container[0].clientWidth;
      
      leftIndicator.toggleClass('visible', scrollLeft > 10);
      rightIndicator.toggleClass('visible', scrollLeft < maxScroll - 10);
    }
    
    // Eventos de scroll
    $container.on('scroll', updateIndicators);
    
    // Clique nos indicadores
    leftIndicator.on('click', function() {
      $container.animate({ scrollLeft: '-=150' }, 300);
    });
    
    rightIndicator.on('click', function() {
      $container.animate({ scrollLeft: '+=150' }, 300);
    });
    
    // Verificar inicial
    updateIndicators();
  }
  
  /**
   * Scroll suave para a galeria
   */
  function smoothScrollToGallery() {
    const galleryTop = $('#gallery-container').offset().top - 100;
    $('html, body').animate({
      scrollTop: galleryTop
    }, 300);
  }
  
  /**
   * Obtém o filtro atual
   */
  function getCurrentFilter() {
    return currentFilter;
  }
  
  /**
   * Reseta os filtros
   */
  function reset() {
    currentFilter = '*';
    const $allButton = $('.filters-list button[data-filter="*"]');
    updateActiveState($allButton);
    
    if (window.Gallery) {
      Gallery.filter('*');
    }
  }
  
  // API pública
  return {
    init: init,
    getCurrentFilter: getCurrentFilter,
    reset: reset
  };
})();

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
  Filters.init();
});

// Adicionar estilos CSS para os indicadores de scroll
const filterStyles = `
<style>
.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 101;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.scroll-indicator.visible {
  opacity: 1;
  visibility: visible;
}

.scroll-indicator.left {
  left: 5px;
}

.scroll-indicator.right {
  right: 5px;
}

.scroll-indicator i {
  color: var(--primary-gold);
  font-size: 14px;
}

.filters {
  position: relative;
}

.filters-list button.touching {
  transform: scale(0.95);
  opacity: 0.8;
}
</style>
`;

$('head').append(filterStyles);