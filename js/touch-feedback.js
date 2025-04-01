// Adicionar em um novo arquivo js/touch-feedback.js

$(document).ready(function() {
    // Verificar se é um dispositivo de toque
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    
    if (isTouchDevice) {
        // Adicionar feedback visual para toques na interface
        document.addEventListener('touchstart', function(e) {
            // Verificar se o toque foi em um elemento interativo
            const target = e.target;
            const interactiveElements = ['A', 'BUTTON', 'LI', '.grid-item', '[role="button"]', '[tabindex="0"]'];
            
            let isInteractive = false;
            for (let selector of interactiveElements) {
                if (target.matches(selector) || target.closest(selector)) {
                    isInteractive = true;
                    break;
                }
            }
            
            if (isInteractive) {
                // Criar elemento de feedback
                const feedback = document.createElement('div');
                feedback.className = 'touch-feedback';
                document.body.appendChild(feedback);
                
                // Posicionar o feedback no local do toque
                const touch = e.touches[0];
                feedback.style.left = touch.clientX + 'px';
                feedback.style.top = touch.clientY + 'px';
                
                // Remover após a animação
                setTimeout(() => {
                    feedback.remove();
                }, 600);
            }
        }, false);
        
        // Melhorar a interação com os filtros em dispositivos móveis
        enhanceMobileFilters();
        
        // Adicionar indicações de navegação na galeria
        enhanceGalleryNavigation();
    }
    
    // Função para melhorar a interação com os filtros em dispositivos móveis
    function enhanceMobileFilters() {
        const filtersContainer = document.querySelector('.filters ul');
        
        if (!filtersContainer) return;
        
        // Adicionar indicação visual de rolagem horizontal se necessário
        function checkForScrollbar() {
            if (filtersContainer.scrollWidth > filtersContainer.clientWidth) {
                document.querySelector('.filters').classList.add('has-scroll');
            } else {
                document.querySelector('.filters').classList.remove('has-scroll');
            }
        }
        
        // Verificar ao carregar e ao redimensionar
        checkForScrollbar();
        window.addEventListener('resize', checkForScrollbar);
        
        // Adicionar haptic feedback nos filtros (quando disponível)
        const filterItems = document.querySelectorAll('.filters li a');
        filterItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                if ('vibrate' in navigator) {
                    navigator.vibrate(20); // Vibração sutil de 20ms
                }
            });
        });
    }
    
    // Função para adicionar indicações visuais na navegação da galeria
    function enhanceGalleryNavigation() {
        // Monitorar quando a galeria Magnific Popup é aberta
        $(document).on('mfpOpen', function() {
            const gallery = document.querySelector('.mfp-container');
            
            if (!gallery) return;
            
            // Adicionar instruções na primeira vez que a galeria for aberta
            if (!localStorage.getItem('galleryInstructionsShown')) {
                const instructions = document.createElement('div');
                instructions.className = 'gallery-instructions';
                instructions.innerHTML = '<p>Deslize para navegar entre as fotos</p>';
                gallery.appendChild(instructions);
                
                // Ocultar após alguns segundos
                setTimeout(() => {
                    instructions.style.opacity = '0';
                    setTimeout(() => {
                        instructions.remove();
                    }, 500);
                }, 3000);
                
                // Marcar como exibido para não mostrar novamente
                localStorage.setItem('galleryInstructionsShown', 'true');
            }
            
            // Adicionar indicadores de navegação
            const leftIndicator = document.createElement('div');
            leftIndicator.className = 'swipe-indicator left';
            leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
            gallery.appendChild(leftIndicator);
            
            const rightIndicator = document.createElement('div');
            rightIndicator.className = 'swipe-indicator right';
            rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
            gallery.appendChild(rightIndicator);
            
            // Mostrar indicadores de navegação durante o swipe
            let touchStartX = 0;
            
            gallery.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
            });
            
            gallery.addEventListener('touchmove', function(e) {
                const currentX = e.touches[0].clientX;
                const diff = currentX - touchStartX;
                
                // Mostrar indicador baseado na direção do swipe
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
            });
            
            gallery.addEventListener('touchend', function() {
                leftIndicator.classList.remove('active');
                rightIndicator.classList.remove('active');
            });
        });
    }
});