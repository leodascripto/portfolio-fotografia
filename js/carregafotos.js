$(document).ready(function () {
    var itemSelector = ".grid-item";
    var $container = $("#container");

    // Carregar o JSON e adicionar as imagens ao container
    $.getJSON('json/photos.json', function (data) {
        $.each(data, function (index, item) {
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

        // Inicializa o Isotope
        $container.isotope({
            itemSelector: itemSelector,
            layoutMode: 'masonry',
            masonry: {
                columnWidth: itemSelector,
                isFitWidth: true,
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
    });

    // Filtro de categorias + correção do "active"
    $(".filters li a").click(function () {
        var filterValue = $(this).attr("data-filter");
        $container.isotope({ filter: filterValue });

        // Remove "active" de todos e adiciona apenas ao item clicado
        $(".filters li").removeClass("active");
        $(this).parent().addClass("active");
    });
});
