#!/bin/bash

# Script para implementação das melhorias no portfolio fotográfico
echo "Iniciando implementação das melhorias para o portfolio de Leo Oli..."

# Criar diretórios necessários se não existirem
mkdir -p js/core js/ui js/utils styles

# Adicionar enhanced.css se não existir
if [ ! -f styles/enhanced.css ]; then
  echo "Criando arquivo enhanced.css..."
  cat > styles/enhanced.css << 'EOL'
/* Enhanced CSS for Leo Oli Photography Portfolio */
/* Versão otimizada do CSS */

/* =========== ENHANCED ANIMATIONS =========== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Logo animations */
#logo {
  transition: transform 0.4s ease;
}

#logo.animated {
  animation: logoReveal 1s ease forwards;
}

#logo.hover {
  transform: scale(1.05);
}

@keyframes logoReveal {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Lazy loading styles */
.grid-item {
  position: relative;
  background-color: rgba(40, 40, 40, 0.3);
}

.grid-item img.lazy {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.grid-item img.loaded {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(40, 40, 40, 0.5) 25%, rgba(60, 60, 60, 0.5) 50%, rgba(40, 40, 40, 0.5) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  z-index: 1;
  pointer-events: none;
  border-radius: var(--grid-radius);
}

.grid-item.loaded .image-placeholder {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Mobile filter improvements */
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

/* Enhanced accessibility */
body.keyboard-navigation a:focus,
body.keyboard-navigation button:focus,
body.keyboard-navigation [role="button"]:focus,
body.keyboard-navigation [tabindex="0"]:focus {
  outline: 3px solid var(--primary-gold);
  outline-offset: 3px;
}

/* Loading animation improvements */
.loading-indicator {
  animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
}

.loading-indicator.fadeout {
  opacity: 0;
  transition: opacity 0.5s ease;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(227, 202, 102, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(227, 202, 102, 0); }
}

/* Mobile instruction improvements */
.mobile-instructions {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

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

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
EOL
fi

# Configurar arquivo config.js
if [ ! -f js/core/config.js ]; then
  echo "Criando arquivo de configuração central..."
  cat > js/core/config.js << 'EOL'
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
EOL
fi

# Atualizar index.html para incluir novos scripts
if [ -f index.html ]; then
  echo "Atualizando index.html para carregar os novos scripts..."
  
  # Verificar se o arquivo já tem as modificações
  if ! grep -q "enhanced.css" index.html; then
    # Adicionar link para enhanced.css
    sed -i '/<link rel="stylesheet" href="\.\/styles\/style.css" \/>/a \    <link rel="stylesheet" href="./styles/enhanced.css" />' index.html
  fi
  
  # Verificar se já tem os novos scripts
  if ! grep -q "js/core/config.js" index.html; then
    # Adicionar novos scripts antes do fechamento do body
    sed -i '/<\/body>/i \    <!-- Scripts Otimizados -->\n    <script src="js/core/config.js"></script>\n    <script src="js/utils/lazy-loading.js"></script>\n    <script src="js/utils/performance.js"></script>\n    <script src="js/core/gallery.js"></script>\n    <script src="js/ui/theme.js"></script>\n    <script src="js/main.js"></script>' index.html
  fi
fi

# Criar arquivo main.js se não existir
if [ ! -f js/main.js ]; then
  echo "Criando arquivo principal main.js..."
  cat > js/main.js << 'EOL'
/**
 * Leo Oli Photography Portfolio
 * Arquivo JavaScript principal
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar os módulos centrais
  console.log('Inicializando portfolio fotográfico...');
  
  // Verificar se já existem implementações antigas e manter compatibilidade
  const isLegacyMode = typeof $.fn.isotope !== 'undefined' && $('#container').data('isotope');
  
  // Inicializar módulos se disponíveis
  if (typeof ThemeManager !== 'undefined') {
    ThemeManager.initialize();
  }
  
  if (typeof LazyLoader !== 'undefined') {
    LazyLoader.initialize();
  }
  
  if (typeof Gallery !== 'undefined') {
    Gallery.initialize({
      onFilterChange: () => {
        // Atualizar lazy loading após mudança de filtro
        if (typeof LazyLoader !== 'undefined') {
          setTimeout(() => {
            LazyLoader.refresh();
          }, 500);
        }
      }
    });
  }
  
  if (typeof PerformanceOptimizer !== 'undefined') {
    PerformanceOptimizer.initialize();
  }
  
  if (typeof ResponsiveImageHandler !== 'undefined') {
    ResponsiveImageHandler.initialize();
  }
  
  // Adicionar animações de scroll para elementos
  if ('IntersectionObserver' in window) {
    const animateElements = document.querySelectorAll('.grid-item, #logo, .header h1, .header .portfolio');
    
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
    
    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }
  
  // Adicionar estilos inline para melhorias visuais
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Estilos adicionais para animações e efeitos */
    .grid-item {
      transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    }
    
    .grid-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .theme-toggle {
      transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .theme-toggle:hover {
      transform: rotate(30deg);
      background-color: rgba(40, 40, 40, 0.9);
    }
    
    .float.clicked {
      transform: scale(1.2) rotate(10deg);
    }
  `;
  document.head.appendChild(styleElement);
});
EOL
fi

echo "Implementação concluída! Os arquivos foram criados ou atualizados conforme necessário."
echo "Para aplicar todas as mudanças, certifique-se de executar 'firebase deploy' para enviar ao servidor."