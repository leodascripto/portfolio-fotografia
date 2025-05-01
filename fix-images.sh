#!/bin/bash

# Script de correção para o problema de imagens quebradas
echo "Iniciando correção para o problema de imagens..."

# 1. Reverter mudanças no index.html que possam estar conflitando
if grep -q "js/core/config.js" index.html; then
  echo "Removendo scripts novos do index.html para evitar conflitos..."
  # Remover as linhas adicionadas
  sed -i '/<!-- Scripts Otimizados -->/,/js\/main.js/d' index.html
fi

# 2. Criar um arquivo de inicialização seguro que não interfere com o carregamento original
cat > js/init.js << 'EOL'
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
EOL

# 3. Adicionar script de inicialização segura ao index.html
if ! grep -q "js/init.js" index.html; then
  echo "Adicionando script de inicialização segura ao index.html..."
  sed -i '/<script src="js\/script.js"><\/script>/a \    <script src="js/init.js"></script>' index.html
fi

# 4. Modificar enhanced.css para evitar quebrar as imagens
cat > styles/enhanced.css << 'EOL'
/* Enhanced CSS for Leo Oli Photography Portfolio - Versão corrigida */

/* =========== ENHANCED ANIMATIONS =========== */
/* Animações que não interferem com o carregamento original */
.animate-on-scroll {
  opacity: 1; /* Modificado para não esconder elementos */
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.animated {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  0% { opacity: 0.9; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Logo animations */
#logo.hover {
  transform: scale(1.05);
}

/* Não definimos lazy-loading para não interferir com o carregamento existente */
/* Melhorias visuais que não interferem com o funcionamento */

/* Scroll indicator styles */
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

/* Mobile instruction improvements */
.mobile-instructions {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.mobile-instructions.animated {
  animation: slideUp 0.5s ease forwards;
}

@keyframes slideUp {
  0% { opacity: 0.8; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Enhanced hover effects */
.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.theme-toggle:hover {
  transform: rotate(30deg);
  background-color: rgba(40, 40, 40, 0.9);
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

echo "Correção aplicada! Agora as imagens devem carregar normalmente."
echo "Atualize a página e verifique se as imagens estão aparecendo corretamente."
echo "Se desejar, faça o deploy com 'firebase deploy' para aplicar as mudanças no servidor."