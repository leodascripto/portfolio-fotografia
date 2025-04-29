$(document).ready(function () {
    var itemSelector = ".grid-item";
    var $container = $("#container");
    var $loadingIndicator = $(".loading-indicator");
    
    // Verificar se é um dispositivo móvel
    var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    // Exibir indicador de carregamento
    if ($loadingIndicator.length > 0) {
        $loadingIndicator.show();
    } else {
        // Criar o indicador se não existir
        $('body').append('<div class="loading-indicator"></div>');
        $loadingIndicator = $(".loading-indicator");
        $loadingIndicator.show();
    }
    
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
        // CORREÇÃO: remover inicialização de galeria global para evitar problemas
        // Desvincula quaisquer handlers anteriores para evitar conflitos
        $('.popupimg').off('click');
        
        // Inicializa cada item individualmente para garantir que a foto correta seja aberta
        $('.grid-item').each(function(index) {
            var $item = $(this);
            var $link = $item.find('a.popupimg');
            
            // Atribuir um índice de dados para rastreamento
            $link.attr('data-index', index);
            
            // Configurar cada link individualmente
            $link.on('click', function(e) {
                e.preventDefault();
                
                // Coletar todos os itens visíveis (não filtrados)
                var visibleLinks = $('.grid-item:not(.isotope-hidden) .popupimg');
                var items = [];
                
                // Construir a matriz de itens para a galeria
                visibleLinks.each(function() {
                    var href = $(this).attr('href');
                    var title = $(this).closest('.grid-item').find('.overlay').text();
                    items.push({
                        src: href,
                        title: title
                    });
                });
                
                // Encontrar o índice do item atual entre os itens visíveis
                var currentIndex = visibleLinks.index($(this));
                
                // Abrir o Magnific Popup com o item correto
                $.magnificPopup.open({
                    items: items,
                    type: 'image',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0, 1]
                    },
                    callbacks: {
                        open: function() {
                            console.log("Abrindo imagem no índice:", currentIndex);
                        }
                    }
                }, currentIndex);
            });
        });
        
        // Para dispositivos móveis, separar comportamento de toque para scroll e clique
        if (isMobile) {
            // Primeiro, remover o manipulador de clique padrão para não interferir
            $('.grid-item a').off('click');
            
            // Adicionar controladores de eventos de toque personalizados
            $('.grid-item').each(function() {
                var $item = $(this);
                var $link = $item.find('a.popupimg');
                var startX, startY;
                var isScrolling = false;
                
                // Ao iniciar o toque
                $item.on('touchstart', function(e) {
                    startX = e.originalEvent.touches[0].pageX;
                    startY = e.originalEvent.touches[0].pageY;
                    isScrolling = false;
                });
                
                // Durante o movimento do toque
                $item.on('touchmove', function(e) {
                    // Se o movimento vertical for maior que o horizontal, é um scroll
                    const touchMoveY = e.originalEvent.touches[0].pageY;
                    const touchMoveX = e.originalEvent.touches[0].pageX;
                    const deltaY = Math.abs(touchMoveY - startY);
                    const deltaX = Math.abs(touchMoveX - startX);
                    
                    if (deltaY > deltaX && deltaY > 10) {
                        isScrolling = true;
                        // Permite que o scroll padrão funcione
                    }
                });
                
                // Quando o toque termina
                $item.on('touchend', function(e) {
                    const endX = e.changedTouches[0].pageX;
                    const endY = e.changedTouches[0].pageY;
                    
                    // Calcular distância do toque
                    const diffX = Math.abs(endX - startX);
                    const diffY = Math.abs(endY - startY);
                    
                    // Se foi um toque rápido com pouco movimento e não identificado como scrolling
                    if (diffX < 10 && diffY < 10 && !isScrolling) {
                        e.preventDefault();
                        // Disparar o clique manualmente para abrir a galeria
                        $link.trigger('click');
                    }
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
        
        // Reinicializar o visualizador de imagens após filtrar
        // Isso é importante para garantir que os índices sejam atualizados
        setTimeout(function() {
            setupImageViewer();
        }, 300);
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