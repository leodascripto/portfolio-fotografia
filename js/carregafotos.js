$(document).ready(function () {
    var itemSelector = ".grid-item";
    var $container = $("#gallery-container");
    var $loadingIndicator = $(".loading-indicator");

    var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    if ($loadingIndicator.length > 0) {
        $loadingIndicator.show();
    } else {
        $('body').append('<div class="loading-indicator"></div>');
        $loadingIndicator = $(".loading-indicator");
        $loadingIndicator.show();
    }

    function verificarImagem(src) {
        if (src.includes('http://') || src.includes('https://')) {
            return src;
        }
        if (src.startsWith('assets/')) {
            return src;
        }
        return src;
    }

    $.getJSON('json/photos.json')
        .done(function (data) {
            console.log(`Carregando ${data.length} imagens do JSON`);

            $.each(data, function (index, item) {
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

            $container.imagesLoaded(function() {
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

                setupImageViewer();
                $loadingIndicator.hide();
                setTimeout(function() {
                    $container.isotope('layout');
                }, 100);

                // Adiciona o event listener para os filtros
                $('.filters-list button').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const $button = $(this);
                    const filterValue = $button.data('filter');

                    // Atualiza o estado ativo
                    $('.filters-list li').removeClass('active');
                    $('.filters-list button').attr('aria-pressed', 'false');
                    $button.parent().addClass('active');
                    $button.attr('aria-pressed', 'true');

                    // Aplica o filtro na galeria
                    $container.isotope({ filter: filterValue });
                });
            });
        })
        .fail(function(jqxhr, textStatus, error) {
            console.error("Erro ao carregar o JSON:", textStatus, error);
            $loadingIndicator.hide();
            $container.html('<div class="error-message">Não foi possível carregar as imagens. Por favor, tente novamente mais tarde.</div>');
            carregarImagensFallback();
        });

    function setupImageViewer() {
        $('.popupimg').off('click');
        $('.grid-item').each(function(index) {
            var $item = $(this);
            var $link = $item.find('a.popupimg');
            $link.attr('data-index', index);
            $link.on('click', function(e) {
                e.preventDefault();
                var visibleLinks = $('.grid-item:not(.isotope-hidden) .popupimg');
                var items = [];
                visibleLinks.each(function() {
                    var href = $(this).attr('href');
                    var title = $(this).closest('.grid-item').find('.overlay').text();
                    items.push({ src: href, title: title });
                });
                var currentIndex = visibleLinks.index($(this));
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
        if (isMobile) {
            $('.grid-item a').off('click');
            $('.grid-item').each(function() {
                var $item = $(this);
            });
        }
    }

    function carregarImagensFallback() {
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

        setTimeout(function() {
            $container.imagesLoaded(function() {
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
                $loadingIndicator.hide();
            });
        }, 100);
    }
});