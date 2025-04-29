$(document).ready(function () {
  console.log("Interações extras podem ser adicionadas aqui.");
});

// Adicionar melhorias de navegabilidade para dispositivos móveis
$(document).ready(function() {
  // Verificar se é um dispositivo móvel
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    // Configuração do slider mobile
    setupMobileGallerySwipe();
    
    // Melhorar a experiência de toque nas imagens
    enhanceTouchExperience();
  }

  // Função para configurar o swipe na galeria mobile
  function setupMobileGallerySwipe() {
    // Container da galeria
    const container = document.getElementById('container');
    
    if (!container) return;
    
    // Configurar o Magnific Popup com suporte melhorado a gestos
    $(document).on('mfpOpen', function() {
      const popupContainer = document.querySelector('.mfp-container');
      
      if (popupContainer) {
        let startX, startY, isDragging = false;
        
        popupContainer.addEventListener('touchstart', function(e) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isDragging = false;
        });
        
        popupContainer.addEventListener('touchmove', function(e) {
          if (startX === undefined || startY === undefined) return;
          
          const moveX = e.touches[0].clientX;
          const moveY = e.touches[0].clientY;
          const diffX = moveX - startX;
          const diffY = moveY - startY;
          
          // Se o movimento horizontal for maior que o vertical, é um swipe lateral
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            isDragging = true;
            e.preventDefault(); // Prevenir scroll apenas se for swipe lateral
          }
        });
        
        popupContainer.addEventListener('touchend', function(e) {
          if (startX === undefined || startY === undefined) return;
          
          const endX = e.changedTouches[0].clientX;
          const diffX = endX - startX;
          
          // Se foi um swipe lateral significativo
          if (isDragging && Math.abs(diffX) > 50) {
            if (diffX > 0) {
              // Swipe para direita - imagem anterior
              $.magnificPopup.instance.prev();
            } else {
              // Swipe para esquerda - próxima imagem
              $.magnificPopup.instance.next();
            }
          }
          
          startX = startY = undefined;
        });
      }
    });
  }
  
  // Função para melhorar a experiência de toque
  function enhanceTouchExperience() {
    // Melhorar feedback visual ao tocar em imagens
    $('.grid-item').each(function() {
      const item = $(this);
      
      // Adicionar feedback visual ao tocar
      item.on('touchstart', function() {
        item.addClass('touch-active');
      });
      
      item.on('touchend touchcancel', function() {
        item.removeClass('touch-active');
        // Adicionar um pequeno delay para garantir que o feedback seja visto
        setTimeout(function() {
          item.removeClass('touch-active');
        }, 100);
      });
    });
    
    // Adicionar indicador visual de arrastar para navegar na galeria
    const firstItem = $('.grid-item').first();
    if (firstItem.length) {
      const indicator = $('<div class="swipe-indicator">Deslize para navegar</div>');
      indicator.appendTo(firstItem);
      
      // Ocultar após alguns segundos
      setTimeout(function() {
        indicator.fadeOut();
      }, 3000);
    }
  }

  // Modificar o comportamento do Magnific Popup para melhor experiência mobile
  $('.popupimg').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      tPrev: 'Anterior',
      tNext: 'Próxima',
      tCounter: '%curr% de %total%'
    },
    callbacks: {
      open: function() {
        // Adiciona classes para melhorar a acessibilidade
        $('.mfp-container').attr('role', 'dialog');
        $('.mfp-content').attr('aria-live', 'polite');
        
        // Garantir que a imagem correta seja mostrada
        console.log("Imagem aberta: ", $.magnificPopup.instance.currItem.src);
      }
    }
  });
  
  // Adiciona suporte a teclado para acessibilidade
  $(document).keydown(function(e) {
    if ($.magnificPopup.instance.isOpen) {
      // Tecla seta esquerda
      if (e.keyCode === 37) {
        $.magnificPopup.instance.prev();
      }
      // Tecla seta direita
      else if (e.keyCode === 39) {
        $.magnificPopup.instance.next();
      }
      // Tecla ESC
      else if (e.keyCode === 27) {
        $.magnificPopup.instance.close();
      }
    }
  });
});


// Adicionar este CSS inline para garantir a experiência de toque
$(document).ready(function() {
  // Adicionar estilos para melhorar a experiência de toque
  $('<style>')
    .prop('type', 'text/css')
    .html(`
      @media (max-width: 768px) {
        /* Permitir scroll natural */
        .grid-item {
          touch-action: pan-y;
        }
        
        /* Feedback visual ao tocar */
        .grid-item.touch-active {
          opacity: 0.8;
          transform: scale(0.98);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        /* Indicador de swipe */
        .swipe-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 15px;
          border-radius: 20px;
          font-size: 14px;
          pointer-events: none;
          z-index: 100;
        }
        
        /* Melhorar áreas de toque para Magnific Popup */
        .mfp-arrow {
          transform: scale(1.5);
          opacity: 0.8 !important;
        }
        
        .mfp-container::before,
        .mfp-container::after {
          width: 40px !important;
          height: 40px !important;
        }
      }
    `)
    .appendTo('head');
  
  // Função para garantir que o Isotope respeite os limites da tela
  function ajustarIsotope() {
    // Certificar-se de que o Isotope foi inicializado
    var $container = $('#container');
    if ($container.data('isotope')) {
      // Forçar relayout com novas configurações
      $container.isotope({
        itemSelector: '.grid-item',
        layoutMode: 'masonry',
        masonry: {
          columnWidth: '.grid-item',
          gutter: 20, // Espaçamento consistente entre itens
          fitWidth: true // Importante para centralizar o layout
        },
        percentPosition: true, // Usar posicionamento baseado em porcentagem
        resize: true // Relayout automaticamente ao redimensionar a janela
      });
      
      // Forçar relayout após o carregamento completo
      setTimeout(function() {
        $container.isotope('layout');
      }, 100);
    }
  }
  
  // Inicialização e redimensionamento
  ajustarIsotope();
  
  // Relayout em redimensionamento de janela com debounce
  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(ajustarIsotope, 100);
  });
  
  // Garantir que as imagens sejam carregadas antes do layout final
  $(window).on('load', function() {
    ajustarIsotope();
  });
  
  // Ajustar layout quando filtros são clicados
  $('.filters li a').on('click', function() {
    setTimeout(ajustarIsotope, 300);
  });
});