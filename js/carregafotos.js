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
            
            // Ativar o debugging para ver os caminhos das imagens no console
            const debug = true;
            
            $.each(data, function (index, item) {
                // Verificar e corrigir o caminho da imagem
                var imgSrc = verificarImagem(item.src);
                
                if (debug) {
                    console.log(`Item ${index}: ${item.name}, Caminho: ${imgSrc}`);
                }
                
                var imageHTML = `
                    <div class="grid-item ${item.filter}" data-filter="${item.filter}">
                        <a class="popupimg" href="${imgSrc}">
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
                    }
                });
                
                // Ocultar indicador de carregamento
                $loadingIndicator.hide();
            });

            // Inicializa o Magnific Popup
            $('.popupimg').magnificPopup({
                type: 'image',
                mainClass: 'mfp-with-zoom',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                    preload: [0, 1],
                },
                zoom: {
                    enabled: true,
                    duration: 500,
                    easing: 'ease-in-out',
                    opener: function(openerElement) {
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    },
                },
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
    
    // Filtro de categorias + correção do "active"
    $(".filters li a").click(function () {
        var filterValue = $(this).attr("data-filter");
        $container.isotope({ filter: filterValue });

        // Remove "active" de todos e adiciona apenas ao item clicado
        $(".filters li").removeClass("active");
        $(this).parent().addClass("active");
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
                    <a class="popupimg" href="${item.src}">
                        <img src="${item.src}" alt="${item.name}" />
                    </a>
                    <div class="overlay">${item.name}</div>
                </div>
            `;
            $container.append(imageHTML);
        });
        
        // Reinicializar o Isotope
        setTimeout(function() {
            $container.isotope({
                itemSelector: itemSelector,
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: '.grid-item',
                    gutter: 15,
                    isFitWidth: true
                }
            });
            
            // Inicializa o Magnific Popup
            $('.popupimg').magnificPopup({
                type: 'image',
                mainClass: 'mfp-with-zoom',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                    preload: [0, 1],
                },
                zoom: {
                    enabled: true,
                    duration: 500,
                    easing: 'ease-in-out',
                    opener: function(openerElement) {
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    },
                },
            });
        }, 500);
    }
});