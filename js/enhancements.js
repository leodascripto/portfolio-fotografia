// Adicionar ao arquivo js/script.js ou criar um novo arquivo js/enhancements.js

$(document).ready(function() {
    // Implementação de Lazy Loading para as imagens
    function lazyLoadImages() {
      const images = document.querySelectorAll('.grid-item img');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              
              if (src) {
                img.src = src;
                img.classList.add('loaded');
                
                // Quando a imagem carregar completamente
                img.onload = function() {
                  // Remover o skeleton loader
                  const parent = img.closest('.grid-item');
                  const skeleton = parent.querySelector('.skeleton-loader');
                  if (skeleton) {
                    skeleton.remove();
                  }
                  
                  // Adicionar classe para animação
                  parent.classList.add('animated');
                };
                
                // Parar de observar este elemento
                observer.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '0px 0px 50px 0px', // Carrega as imagens quando estiverem a 50px de entrar na viewport
          threshold: 0.1
        });
        
        // Observar cada imagem
        images.forEach(img => {
          // Adicionar classe para efeito de fade-in
          img.classList.add('lazy-load');
          
          // Adicionar skeleton loader
          const parent = img.closest('.grid-item');
          const skeleton = document.createElement('div');
          skeleton.className = 'skeleton-loader';
          parent.appendChild(skeleton);
          
          // Substituir src por data-src para lazy loading
          const src = img.src;
          img.setAttribute('data-src', src);
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // Imagem transparente 1x1
          
          // Observar a imagem
          imageObserver.observe(img);
        });
      } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        images.forEach(img => {
          img.src = img.getAttribute('data-src') || img.src;
        });
      }
    }
  
    // Inicializar o lazy loading após o Isotope ser inicializado
    function initLazyLoadingAfterIsotope() {
      const isotopeInstance = $('#container').data('isotope');
      
      if (isotopeInstance) {
        lazyLoadImages();
      } else {
        // Tentar novamente após 100ms se o Isotope ainda não estiver pronto
        setTimeout(initLazyLoadingAfterIsotope, 100);
      }
    }
    
    // Iniciar o processo
    initLazyLoadingAfterIsotope();
    
    // Animações de elementos quando entram na viewport
    function setupScrollAnimations() {
      const elements = document.querySelectorAll('.grid-item');
      
      // Adicionar classe para controlar animações
      elements.forEach(el => {
        el.classList.add('animate-on-scroll');
      });
      
      if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              // Parar de observar este elemento
              animationObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -50px 0px', // Animar quando o elemento estiver 50px na viewport
          threshold: 0.1
        });
        
        // Observar cada elemento
        elements.forEach(el => {
          animationObserver.observe(el);
        });
      } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        elements.forEach(el => {
          el.classList.add('animated');
        });
      }
    }
    
    // Inicializar animações
    setTimeout(setupScrollAnimations, 500);
    
    // Implementar alteração de tema claro/escuro
    if (document.querySelector('.theme-toggle')) {
      document.querySelector('.theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        // Salvar preferência do usuário
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('lightMode', isLightMode);
        
        // Atualizar ícone
        const icon = this.querySelector('i');
        if (isLightMode) {
          icon.className = 'fa fa-moon-o';
        } else {
          icon.className = 'fa fa-sun-o';
        }
        
        // Re-layout do isotope após mudança de tema
        $('#container').isotope('layout');
      });
      
      // Verificar preferência salva
      const savedLightMode = localStorage.getItem('lightMode');
      if (savedLightMode === 'true') {
        document.body.classList.add('light-mode');
        document.querySelector('.theme-toggle i').className = 'fa fa-moon-o';
      }
    }
    
    // Adicionar indicação de swipe para mobile
    function addSwipeIndicator() {
      if (window.matchMedia("(max-width: 768px)").matches) {
        const gridItems = document.querySelectorAll('.grid-item');
        
        gridItems.forEach((item, index) => {
          if (index === 0) { // Mostrar apenas no primeiro item para não ser intrusivo
            const indicator = document.createElement('div');
            indicator.className = 'swipe-indicator';
            indicator.textContent = 'Deslize para navegar';
            item.appendChild(indicator);
          }
          
          // Adicionar atributos ARIA para acessibilidade
          item.setAttribute('role', 'button');
          item.setAttribute('aria-label', `Ver imagem ${index + 1}`);
          item.setAttribute('tabindex', '0');
        });
        
        // Adicionar evento de teclado para acessibilidade
        document.querySelectorAll('.grid-item[tabindex="0"]').forEach(item => {
          item.addEventListener('keydown', function(e) {
            // Enter ou espaço
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.querySelector('a').click();
            }
          });
        });
      }
    }
    
    // Chamar a função após o carregamento do Isotope
    setTimeout(addSwipeIndicator, 1000);
    
    // Adicionar botão para voltar ao topo
    function addScrollToTopButton() {
      // Criar botão
      const button = document.createElement('div');
      button.className = 'scroll-to-top';
      button.innerHTML = '<i class="fa fa-chevron-up"></i>';
      button.setAttribute('aria-label', 'Voltar ao topo');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      document.body.appendChild(button);
      
      // Adicionar evento de clique
      button.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Mostrar/ocultar com base na posição de rolagem
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          button.classList.add('visible');
        } else {
          button.classList.remove('visible');
        }
      });
      
      // Adicionar controle por teclado
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }
    
    // Adicionar botão de voltar ao topo
    addScrollToTopButton();
    
    // Melhorar desempenho da filtragem com loading indicator
    function enhanceFilteringPerformance() {
      // Criar indicador de carregamento
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      document.body.appendChild(loadingIndicator);
      
      // Interceptar cliques nos filtros
      $('.filters li a').on('click', function() {
        loadingIndicator.style.display = 'block';
        
        // Usar setTimeout para permitir que o indicador seja exibido antes da operação pesada
        setTimeout(() => {
          // Após o re-layout do Isotope
          $('#container').one('layoutComplete', function() {
            loadingIndicator.style.display = 'none';
          });
        }, 50);
      });
    }
    
    // Melhorar desempenho da filtragem
    enhanceFilteringPerformance();
    
    // Melhorar acessibilidade dos filtros
    function enhanceFiltersAccessibility() {
      $('.filters li a').attr('role', 'button');
      
      // Tornar os filtros funcionais via teclado
      $('.filters li a').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $(this).trigger('click');
        }
      });
      
      // Adicionar aria-current para o filtro ativo
      $('.filters li').on('click', function() {
        $('.filters li a').attr('aria-current', 'false');
        $(this).find('a').attr('aria-current', 'true');
      });
      
      // Inicializar estado
      $('.filters li.active a').attr('aria-current', 'true');
    }
    
    // Melhorar acessibilidade
    enhanceFiltersAccessibility();
    
    // Adicionar navegação por swipe para galeria no mobile
    function enhanceMobileGalleryNavigation() {
      if (!window.matchMedia("(max-width: 768px)").matches) return;
      
      let touchStartX = 0;
      let touchEndX = 0;
      let currentImage = null;
      
      // Detectar início do toque
      document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        
        // Verificar se o toque foi em uma imagem da galeria
        const target = e.target.closest('.grid-item');
        if (target) {
          currentImage = target;
        }
      }, false);
      
      // Detectar fim do toque
      document.addEventListener('touchend', function(e) {
        if (!currentImage) return;
        
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        currentImage = null;
      }, false);
      
      // Processar o swipe
      function handleSwipe() {
        const threshold = 100; // Mínimo de pixels para considerar um swipe
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) < threshold) return;
        
        // Obter todas as imagens visíveis
        const visibleImages = Array.from(document.querySelectorAll('.grid-item:not(.isotope-hidden)'));
        const currentIndex = visibleImages.indexOf(currentImage);
        
        if (diff > 0 && currentIndex > 0) {
          // Swipe para direita - imagem anterior
          visibleImages[currentIndex - 1].querySelector('a').click();
        } else if (diff < 0 && currentIndex < visibleImages.length - 1) {
          // Swipe para esquerda - próxima imagem
          visibleImages[currentIndex + 1].querySelector('a').click();
        }
      }
    }
    
    // Ativar navegação por swipe no mobile
    enhanceMobileGalleryNavigation();
  });