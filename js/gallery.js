/**
 * Módulo de Galeria
 * Gerencia o carregamento e exibição das imagens
 */

const Gallery = (function() {
  'use strict';
  
  let isotope = null;
  let isLoading = false;
  let $container = null;
  
  // Configuração
  const config = {
    container: '#gallery-container',
    itemSelector: '.grid-item',
    photosUrl: 'json/photos.json'
  };
  
  /**
   * Inicializa a galeria
   */
  function init() {
    $container = $(config.container);
    loadPhotos();
  }
  
  /**
   * Carrega as fotos do JSON
   */
  function loadPhotos() {
    if (isLoading) return;
    isLoading = true;
    
    $.getJSON(config.photosUrl)
      .done(function(photos) {
        renderPhotos(photos);
      })
      .fail(function() {
        console.error('Erro ao carregar fotos');
        // Usar fotos de fallback
        const fallbackPhotos = [
          { name: "Débora", src: "https://i.ibb.co/SxSv6cY/c73b09db7e992cf19e904c273fc0da6a.jpg", filter: "debora" },
          { name: "Gustavo", src: "https://i.ibb.co/mqzGrSc/1714166687091-2.jpg", filter: "gustavo" },
          { name: "Fernanda", src: "https://i.ibb.co/TmwLKgd/1717383827414-1.jpg", filter: "fernanda" },
          { name: "Akira", src: "https://i.ibb.co/0DNJf75/ef03e1e1a7d3041c30a4b248196a0228.jpg", filter: "akira" },
          { name: "Leo Oli", src: "https://i.ibb.co/gzsg2HL/c1f322153045747e8c0ae38e817867ef.jpg", filter: "leooli" },
          { name: "Lisa", src: "https://i.ibb.co/s2B7x0K/1715149773368-3.jpg", filter: "lisa" }
        ];
        renderPhotos(fallbackPhotos);
      })
      .always(function() {
        isLoading = false;
      });
  }
  
  /**
   * Renderiza as fotos no DOM
   */
  function renderPhotos(photos) {
    $container.empty();
    
    // Criar HTML das fotos
    photos.forEach(function(photo) {
      const html = `
        <div class="grid-item ${photo.filter}">
          <a href="${photo.src}" class="gallery-link">
            <img src="${photo.src}" alt="${photo.name}" loading="lazy">
          </a>
          <div class="overlay">${photo.name}</div>
        </div>
      `;
      $container.append(html);
    });
    
    // Inicializar após as imagens carregarem
    $container.imagesLoaded(function() {
      initIsotope();
      initMagnificPopup();
      hideLoader();
    });
  }
  
  /**
   * Inicializa o Isotope para layout e filtros
   */
  function initIsotope() {
    // Destruir instância anterior se existir
    if (isotope) {
      isotope.destroy();
      isotope = null;
    }
    
    // Adicionar classe isotope ao container
    $container.addClass('isotope');
    
    // Inicializar Isotope
    $container.isotope({
      itemSelector: config.itemSelector,
      layoutMode: 'masonry',
      masonry: {
        columnWidth: config.itemSelector,
        gutter: 0,
        fitWidth: false
      },
      percentPosition: true,
      transitionDuration: '0.4s',
      hiddenStyle: {
        opacity: 0,
        transform: 'scale(0.001)'
      },
      visibleStyle: {
        opacity: 1,
        transform: 'scale(1)'
      }
    });
    
    // Armazenar instância
    isotope = $container.data('isotope');
    
    // Forçar layout inicial
    setTimeout(function() {
      $container.isotope('layout');
    }, 100);
  }
  
  /**
   * Inicializa o Magnific Popup para visualização
   */
  function initMagnificPopup() {
    $('.gallery-link').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [1, 1],
        tPrev: 'Anterior',
        tNext: 'Próxima',
        tCounter: '%curr% de %total%'
      },
      image: {
        titleSrc: function(item) {
          const $gridItem = item.el.closest('.grid-item');
          return $gridItem.find('.overlay').text();
        }
      },
      closeOnContentClick: false,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: 'mfp-with-zoom',
      zoom: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out'
      },
      callbacks: {
        open: function() {
          // Adicionar suporte a swipe no mobile
          if (window.Mobile && window.Mobile.isMobile()) {
            Mobile.enableGallerySwipe();
          }
        }
      }
    });
  }
  
  /**
   * Esconde o indicador de loading
   */
  function hideLoader() {
    $('.loading-indicator').addClass('hidden');
    setTimeout(function() {
      $('.loading-indicator').hide();
    }, 300);
  }
  
  /**
   * Aplica filtro na galeria
   */
  function filter(filterValue) {
    if (!$container || !$container.data('isotope')) {
      console.error('Isotope não inicializado');
      return;
    }
    
    console.log('Aplicando filtro:', filterValue);
    
    // Aplicar filtro
    $container.isotope({ filter: filterValue });
    
    // Re-inicializar Magnific Popup após filtrar
    setTimeout(function() {
      initMagnificPopup();
    }, 450);
  }
  
  /**
   * Atualiza layout da galeria
   */
  function updateLayout() {
    if ($container && $container.data('isotope')) {
      $container.isotope('layout');
    }
  }
  
  // API pública
  return {
    init: init,
    filter: filter,
    updateLayout: updateLayout
  };
})();

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
  Gallery.init();
});