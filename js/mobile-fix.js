/**
 * Mobile Fix para Portfolio
 * Corrige problemas de filtro e galeria em dispositivos móveis
 */

$(document).ready(function() {
    console.log("Aplicando correções para dispositivos móveis...");
    
    // Detectar se é um dispositivo móvel
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile) {
        console.log("Dispositivo móvel detectado, aplicando correções...");
        
        // CORREÇÃO 1: Resolver problema da abertura da galeria
        fixGalleryOnMobile();
        
        // CORREÇÃO 2: Resolver problema dos filtros
        fixFiltersOnMobile();
    }
    
    /**
     * Corrige problema da galeria em dispositivos móveis
     */
    function fixGalleryOnMobile() {
        // Remover eventos anteriores que possam estar causando conflito
        $('.popupimg').off('click');
        $('.grid-item a').off('click');
        $('.grid-item').off('touchstart touchmove touchend');
        
        // Inicializar a galeria Magnific Popup diretamente
        $('.popupimg').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1],
                tPrev: 'Anterior',
                tNext: 'Próxima',
                tCounter: '%curr% de %total%'
            },
            callbacks: {
                open: function() {
                    // Adicionar atributos ARIA para acessibilidade
                    $('.mfp-container').attr('role', 'dialog');
                    $('.mfp-content').attr('aria-live', 'polite');
                    
                    // Adicionar indicações visuais para arrastar
                    addSwipeIndicators();
                },
                close: function() {
                    // Remover indicações visuais
                    removeSwipeIndicators();
                }
            }
        });
        
        // Garantir que links corretos sejam coletados ao clicar
        $('.grid-item').on('click', function(e) {
            // Prevenir comportamento padrão apenas se o clique for no item e não em algum outro elemento
            if (e.target === this || $(e.target).closest('.grid-item').length > 0) {
                e.preventDefault();
                // Acionar o link do popup diretamente
                $(this).find('.popupimg').trigger('click');
            }
        });
    }
    
    /**
     * Corrige problema dos filtros em dispositivos móveis
     */
    function fixFiltersOnMobile() {
        // Remover eventos anteriores e recriá-los corretamente
        $('.filters li a').off('click');
        
        // Re-aplicar o evento de filtro
        $('.filters li a').on('click', function(e) {
            e.preventDefault();
            
            // Obter valor do filtro
            var filterValue = $(this).attr("data-filter");
            console.log("Filtro selecionado:", filterValue);
            
            // Aplicar filtro ao container
            var $container = $('#container');
            if ($container.data('isotope')) {
                $container.isotope({ filter: filterValue });
                
                // Atualizar classes ativas
                $('.filters li').removeClass('active');
                $(this).parent().addClass('active');
                
                // Atualizar ARIA
                $('.filters li a').attr('aria-current', 'false');
                $(this).attr('aria-current', 'true');
                
                // Forçar relayout
                setTimeout(function() {
                    $container.isotope('layout');
                    // Reinicializar visualizador após um pequeno delay
                    setTimeout(fixGalleryOnMobile, 300);
                }, 100);
                
                console.log("Filtro aplicado:", filterValue);
            } else {
                console.warn("Isotope não inicializado!");
            }
        });
        
        // Garantir que os toques funcionem corretamente
        $('.filters li a').on('touchend', function(e) {
            e.preventDefault();
            $(this).trigger('click');
        });
    }
    
    /**
     * Adiciona indicadores de swipe para galeria móvel
     */
    function addSwipeIndicators() {
        const container = document.querySelector('.mfp-container');
        if (!container) return;
        
        // Criar indicadores de swipe
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
        instructions.className = 'gallery-instructions';
        instructions.innerHTML = '<p>Deslize para navegar entre as fotos</p>';
        container.appendChild(instructions);
        
        // Ocultar instruções após alguns segundos
        setTimeout(() => {
            instructions.style.opacity = '0';
            setTimeout(() => {
                instructions.remove();
            }, 500);
        }, 3000);
        
        // Configurar navegação por swipe
        let touchStartX = 0;
        
        container.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchmove', function(e) {
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
        }, { passive: true });
        
        container.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - touchStartX;
            
            // Se swipe for significativo, navegar
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe para direita - imagem anterior
                    $.magnificPopup.instance.prev();
                } else {
                    // Swipe para esquerda - próxima imagem
                    $.magnificPopup.instance.next();
                }
            }
            
            // Resetar indicadores
            leftIndicator.classList.remove('active');
            rightIndicator.classList.remove('active');
        }, { passive: true });
    }
    
    /**
     * Remove indicadores de swipe
     */
    function removeSwipeIndicators() {
        document.querySelectorAll('.swipe-indicator, .gallery-instructions').forEach(el => {
            el.remove();
        });
    }
    
    // Adicionar estilos necessários para os indicadores
    function addSwipeStyles() {
        const styles = `
            .swipe-indicator {
                position: absolute;
                top: 50%;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translateY(-50%);
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                z-index: 100;
            }
            
            .swipe-indicator i {
                color: white;
                font-size: 18px;
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
            
            .gallery-instructions {
                position: absolute;
                bottom: 20%;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                text-align: center;
                z-index: 100;
                transition: opacity 0.5s ease;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
    
    // Adicionar estilos
    addSwipeStyles();
});
