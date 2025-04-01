$(document).ready(function () {
  console.log("Interações extras podem ser adicionadas aqui.");
});

// Adicionar ao arquivo js/script.js

$(document).ready(function() {
  // Verificar se é um dispositivo móvel
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    // Configuração do slider mobile
    setupMobileGallerySwipe();
  }

  // Função para configurar o swipe na galeria mobile
  function setupMobileGallerySwipe() {
    // Container da galeria
    const container = document.getElementById('container');
    
    if (!container) return;
    
    // Variáveis para controlar o swipe
    let startX, moveX, currentImage;
    let threshold = 100; // Distância mínima para considerar um swipe
    
    // Evento de toque inicial
    container.addEventListener('touchstart', function(e) {
      const target = e.target.closest('.grid-item');
      if (!target) return;
      
      startX = e.touches[0].clientX;
      currentImage = target;
      e.preventDefault(); // Previne o comportamento padrão
    }, { passive: false });
    
    // Evento de movimento do toque
    container.addEventListener('touchmove', function(e) {
      if (!currentImage) return;
      moveX = e.touches[0].clientX;
      
      // Calcula a diferença entre a posição inicial e atual
      const diff = moveX - startX;
      
      // Aplica uma transformação para dar a sensação de movimento
      currentImage.style.transform = `translateX(${diff / 5}px)`;
      e.preventDefault();
    }, { passive: false });
    
    // Evento de fim do toque
    container.addEventListener('touchend', function(e) {
      if (!currentImage || !moveX) return;
      
      const diff = moveX - startX;
      currentImage.style.transform = '';
      
      // Determina a direção do swipe
      if (Math.abs(diff) > threshold) {
        // Encontra todas as imagens visíveis
        const visibleItems = Array.from(document.querySelectorAll('.grid-item:not(.isotope-hidden)'));
        const currentIndex = visibleItems.indexOf(currentImage);
        
        if (diff > 0 && currentIndex > 0) {
          // Swipe para a direita - imagem anterior
          openImageInGallery(visibleItems[currentIndex - 1]);
        } else if (diff < 0 && currentIndex < visibleItems.length - 1) {
          // Swipe para a esquerda - próxima imagem
          openImageInGallery(visibleItems[currentIndex + 1]);
        }
      }
      
      // Reset das variáveis
      startX = moveX = null;
      currentImage = null;
    });
    
    // Função para abrir a imagem na galeria
    function openImageInGallery(item) {
      if (!item) return;
      const link = item.querySelector('a.popupimg');
      if (link) {
        link.click();
      }
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
        
        // Habilita gestos de swipe no popup para dispositivos móveis
        if (isMobile) {
          let startX, moveX;
          const popup = document.querySelector('.mfp-container');
          
          popup.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
          });
          
          popup.addEventListener('touchmove', function(e) {
            moveX = e.touches[0].clientX;
          });
          
          popup.addEventListener('touchend', function() {
            if (!startX || !moveX) return;
            
            const diff = moveX - startX;
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                // Swipe para a direita - imagem anterior
                $.magnificPopup.instance.prev();
              } else {
                // Swipe para a esquerda - próxima imagem
                $.magnificPopup.instance.next();
              }
            }
            
            startX = moveX = null;
          });
        }
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


// Adicione este script no final do seu arquivo script.js ou crie um novo arquivo

$(document).ready(function() {
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