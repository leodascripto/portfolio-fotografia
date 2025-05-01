/**
 * Inicialização segura para portfolio
 * Este script espera que o carregamento original aconteça primeiro
 */

// Esperar pelo carregamento completo da página
window.addEventListener('load', function() {
  console.log('Inicializando melhorias após carregamento completo...');
  
  // Esperar um momento para garantir que as imagens originais foram carregadas
  setTimeout(function() {
    // Verificar se a galeria já está carregada
    if ($('#container').data('isotope')) {
      console.log('Galeria detectada, aplicando melhorias visuais...');
      
      // Aplicar classes para animações
      $('.grid-item').addClass('animate-on-scroll');
      $('#logo').addClass('animate-on-scroll');
      
      // Adicionar observador de interseção para animar elementos
      if ('IntersectionObserver' in window) {
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
        
        // Observar elementos para animações
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          observer.observe(el);
        });
      }
      
      // Melhorar experiência de mobile
      if (window.matchMedia('(max-width: 768px)').matches) {
        enhanceMobileExperience();
      }
    }
  }, 1000);
});

// Função para melhorar experiência em dispositivos móveis
function enhanceMobileExperience() {
  // Verificar se o container de filtros existe
  const filtersContainer = document.querySelector('.filters ul');
  if (!filtersContainer) return;
  
  // Verificar se é necessário adicionar indicadores de scroll
  if (filtersContainer.scrollWidth > filtersContainer.clientWidth) {
    // Adicionar classe para marcar como scrollável
    document.querySelector('.filters').classList.add('scrollable');
    
    // Adicionar indicadores de scroll
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'scroll-indicator left';
    leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'scroll-indicator right';
    rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
    
    document.querySelector('.filters').appendChild(leftIndicator);
    document.querySelector('.filters').appendChild(rightIndicator);
    
    // Atualizar visibilidade dos indicadores
    filtersContainer.addEventListener('scroll', function() {
      const isScrolledLeft = this.scrollLeft > 20;
      const isScrolledRight = this.scrollLeft < (this.scrollWidth - this.clientWidth - 20);
      
      leftIndicator.classList.toggle('visible', isScrolledLeft);
      rightIndicator.classList.toggle('visible', isScrolledRight);
    });
    
    // Iniciar com scroll à direita visível
    rightIndicator.classList.add('visible');
    
    // Adicionar funcionalidade aos indicadores
    leftIndicator.addEventListener('click', function() {
      filtersContainer.scrollBy({ left: -100, behavior: 'smooth' });
    });
    
    rightIndicator.addEventListener('click', function() {
      filtersContainer.scrollBy({ left: 100, behavior: 'smooth' });
    });
  }
  
  // Melhorar instruções móveis
  const instructions = document.querySelector('.mobile-instructions');
  if (instructions) {
    instructions.classList.add('animated');
  }
}
