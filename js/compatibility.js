/**
 * Script de compatibilidade para portfolio
 * Este script mantém a funcionalidade original dos filtros
 * enquanto adiciona melhorias visuais
 */

$(document).ready(function() {
  console.log("Aplicando melhorias visuais sem alterar funcionalidade...");
  
  // Esperar carregamento completo antes de aplicar melhorias
  $(window).on('load', function() {
    // 1. Adicionar animações sutis
    setTimeout(function() {
      // Adicionar classes para animações sem interferir na visibilidade
      $('.grid-item').addClass('animation-ready');
      $('#logo').addClass('animation-ready');
      
      // Animar elementos visíveis
      $('.animation-ready').addClass('animated');
      
      // Melhorar experiência de toque em mobile
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        enhanceTouchExperience();
      }
      
      // Re-layout do Isotope para garantir alinhamento correto
      if ($('#container').data('isotope')) {
        $('#container').isotope('layout');
      }
    }, 500);
  });
  
  // Não interferir com o clique dos filtros existentes
  // Apenas adicionar feedback visual melhorado
  $('.filters li a').on('mouseenter', function() {
    $(this).parent().addClass('hover-enhanced');
  }).on('mouseleave', function() {
    $(this).parent().removeClass('hover-enhanced');
  });
  
  // Adicionar feedback de toque para mobile
  function enhanceTouchExperience() {
    $('.grid-item, .filters li a, [role="button"]').addClass('touch-optimized');
    
    // Melhorar instruções móveis
    $('.mobile-instructions').addClass('animated');
    
    // Verificar se o container de filtros precisa de indicadores de scroll
    const filtersContainer = $('.filters ul')[0];
    if (filtersContainer && filtersContainer.scrollWidth > filtersContainer.clientWidth) {
      // Adicionar indicadores de scroll apenas se necessário
      addScrollIndicators();
    }
  }
  
  // Adicionar indicadores de scroll aos filtros
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
});
