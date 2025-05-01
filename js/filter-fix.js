/**
 * Correção específica para os filtros do Portfolio
 * Focada em garantir o funcionamento em dispositivos móveis
 */

// Executar quando o documento estiver pronto
$(document).ready(function() {
  console.log("Aplicando correção de filtros...");
  
  // Esperar um pouco para garantir que o Isotope já foi inicializado
  setTimeout(function() {
    // CORREÇÃO PARA FILTROS
    fixFilters();
  }, 800);  // Aumento do tempo de espera para garantir que tudo esteja carregado
  
  /**
   * Corrige o problema dos filtros
   */
  function fixFilters() {
    console.log("Corrigindo filtros...");
    
    // 1. Obter referência ao container
    var $container = $('#container');
    
    // 2. Verificar se o Isotope está inicializado
    if ($container.length === 0) {
      console.error("Container não encontrado!");
      return;
    }
    
    if (!$container.data('isotope')) {
      console.warn("Isotope não inicializado no container!");
      
      // 3. Se o Isotope não estiver inicializado, inicializar
      $container.isotope({
        itemSelector: '.grid-item',
        layoutMode: 'masonry',
        masonry: {
          columnWidth: '.grid-item',
          gutter: 15,
          isFitWidth: true
        },
        percentPosition: true
      });
      
      // 4. Forçar layout após inicialização
      setTimeout(function() {
        $container.isotope('layout');
      }, 200);
    }
    
    // 5. Remover eventos antigos dos filtros para evitar conflitos
    $('.filters li a').off();
    
    // 6. Adicionar novos eventos otimizados para mobile
    $('.filters li a').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log("Filtro clicado!");
      
      // 7. Obter valor do filtro
      var filterValue = $(this).attr('data-filter');
      console.log("Valor do filtro:", filterValue);
      
      // 8. Atualizar classes ativas ANTES de aplicar o filtro
      $('.filters li').removeClass('active');
      $(this).parent().addClass('active');
      
      // 9. Atualizar atributos ARIA
      $('.filters li a').attr('aria-current', 'false');
      $(this).attr('aria-current', 'true');
      
      // 10. Aplicar o filtro com uma técnica mais robusta
      try {
        $container.isotope({ filter: filterValue });
        console.log("Filtro aplicado com sucesso:", filterValue);
        
        // 11. Re-layout após um curto delay para garantir que tudo está posicionado corretamente
        setTimeout(function() {
          $container.isotope('layout');
          console.log("Layout atualizado após filtragem");
        }, 300);
      } catch (error) {
        console.error("Erro ao aplicar filtro:", error);
      }
    });
    
    // 12. Adicionar eventos de toque para melhor resposta em mobile
    $('.filters li a').each(function() {
      this.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Criar um evento de clique e disparar manualmente
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        this.dispatchEvent(clickEvent);
      }, { passive: false });
    });
    
    // 13. Adicionar feedback visual ao tocar nos filtros
    $('.filters li').on('touchstart', function() {
      $(this).addClass('touch-active');
    }).on('touchend touchcancel', function() {
      const $this = $(this);
      setTimeout(function() {
        $this.removeClass('touch-active');
      }, 150);
    });
    
    // 14. Forçar relayout do Isotope para garantir que tudo está correto
    if ($container.data('isotope')) {
      $container.isotope('layout');
    }
    
    console.log("Correção de filtros aplicada com sucesso!");
  }
  
  // Adicionar estilos CSS necessários
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Estilos para melhorar filtros em dispositivos móveis */
    .filters li {
      position: relative;
      overflow: hidden;
    }
    
    .filters li a {
      display: block;
      padding: 10px 20px !important;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    .filters li.touch-active {
      background: rgba(227, 202, 102, 0.3);
      transform: scale(0.97);
    }
    
    .filters li.active {
      background: linear-gradient(135deg, rgba(227, 202, 102, 0.3), rgba(180, 142, 71, 0.3));
      box-shadow: 0 0 10px rgba(227, 202, 102, 0.4);
    }
    
    .filters li.active a {
      color: var(--primary-gold);
      font-weight: 700;
    }
    
    /* Aumentar áreas de toque para melhor experiência mobile */
    .filters li {
      margin: 3px;
      padding: 2px;
    }
    
    /* Remover comportamento padrão de toque */
    .filters li a,
    .grid-item {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* Melhorar visualização após filtragem */
    .grid-item.isotope-hidden {
      opacity: 0;
      transform: scale(0.8);
      pointer-events: none;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Adicionar listener para reínicializar filtros se a janela for redimensionada
  $(window).on('resize', function() {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
      fixFilters();
    }, 250);
  });
  
  // Adicionar listener para quando as imagens forem carregadas
  $('#container').imagesLoaded(function() {
    console.log("Imagens carregadas, verificando filtros...");
    fixFilters();
  });
});
