$(document).ready(function () {
    var itemSelector = ".grid-item";
    var $container = $("#container");
    var $loadingIndicator = $(".loading-indicator");
    
    // Exibir indicador de carregamento
    if ($loadingIndicator.length > 0) {
        $loadingIndicator.show();
    } else {
        // Criar o indicador se não existir
        $('body').append('<div class="loading-indicator"></div>');
        $loadingIndicator = $(".loading-indicator");
        $loadingIndicator.show();
    }
    
    // Verificar se é um dispositivo móvel
    var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    // Verificar e corrigir caminhos de imagens
    function verificarImagem(src) {
        // Se a imagem for de URL externa (como i.ibb.co), retornar o src como está
        if (src.includes('http://') || src.includes('https://')) {
            return src;
        }
        
        // Se começar com assets/ mas a imagem não existir, tentar corrigir o caminho
        if (src.startsWith('assets/')) {
            return src;
        }
        
        // Caso contrário, adicionar o prefixo assets/ se não estiver presente
        return src;
    }
    
    // Carregar o JSON e adicionar as imagens ao container
    $.getJSON('json/photos.json')
        .done(function (data) {
            // Adicionar uma mensagem de debug para verificar quantos itens foram carregados
            console.log(`Carregando ${data.length} imagens do JSON`);
            
            $.each(data, function (index, item) {
                // Verificar e corrigir o caminho da imagem
                var imgSrc = verificarImagem(item.src);
                
                var imageHTML = `
                    <div class="grid-item ${item.filter}" data-filter="${item.filter}">
                        <a class="popupimg" href="${imgSrc}" aria-label="Ver foto de ${item.name} em tamanho ampliado">
                            <img src="${imgSrc}" alt="${item.name}" />
                        </a>
                        <div class="overlay">${item.name}</div>
                    </div>
                `;
                $container.append(imageHTML);
            });

            // Inicializa o Isotope após adicionar todas as imagens
            $container.imagesLoaded(function() {
                // Inicializa o Isotope
                $container.isotope({
                    itemSelector: itemSelector,
                    layoutMode: 'masonry',
                    masonry: {
                        columnWidth: '.grid-item',
                        gutter: 15,
                        isFitWidth: true
                    },
                    percentPosition: true
                });
                
                // Configurar a abertura de imagens em dispositivos móveis e desktop
                setupImageViewer();
                
                // Ocultar indicador de carregamento
                $loadingIndicator.hide();
                
                // Relayout após um curto delay para garantir posicionamento correto
                setTimeout(function() {
                    $container.isotope('layout');
                }, 100);
            });
        })
        .fail(function(jqxhr, textStatus, error) {
            // Em caso de falha ao carregar o JSON
            console.error("Erro ao carregar o JSON:", textStatus, error);
            $loadingIndicator.hide();
            $container.html('<div class="error-message">Não foi possível carregar as imagens. Por favor, tente novamente mais tarde.</div>');
            
            // Tentar carregar imagens alternativas
            carregarImagensFallback();
        });
    
    // Função para configurar a visualização de imagens - VERSÃO CORRIGIDA
    function setupImageViewer() {
        // Inicializar Magnific Popup com configurações padrão
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
                // CORREÇÃO: Garantir que a imagem correta seja aberta
                open: function() {
                    var magnificPopup = $.magnificPopup.instance;
                    // Isso garante que a posição correta na galeria seja usada
                    console.log("Imagem sendo aberta:", magnificPopup.currItem.src);
                }
            }
        });
        
        // Para dispositivos móveis, separar o comportamento de toque para scroll e clique
        if (isMobile) {
            // CORREÇÃO: Melhor detecção de scroll vs. clique para dispositivos móveis
            $('.grid-item').each(function() {
                var $item = $(this);
                var $link = $item.find('a.popupimg');
                
                // Variáveis para detectar movimento
                var startX, startY;
                var moveX, moveY;
                var startTime;
                var isScrolling = false;
                
                // Quando o toque começa
                $item.on('touchstart', function(e) {
                    // Registrar posição inicial e tempo
                    startX = e.originalEvent.touches[0].pageX;
                    startY = e.originalEvent.touches[0].pageY;
                    startTime = new Date().getTime();
                    isScrolling = false;
                    
                    // Não impedir comportamento padrão para permitir scroll
                });
                
                // Durante o movimento do toque
                $item.on('touchmove', function(e) {
                    if (!startX || !startY) return;
                    
                    moveX = e.originalEvent.touches[0].pageX;
                    moveY = e.originalEvent.touches[0].pageY;
                    
                    // Calcular a distância em X e Y
                    var deltaX = Math.abs(moveX - startX);
                    var deltaY = Math.abs(moveY - startY);
                    
                    // Se o movimento for principalmente vertical, considera como scroll
                    if (deltaY > deltaX && deltaY > 10) {
                        isScrolling = true;
                        // NÃO prevenir comportamento padrão para permitir scroll
                    }
                });
                
                // Quando o toque termina
                $item.on('touchend', function(e) {
                    if (!startX || !startY) return;
                    
                    var endX = e.originalEvent.changedTouches[0].pageX;
                    var endY = e.originalEvent.changedTouches[0].pageY;
                    var endTime = new Date().getTime();
                    
                    // Calcular a distância total percorrida
                    var distanceX = Math.abs(endX - startX);
                    var distanceY = Math.abs(endY - startY);
                    var touchDuration = endTime - startTime;
                    
                    // Se foi um toque rápido sem muito movimento, considere como clique
                    if (touchDuration < 300 && distanceX < 10 && distanceY < 10 && !isScrolling) {
                        e.preventDefault();
                        
                        // CORREÇÃO: Abrir o popup com a imagem específica
                        $link.magnificPopup('open');
                    }
                    
                    // Resetar variáveis
                    startX = startY = null;
                });
            });
        }
    }
    
    // Filtro de categorias + correção do "active"
    $(".filters li a").click(function () {
        var filterValue = $(this).attr("data-filter");
        $container.isotope({ filter: filterValue });

        // Remove "active" de todos e adiciona apenas ao item clicado
        $(".filters li").removeClass("active");
        $(this).parent().addClass("active");
        
        // Atualizar propriedades ARIA
        $(".filters li a").attr("aria-current", "false");
        $(this).attr("aria-current", "true");
    });
    
    // Função de fallback para carregar imagens diretamente
    function carregarImagensFallback() {
        console.log("Tentando carregar imagens de fallback...");
        
        // Array com algumas imagens de exemplo para garantir que algo seja exibido
        var imagensFallback = [
            { name: "Débora", src: "https://i.ibb.co/SxSv6cY/c73b09db7e992cf19e904c273fc0da6a.jpg", filter: "debora" },
            { name: "Gustavo", src: "https://i.ibb.co/mqzGrSc/1714166687091-2.jpg", filter: "gustavo" },
            { name: "Fernanda", src: "https://i.ibb.co/TmwLKgd/1717383827414-1.jpg", filter: "fernanda" },
            { name: "Akira", src: "https://i.ibb.co/0DNJf75/ef03e1e1a7d3041c30a4b248196a0228.jpg", filter: "akira" },
            { name: "Leo Oli", src: "https://i.ibb.co/gzsg2HL/c1f322153045747e8c0ae38e817867ef.jpg", filter: "leooli" },
            { name: "Lisa", src: "https://i.ibb.co/s2B7x0K/1715149773368-3.jpg", filter: "lisa" }
        ];
        
        $.each(imagensFallback, function (index, item) {
            var imageHTML = `
                <div class="grid-item ${item.filter}" data-filter="${item.filter}">
                    <a class="popupimg" href="${item.src}" aria-label="Ver foto de ${item.name} em tamanho ampliado">
                        <img src="${item.src}" alt="${item.name}" />
                    </a>
                    <div class="overlay">${item.name}</div>
                </div>
            `;
            $container.append(imageHTML);
        });
        
        // Reinicializar o Isotope
        setTimeout(function() {
            $container.imagesLoaded(function() {
                $container.isotope({
                    itemSelector: itemSelector,
                    layoutMode: 'masonry',
                    masonry: {
                        columnWidth: '.grid-item',
                        gutter: 15,
                        isFitWidth: true
                    }
                });
                
                // Configurar visualização de imagens
                setupImageViewer();
            });
        }, 500);
    }
});