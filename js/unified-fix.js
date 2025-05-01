/**
 * Portfolio Fix - Solução unificada para problemas de filtro e galeria
 * Este script corrige os problemas de filtro e a abertura de imagens em dispositivos móveis
 */

// Executar após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log("Iniciando correção unificada...");
    
    // Verificar se é um dispositivo móvel
    const isMobile = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     window.matchMedia("(max-width: 768px)").matches;
    
    // 1. ETAPA: Remover todos os listeners de eventos conflitantes
    limparEventosConflitantes();
    
    // 2. ETAPA: Reinicializar o Isotope corretamente
    reinicializarIsotope();
    
    // 3. ETAPA: Configurar eventos de filtro otimizados
    configurarFiltros();
    
    // 4. ETAPA: Configurar galeria Magnific Popup corretamente
    configurarGaleria();
    
    // 5. ETAPA: Adicionar otimizações específicas para mobile
    if (isMobile) {
      aplicarOtimizacoesMobile();
    }
    
    console.log("Correção unificada aplicada com sucesso");
    
    /**
     * Remove todos os listeners de eventos conflitantes
     */
    function limparEventosConflitantes() {
      console.log("Removendo eventos conflitantes...");
      
      // Remover eventos dos filtros
      const filtros = document.querySelectorAll('.filters li a');
      filtros.forEach(filtro => {
        const cloneDoFiltro = filtro.cloneNode(true);
        filtro.parentNode.replaceChild(cloneDoFiltro, filtro);
      });
      
      // Remover eventos das imagens
      const imagens = document.querySelectorAll('.grid-item a, .popupimg');
      imagens.forEach(imagem => {
        const cloneDaImagem = imagem.cloneNode(true);
        imagem.parentNode.replaceChild(cloneDaImagem, imagem);
      });
      
      // Desconectar magnificPopup se existir
      if ($.magnificPopup && $.magnificPopup.instance) {
        $.magnificPopup.close();
        $.magnificPopup.instance = null;
      }
      
      // Destruir Isotope se já estiver inicializado
      const $container = $('#container');
      if ($container.data('isotope')) {
        $container.isotope('destroy');
      }
    }
    
    /**
     * Reinicializa o Isotope com configurações otimizadas
     */
    function reinicializarIsotope() {
      console.log("Reinicializando Isotope...");
      
      const $container = $('#container');
      
      // Garantir que as imagens estejam carregadas antes da inicialização
      $container.imagesLoaded(function() {
        // Inicializar o Isotope com configurações otimizadas
        $container.isotope({
          itemSelector: '.grid-item',
          layoutMode: 'masonry',
          masonry: {
            columnWidth: '.grid-item',
            gutter: 15,
            fitWidth: true
          },
          percentPosition: true,
          transitionDuration: '0.4s',
          hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.8)'
          },
          visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
          }
        });
        
        // Forçar relayout após um curto delay
        setTimeout(function() {
          $container.isotope('layout');
          console.log("Layout do Isotope atualizado");
        }, 300);
      });
    }
    
    /**
     * Configura os eventos de filtro
     */
    function configurarFiltros() {
      console.log("Configurando filtros otimizados...");
      
      const $container = $('#container');
      const filtros = document.querySelectorAll('.filters li a');
      
      filtros.forEach(filtro => {
        // Adicionar evento de clique otimizado
        filtro.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Mostrar indicador de carregamento
          const loadingIndicator = document.querySelector('.loading-indicator');
          if (loadingIndicator) loadingIndicator.style.display = 'block';
          
          // Obter valor do filtro
          const filterValue = this.getAttribute('data-filter');
          console.log("Filtro selecionado:", filterValue);
          
          // Atualizar classes ativas
          document.querySelectorAll('.filters li').forEach(item => {
            item.classList.remove('active');
          });
          this.parentNode.classList.add('active');
          
          // Atualizar atributos ARIA
          document.querySelectorAll('.filters li a').forEach(item => {
            item.setAttribute('aria-current', 'false');
          });
          this.setAttribute('aria-current', 'true');
          
          // Aplicar filtro com pequeno atraso para garantir resposta visual
          setTimeout(() => {
            try {
              $container.isotope({ filter: filterValue });
              console.log("Filtro aplicado com sucesso");
              
              // Relayout e reconfigurar galeria após filtragem
              setTimeout(() => {
                $container.isotope('layout');
                configurarGaleria();
                if (loadingIndicator) loadingIndicator.style.display = 'none';
              }, 300);
            } catch (error) {
              console.error("Erro ao aplicar filtro:", error);
              if (loadingIndicator) loadingIndicator.style.display = 'none';
            }
          }, 50);
        });
        
        // Adicionar suporte a eventos de toque para mobile
        if (isMobile) {
          filtro.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
          }, { passive: false });
        }
      });
    }
    
    /**
     * Configura a galeria Magnific Popup
     */
    function configurarGaleria() {
      console.log("Configurando galeria Magnific Popup...");
      
      // Remover inicializações anteriores
      $('.popupimg').off('click');
      
      // Configurar nova inicialização
      $('.popupimg').magnificPopup({
        type: 'image',
        closeOnContentClick: false,
        closeBtnInside: true,
        fixedContentPos: true,
        mainClass: 'mfp-with-zoom',
        image: {
          verticalFit: true,
          titleSrc: function(item) {
            const gridItem = item.el.closest('.grid-item');
            return gridItem ? gridItem.querySelector('.overlay').textContent : '';
          }
        },
        gallery: {
          enabled: true,
          navigateByImgClick: false,
          preload: [1, 1],
          tPrev: 'Anterior',
          tNext: 'Próxima',
          tCounter: '%curr% de %total%'
        },
        callbacks: {
          open: function() {
            console.log("Galeria aberta");
            // Adicionar navegação por toque para mobile
            if (isMobile) {
              adicionarNavegacaoPorToque();
            }
          },
          close: function() {
            console.log("Galeria fechada");
          }
        }
      });
      
      // Melhorar eventos de clique nos itens da grade
      $('.grid-item').on('click', function(e) {
        // Verificar se o clique foi no próprio grid-item e não em algum elemento filho com evento próprio
        if (e.target === this || $(e.target).closest('.grid-item').is(this)) {
          e.preventDefault();
          // Acionar o link do popup
          $(this).find('.popupimg').trigger('click');
        }
      });
      
      // Para mobile, adicionar evento de toque específico
      if (isMobile) {
        $('.grid-item').each(function() {
          this.addEventListener('touchend', function(e) {
            // Verificar se o toque foi no item da grade e não em algum elemento filho
            if (e.target === this || $(e.target).closest('.grid-item').is(this)) {
              e.preventDefault();
              $(this).find('.popupimg').trigger('click');
            }
          }, { passive: false });
        });
      }
    }
    
    /**
     * Adiciona navegação por toque para galeria no mobile
     */
    function adicionarNavegacaoPorToque() {
      console.log("Adicionando navegação por toque para galeria...");
      
      const container = document.querySelector('.mfp-container');
      if (!container) return;
      
      // Adicionar indicadores visuais
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'swipe-indicator left';
      leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
      
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'swipe-indicator right';
      rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
      
      container.appendChild(leftIndicator);
      container.appendChild(rightIndicator);
      
      // Adicionar instruções
      const instructions = document.createElement('div');
      instructions.className = 'gallery-instruction';
      instructions.innerHTML = '<p>Deslize para navegar</p>';
      container.appendChild(instructions);
      
      // Ocultar instruções após alguns segundos
      setTimeout(function() {
        instructions.style.opacity = '0';
        setTimeout(function() {
          instructions.remove();
        }, 500);
      }, 3000);
      
      // Configurar detecção de swipe
      let touchStartX = 0;
      let touchMoveX = 0;
      
      container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      container.addEventListener('touchmove', function(e) {
        touchMoveX = e.changedTouches[0].screenX;
        const diff = touchMoveX - touchStartX;
        
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
        const touchEndX = e.changedTouches[0].screenX;
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
     * Aplica otimizações específicas para dispositivos móveis
     */
    function aplicarOtimizacoesMobile() {
      console.log("Aplicando otimizações para dispositivos móveis...");
      
      // Otimizar áreas de toque para melhor interação
      document.querySelectorAll('.filters li a, .grid-item, [role="button"]').forEach(element => {
        element.classList.add('touch-optimized');
      });
      
      // Adicionar feedback visual ao tocar nos filtros
      document.querySelectorAll('.filters li').forEach(filtro => {
        filtro.addEventListener('touchstart', function() {
          this.classList.add('touch-active');
        }, { passive: true });
        
        filtro.addEventListener('touchend touchcancel', function() {
          const self = this;
          setTimeout(function() {
            self.classList.remove('touch-active');
          }, 150);
        }, { passive: true });
      });
      
      // Verificar se o container de filtros precisa de indicadores de scroll
      const filtersContainer = document.querySelector('.filters ul');
      if (filtersContainer && filtersContainer.scrollWidth > filtersContainer.clientWidth) {
        adicionarIndicadoresDeScroll();
      }
      
      // Melhorar exibição das instruções móveis
      const mobileInstructions = document.querySelector('.mobile-instructions');
      if (mobileInstructions) {
        mobileInstructions.style.display = 'block';
        mobileInstructions.classList.add('animated');
        
        // Ocultar após 5 segundos
        setTimeout(function() {
          mobileInstructions.classList.add('hiding');
          setTimeout(function() {
            mobileInstructions.style.display = 'none';
          }, 500);
        }, 5000);
      }
    }
    
    /**
     * Adiciona indicadores de scroll para filtros em dispositivos móveis
     */
    function adicionarIndicadoresDeScroll() {
      console.log("Adicionando indicadores de scroll para filtros...");
      
      const filters = document.querySelector('.filters');
      filters.classList.add('scrollable');
      
      const filtersList = filters.querySelector('ul');
      
      // Criar indicadores apenas se ainda não existirem
      if (!filters.querySelector('.scroll-indicator')) {
        // Adicionar indicadores visuais
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'scroll-indicator left';
        leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
        
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'scroll-indicator right';
        rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
        
        filters.appendChild(leftIndicator);
        filters.appendChild(rightIndicator);
        
        // Inicialmente mostrar apenas o indicador direito
        rightIndicator.classList.add('visible');
        
        // Atualizar indicadores ao rolar
        filtersList.addEventListener('scroll', function() {
          const isScrolledLeft = this.scrollLeft > 20;
          const isScrolledRight = this.scrollLeft < (this.scrollWidth - this.clientWidth - 20);
          
          leftIndicator.classList.toggle('visible', isScrolledLeft);
          rightIndicator.classList.toggle('visible', isScrolledRight);
        });
        
        // Adicionar funcionalidade aos indicadores
        leftIndicator.addEventListener('click', function() {
          filtersList.scrollBy({ left: -100, behavior: 'smooth' });
        });
        
        rightIndicator.addEventListener('click', function() {
          filtersList.scrollBy({ left: 100, behavior: 'smooth' });
        });
      }
    }
  });
  
  // Adicionar estilos necessários para indicadores, etc.
  (function() {
    const styles = `
      /* Estilos para indicadores de swipe na galeria */
      .swipe-indicator {
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
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
      
      /* Otimizações para dispositivos móveis */
      .touch-optimized {
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
      }
      
      .filters li.touch-active {
        background: rgba(227, 202, 102, 0.3);
        transform: scale(0.97);
      }
      
      /* Animações para instruções móveis */
      .mobile-instructions.animated {
        animation: slideUp 0.5s ease forwards;
      }
      
      .mobile-instructions.hiding {
        opacity: 0;
        transform: translateY(20px);
      }
      
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      /* Melhorar estilos de Magnific Popup em mobile */
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
      
      .mfp-close {
        padding: 0 !important;
        width: 44px !important;
        height: 44px !important;
        line-height: 44px !important;
        opacity: 1 !important;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  })();