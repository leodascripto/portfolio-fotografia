// Modificação no arquivo js/carregafotos.js
function setupImageViewer() {
    // Inicializar Magnific Popup com configurações corrigidas
    $('.popupimg').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        },
        image: {
            titleSrc: function(item) {
                return item.el.closest('.grid-item').find('.overlay').text();
            }
        },
        callbacks: {
            elementParse: function(item) {
                console.log("Imagem sendo aberta:", item.src);
            }
        }
    });
    
    // Para dispositivos móveis, separar comportamento de toque para scroll e clique
    if (isMobile) {
        // Remover tratamento padrão dos cliques para implementar nossa própria solução
        $('.grid-item a').off('click');
        
        // Variáveis para controlar o estado do toque
        let touchStartTime, touchEndTime;
        let touchStartX, touchStartY;
        let touchEndX, touchEndY;
        let isScrolling = false;
        
        // Adicionar handlers para cada item da grade
        $('.grid-item').each(function() {
            const $item = $(this);
            const $link = $item.find('a.popupimg');
            
            // Quando o toque começa
            $item.on('touchstart', function(e) {
                touchStartTime = new Date().getTime();
                touchStartX = e.originalEvent.touches[0].pageX;
                touchStartY = e.originalEvent.touches[0].pageY;
                isScrolling = false;
                
                // Não bloquear o evento para permitir que o scroll funcione
                e.stopPropagation();
            });
            
            // Durante o movimento do toque
            $item.on('touchmove', function(e) {
                // Se o movimento vertical for maior que o horizontal, é um scroll
                const touchMoveY = e.originalEvent.touches[0].pageY;
                const touchMoveX = e.originalEvent.touches[0].pageX;
                const deltaY = Math.abs(touchMoveY - touchStartY);
                const deltaX = Math.abs(touchMoveX - touchStartX);
                
                if (deltaY > deltaX && deltaY > 10) {
                    isScrolling = true;
                    // Permite que o scroll padrão funcione
                }
            });
            
            // Quando o toque termina
            $item.on('touchend', function(e) {
                touchEndTime = new Date().getTime();
                touchEndX = e.changedTouches[0].pageX;
                touchEndY = e.changedTouches[0].pageY;
                
                // Calcular duração e distância do toque
                const touchDuration = touchEndTime - touchStartTime;
                const touchDistance = Math.sqrt(
                    Math.pow(touchEndX - touchStartX, 2) + 
                    Math.pow(touchEndY - touchStartY, 2)
                );
                
                // Se foi um toque rápido (menos de 200ms) e com pouco movimento (menos de 10px),
                // e não foi identificado como scrolling, então é um clique
                if (touchDuration < 200 && touchDistance < 10 && !isScrolling) {
                    e.preventDefault();
                    
                    // Abrir o popup com a imagem correta
                    $link.magnificPopup('open');
                }
            });
        });
    }
}