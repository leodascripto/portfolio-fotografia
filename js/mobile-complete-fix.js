/**
 * Otimização Total para Dispositivos Móveis
 * Corrige todos os problemas de filtro, galeria e navegação
 */

// Executar imediatamente após o DOM estar pronto
$(document).ready(function() {
  console.log("Iniciando otimização completa para dispositivos móveis");
  
  // Verificar se é um dispositivo móvel
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches;
  
  if (isMobile) {
    console.log("Dispositivo móvel detectado, aplicando otimizações...");
    
    // Esperar um pouco para garantir que tudo foi carregado
    setTimeout(function() {
      // PASSO 1: Remover todos os handlers anteriores que possam estar causando problemas
      removeAllPreviousHandlers();
      
      // PASSO 2: Reinicializar o Isotope para garantir que os filtros funcionem
      reinitializeIsotope();
      
      // PASSO 3: Reinicializar a galeria corretamente
      reinitializeGallery();
      
      // PASSO 4: Adicionar otimizações de toque
      enhanceTouchExperience();
      
      console.log("Otimizações móveis aplicadas com sucesso");
    }, 500);
  }
  
  /**
   * Remove todos os handlers anteriores para evitar conflitos
   */
  function removeAllPreviousHandlers() {
    // Remover eventos dos filtros
    $('.filters li a').off();
    
    // Remover eventos das imagens
    $('.grid-item').off();
    $('.grid-item a').off();
    $('.popupimg').off();
    
    // Desconectar magnificPopup se existir
    if ($.magnificPopup && $.magnificPopup.instance) {
      $.magnificPopup.close();
      $.magnificPopup.instance = null;
    }
  }
  
  /**
   * Reinicializa o Isotope para garantir que os filtros funcionem
   */
  function reinitializeIsotope() {
    var $container = $('#container');
    
    // Verificar se o Isotope já está inicializado
    if ($container.data('isotope')) {
      // Reinicializar o Isotope
      $container.isotope('destroy');
    }
    
    // Inicializar o Isotope novamente
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
    
    // Configurar filtros novamente com manipuladores de toque otimizados
    $('.filters li a').on('click touchend', function(e) {
      e.preventDefault();
      
      // Obter valor do filtro
      var filterValue = $(this).attr("data-filter");
      console.log("Filtro selecionado:", filterValue);
      
      // Aplicar o filtro
      $container.isotope({ filter: filterValue });
      
      // Atualizar classes ativas
      $('.filters li').removeClass('active');
      $(this).parent().addClass('active');
      
      // Atualizar atributos ARIA
      $('.filters li a').attr('aria-current', 'false');
      $(this).attr('aria-current', 'true');
      
      // Forçar relayout após um curto delay
      setTimeout(function() {
        $container.isotope('layout');
      }, 100);
      
      // Reinicializar galeria após filtrar
      setTimeout(function() {
        reinitializeGallery();
      }, 300);
    });
  }
  
  /**
   * Reinicializa a galeria corretamente para dispositivos móveis
   */
  function reinitializeGallery() {
    // Coletar todas as imagens visíveis em sua ordem correta
    const visibleItems = getVisibleItems();
    
    // Configurar o Magnific Popup corretamente
    $('.popupimg').magnificPopup({
      type: 'image',
      closeOnContentClick: false, // Evitar que feche ao tocar na imagem
      closeBtnInside: true, // Botão de fechar dentro do popup
      fixedContentPos: true, // Impedir scroll da página por trás
      mainClass: 'mfp-no-margins mfp-with-zoom', // Classe para estilo
      image: {
        verticalFit: true,
        titleSrc: function(item) {
          const gridItem = item.el.closest('.grid-item');
          if (gridItem) {
            const overlay = gridItem.querySelector('.overlay');
            if (overlay) {
              return overlay.textContent;
            }
          }
          return '';
        }
      },
      gallery: {
        enabled: true,
        navigateByImgClick: false, // Desativar navegação por clique na imagem
        preload: [1, 2], // Pré-carregar imagens adjacentes
        tPrev: 'Anterior',
        tNext: 'Próxima',
        tCounter: '%curr% de %total%'
      },
      callbacks: {
        open: function() {
          addSwipeNavigation();
          addCloseButton();
        },
        change: function() {
          // Ao mudar de imagem, registrar o índice atual
          console.log("Imagem atual:", this.currItem.index);
        }
      }
    });
    
    // Melhorar o evento de clique para abrir a galeria
    $('.grid-item').on('click touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Abrir a galeria com o item correto
      const currentIndex = Array.from(visibleItems).indexOf(this);
      console.log("Abrindo galeria no índice:", currentIndex);
      
      // Trigger click no link correto
      $(this).find('.popupimg').trigger('click');
    });
  }
  
  /**
   * Obtém os itens visíveis na ordem correta
   */
  function getVisibleItems() {
    // Obter todos os itens da grade que não estão ocultos pelo filtro
    return document.querySelectorAll('.grid-item:not(.isotope-hidden)');
  }
  
  /**
   * Adiciona navegação por swipe à galeria
   */
  function addSwipeNavigation() {
    const container = document.querySelector('.mfp-container');
    if (!container) return;
    
    console.log("Adicionando navegação por swipe");
    
    // Adicionar indicadores visuais
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'swipe-indicator left';
    leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'swipe-indicator right';
    rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
    
    container.appendChild(leftIndicator);
    container.appendChild(rightIndicator);
    
    // Adicionar instrução
    const instruction = document.createElement('div');
    instruction.className = 'gallery-instruction';
    instruction.innerHTML = '<p>Deslize para navegar</p>';
    container.appendChild(instruction);
    
    // Esconder instrução após alguns segundos
    setTimeout(function() {
      instruction.style.opacity = '0';
      setTimeout(function() {
        instruction.remove();
      }, 500);
    }, 3000);
    
    // Configurar detecção de swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchmove', function(e) {
      const currentX = e.changedTouches[0].screenX;
      const diff = currentX - touchStartX;
      
      // Mostrar indicador conforme direção do swipe
      if (diff > 50) {
        leftIndicator.classList.add('active');
        rightIndicator.classList.remove('active');
      } else if (diff < -50) {
        rightIndicator.classList.add('active');
        leftIndicator.classList.remove('active');
      } else {
        leftIndicator.classList.remove('active');
        rightIndicator.classList.remove('active');
      }
    }, { passive: true });
    
    container.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      
      // Se o swipe for significativo, navegar
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe para direita - imagem anterior
          $.magnificPopup.instance.prev();
        } else {
          // Swipe para esquerda - próxima imagem
          $.magnificPopup.instance.next();
        }
      }
      
      // Resetar estado dos indicadores
      leftIndicator.classList.remove('active');
      rightIndicator.classList.remove('active');
    }, { passive: true });
    
    // Adicionar também suporte a clique nos indicadores
    leftIndicator.addEventListener('click', function() {
      $.magnificPopup.instance.prev();
    });
    
    rightIndicator.addEventListener('click', function() {
      $.magnificPopup.instance.next();
    });
  }
  
  /**
   * Adiciona botão de fechar mais visível
   */
  function addCloseButton() {
    const container = document.querySelector('.mfp-container');
    if (!container) return;
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'mobile-close-btn';
    closeBtn.innerHTML = '<i class="fa fa-times"></i>';
    container.appendChild(closeBtn);
    
    closeBtn.addEventListener('click', function() {
      $.magnificPopup.close();
    });
  }
  
  /**
   * Melhora a experiência de toque em geral
   */
  function enhanceTouchExperience() {
    // Melhorar feedback de toque
    $('.filters li a, .grid-item, .theme-toggle, .float').addClass('touch-enhanced');
    
    // Adicionar feedback visual para toques
    document.addEventListener('touchstart', function(e) {
      const target = e.target.closest('.touch-enhanced');
      if (!target) return;
      
      target.classList.add('touch-active');
      
      // Remover classe após toque
      function removeTouchClass() {
        target.classList.remove('touch-active');
        document.removeEventListener('touchend', removeTouchClass);
        document.removeEventListener('touchcancel', removeTouchClass);
      }
      
      document.addEventListener('touchend', removeTouchClass);
      document.addEventListener('touchcancel', removeTouchClass);
    }, { passive: true });
  }
  
  // Adicionar estilos CSS necessários
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Estilos otimizados para mobile */
    .grid-item {
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      -webkit-touch-callout: none !important;
    }
    
    .grid-item.touch-active {
      opacity: 0.8;
      transform: scale(0.98);
    }
    
    /* Indicadores de swipe */
    .swipe-indicator {
      position: absolute;
      top: 50%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1050;
      pointer-events: auto;
    }
    
    .swipe-indicator.left {
      left: 20px;
    }
    
    .swipe-indicator.right {
      right: 20px;
    }
    
    .swipe-indicator.active {
      opacity: 0.8;
    }
    
    .swipe-indicator i {
      color: white;
      font-size: 24px;
    }
    
    /* Instruções para galeria */
    .gallery-instruction {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 16px;
      z-index: 1060;
      transition: opacity 0.5s ease;
      text-align: center;
    }
    
    /* Botão de fechar melhorado */
    .mobile-close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 40px;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1100;
      cursor: pointer;
    }
    
    .mobile-close-btn i {
      color: white;
      font-size: 20px;
    }
    
    /* Estilos para Magnific Popup melhorado */
    .mfp-container {
      padding: 0 !important;
    }
    
    .mfp-figure {
      padding: 0 !important;
      margin: 0 !important;
    }
    
    .mfp-bottom-bar {
      background: rgba(0, 0, 0, 0.7);
      padding: 15px 10px;
      margin-top: -40px !important;
    }
    
    /* Melhor suporte a toque para filtros */
    .filters li a {
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      padding: 10px 20px !important;
    }
    
    .filters li.touch-active {
      background: rgba(227, 202, 102, 0.2);
    }
  `;
  document.head.appendChild(styleElement);
});
