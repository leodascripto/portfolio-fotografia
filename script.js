$(document).ready(function () {
  var itemSelector = ".grid-item";

  var $container = $("#container").isotope({
    itemSelector: itemSelector,
    masonry: {
      columnWidth: itemSelector,
      isFitWidth: true,
    },
  });

  //Ascending order
  var responsiveIsotope = [
    [480, 7],
    [720, 10],
  ];

  var itemsPerPageDefault = 12;
  var itemsPerPage = defineItemsPerPage();
  var currentNumberPages = 1;
  var currentPage = 1;
  var currentFilter = "*";
  var filterAtribute = "data-filter";
  var pageAtribute = "data-page";
  var pagerClass = "isotope-pager";

  function changeFilter(selector) {
    $container.isotope({
      filter: selector,
    });
  }

  function goToPage(n) {
    currentPage = n;

    var selector = itemSelector;
    selector +=
      currentFilter != "*"
        ? "[" + filterAtribute + '="' + currentFilter + '"]'
        : "";
    selector += "[" + pageAtribute + '="' + currentPage + '"]';

    changeFilter(selector);
  }

  function defineItemsPerPage() {
    var pages = itemsPerPageDefault;

    for (var i = 0; i < responsiveIsotope.length; i++) {
      if ($(window).width() <= responsiveIsotope[i][0]) {
        pages = responsiveIsotope[i][1];
        break;
      }
    }

    return pages;
  }

  function setPagination() {
    var SettingsPagesOnItems = (function () {
      var itemsLength = $container.children(itemSelector).length;

      var pages = Math.ceil(itemsLength / itemsPerPage);
      var item = 1;
      var page = 1;
      var selector = itemSelector;
      selector +=
        currentFilter != "*"
          ? "[" + filterAtribute + '="' + currentFilter + '"]'
          : "";

      $container.children(selector).each(function () {
        if (item > itemsPerPage) {
          page++;
          item = 1;
        }
        $(this).attr(pageAtribute, page);
        item++;
      });

      currentNumberPages = page;
    })();

    var CreatePagers = (function () {
      var $isotopePager =
        $("." + pagerClass).length == 0
          ? $('<div class="' + pagerClass + '"></div>')
          : $("." + pagerClass);

      $isotopePager.html("");

      for (var i = 0; i < currentNumberPages; i++) {
        var $pager = $(
          '<a href="javascript:void(0);" class="pager" ' +
            pageAtribute +
            '="' +
            (i + 1) +
            '"></a>'
        );
        $pager.html(i + 1);

        $pager.click(function () {
          var page = $(this).eq(0).attr(pageAtribute);
          goToPage(page);
        });

        $pager.appendTo($isotopePager);
      }

      $container.after($isotopePager);
    })();
  }

  setPagination();
  goToPage(1);

  //Adicionando Event de Click para as categorias
  $(".filters a").click(function () {
    var filter = $(this).attr(filterAtribute);
    currentFilter = filter;

    setPagination();
    goToPage(1);
  });

  //Evento Responsivo
  $(window).resize(function () {
    itemsPerPage = defineItemsPerPage();
    setPagination();
  });
});

$(document).ready(function () {
  // filter items on button click
  $(".filter-button-group").on("click", "li", function () {
    var filterValue = $(this).attr("data-filter");
    $(".grid").isotope({ filter: filterValue });
    $(".filter-button-group li").removeClass("active");
    $(this).addClass("active");
  });
});

$(document).ready(function () {
  // filter items on button click
  $(".isotope-pager").on("click", "a", function () {
    var filterValue = $(this).attr("data-page");

    $(".isotope-pager a").removeClass("active");
    $(this).addClass("active");
  });
});

$(document).ready(function () {
  $(".popupimg").magnificPopup({
    type: "image",
    mainClass: "mfp-with-zoom",
    gallery: {
      enabled: true,
    },

    zoom: {
      enabled: true,

      duration: 300, // duration of the effect, in milliseconds
      easing: "ease-in-out", // CSS transition easing function

      opener: function (openerElement) {
        return openerElement.is("img")
          ? openerElement
          : openerElement.find("img");
      },
    },
  });
});

// Função para carregar as imagens
fetch('imagens.json')
  .then(response => response.json())
  .then(imagens => {
    const container = document.getElementById('container');

    imagens.forEach(imagem => {
      // Criação do elemento grid-item
      const item = document.createElement('div');
      item.classList.add('grid-item');
      item.setAttribute('data-filter', imagem.categoria);

      // Criação do link para a imagem em popup
      const link = document.createElement('a');
      link.classList.add('popupimg');
      link.setAttribute('href', imagem.src);

      // Criação da imagem
      const img = document.createElement('img');
      img.setAttribute('src', imagem.src);

      // Criação da sobreposição (overlay)
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      overlay.innerText = imagem.overlay;

      // Montando a estrutura
      link.appendChild(img);
      item.appendChild(link);
      item.appendChild(overlay);

      // Adicionando ao container
      container.appendChild(item);
    });
  })
  .catch(error => console.error('Erro ao carregar as imagens:', error));
