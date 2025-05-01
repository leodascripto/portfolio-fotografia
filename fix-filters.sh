#!/bin/bash

# Script de correção para restaurar a funcionalidade dos filtros
echo "Iniciando correção para restaurar os botões de filtro..."

# 1. Verificar se há conflitos nos scripts
if grep -q "js/init.js" index.html; then
  echo "Removendo script init.js que pode estar causando conflito..."
  sed -i '/js\/init.js/d' index.html
fi

# 2. Criar um script de compatibilidade que preserva os filtros
cat > js/compatibility.js << 'EOL'
/**
 * Script de compatibilidade para portfolio
 * Este script mantém a funcionalidade original dos filtros
 * enquanto adiciona melhorias visuais
 */

$(document).ready(function() {
  console.log("Aplicando melhorias visuais sem alterar funcionalidade...");
  
  // Esperar carregamento completo antes de aplicar melhorias
  $(window).on('load', function() {
    // 1. Adicionar animações sutis
    setTimeout(function() {
      // Adicionar classes para animações sem interferir na visibilidade
      $('.grid-item').addClass('animation-ready');
      $('#logo').addClass('animation-ready');
      
      // Animar elementos visíveis
      $('.animation-ready').addClass('animated');
      
      // Melhorar experiência de toque em mobile
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        enhanceTouchExperience();
      }
      
      // Re-layout do Isotope para garantir alinhamento correto
      if ($('#container').data('isotope')) {
        $('#container').isotope('layout');
      }
    }, 500);
  });
  
  // Não interferir com o clique dos filtros existentes
  // Apenas adicionar feedback visual melhorado
  $('.filters li a').on('mouseenter', function() {
    $(this).parent().addClass('hover-enhanced');
  }).on('mouseleave', function() {
    $(this).parent().removeClass('hover-enhanced');
  });
  
  // Adicionar feedback de toque para mobile
  function enhanceTouchExperience() {
    $('.grid-item, .filters li a, [role="button"]').addClass('touch-optimized');
    
    // Melhorar instruções móveis
    $('.mobile-instructions').addClass('animated');
    
    // Verificar se o container de filtros precisa de indicadores de scroll
    const filtersContainer = $('.filters ul')[0];
    if (filtersContainer && filtersContainer.scrollWidth > filtersContainer.clientWidth) {
      // Adicionar indicadores de scroll apenas se necessário
      addScrollIndicators();
    }
  }
  
  // Adicionar indicadores de scroll aos filtros
  function addScrollIndicators() {
    const $filters = $('.filters');
    
    // Evitar duplicação
    if ($filters.hasClass('scrollable')) return;
    
    $filters.addClass('scrollable');
    const $filtersList = $filters.find('ul');
    
    // Adicionar indicadores visuais
    $('<div class="scroll-indicator left"><i class="fa fa-chevron-left"></i></div>').appendTo($filters);
    $('<div class="scroll-indicator right"><i class="fa fa-chevron-right"></i></div>').appendTo($filters);
    
    const $leftIndicator = $filters.find('.scroll-indicator.left');
    const $rightIndicator = $filters.find('.scroll-indicator.right');
    
    // Iniciar com o indicador direito visível
    $rightIndicator.addClass('visible');
    
    // Atualizar indicadores ao rolar
    $filtersList.on('scroll', function() {
      const isScrolledLeft = $(this).scrollLeft() > 20;
      const isScrolledRight = $(this).scrollLeft() < (this[0].scrollWidth - this[0].clientWidth - 20);
      
      $leftIndicator.toggleClass('visible', isScrolledLeft);
      $rightIndicator.toggleClass('visible', isScrolledRight);
    });
    
    // Adicionar funcionalidade aos indicadores
    $leftIndicator.on('click', function() {
      $filtersList.animate({ scrollLeft: '-=100' }, 300);
    });
    
    $rightIndicator.on('click', function() {
      $filtersList.animate({ scrollLeft: '+=100' }, 300);
    });
  }
});
EOL

# 3. Criar estilos compatíveis que não interferem na funcionalidade
cat > styles/enhanced.css << 'EOL'
/* Enhanced CSS - Versão compatível que preserva a funcionalidade dos filtros */

/* Animações sutis que não quebram a funcionalidade */
.animation-ready {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.animation-ready.animated {
  animation: subtle-fade 0.5s ease forwards;
}

@keyframes subtle-fade {
  0% { opacity: 0.95; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Melhorias visuais para hover */
.grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.filters li.hover-enhanced {
  background: rgba(227, 202, 102, 0.15);
  transform: translateY(-2px);
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

/* Melhorias para dispositivos móveis */
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.mobile-instructions.animated {
  animation: slide-up 0.5s ease forwards;
}

@keyframes slide-up {
  0% { opacity: 0.8; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Melhorias para o WhatsApp */
.float:hover {
  transform: scale(1.1) rotate(5deg);
}

.float:active {
  transform: scale(0.95);
}

/* Tema toggle */
.theme-toggle {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(15deg);
}

/* Scroll to top */
.scroll-to-top:hover {
  transform: translateY(-3px);
}
EOL

# 4. Adicionar o script de compatibilidade ao index.html
if ! grep -q "js/compatibility.js" index.html; then
  echo "Adicionando script de compatibilidade ao index.html..."
  sed -i '/<script src="js\/script.js"><\/script>/a \    <script src="js/compatibility.js"></script>' index.html
fi

echo "Correção aplicada! Os botões de filtro devem estar funcionando novamente."
echo "Atualize a página e verifique se tanto as imagens quanto os filtros estão funcionando corretamente."
echo "Execute 'firebase deploy' para aplicar as mudanças no servidor após confirmar que tudo está funcionando."