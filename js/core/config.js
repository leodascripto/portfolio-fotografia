/**
 * Configuração Central
 * Arquivo de configuração com variáveis centralizadas para o portfolio
 */

const PortfolioConfig = {
  // Seletores de elementos importantes
  selectors: {
    container: '#container',
    filters: '.filters li a',
    loadingIndicator: '.loading-indicator',
    themeToggle: '.theme-toggle',
    logo: '#logo',
    gridItems: '.grid-item'
  },
  
  // Configurações de imagem
  images: {
    lazyLoading: true,
    preload: 3,
    placeholderColor: '#2a2a2a',
    supportedFormats: ['webp', 'jpg', 'jpeg', 'png']
  },
  
  // Configurações de layout
  layout: {
    columnGap: 15,
    transitionDuration: 0.4,
    staggerDelay: 30
  },
  
  // Configurações de performance
  performance: {
    debounceTime: 150,
    criticalAssets: [
      'assets/img/logo.png',
      'assets/img/favicon.png'
    ]
  },
  
  // Configurações de acessibilidade
  accessibility: {
    ariaLabels: {
      galleryContainer: 'Galeria de fotos',
      themeToggle: 'Alternar tema claro/escuro',
      scrollToTop: 'Voltar ao topo'
    },
    focusSelectors: 'a, button, [role="button"], [tabindex="0"]'
  }
};
