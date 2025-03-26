
# Leo Oli - Portfolio Fotográfico

Este projeto é um portfolio fotográfico desenvolvido por Leo Oli. O site exibe uma galeria de imagens organizada em categorias e permite que os visitantes visualizem fotos clicando nelas, com suporte para visualização em tela cheia através de uma galeria interativa.

## Funcionalidades

- **Galeria de Imagens:** Exibe fotos de diferentes categorias, com um layout responsivo.
- **Filtros de Categoria:** Permite ao usuário filtrar as imagens por categoria.
- **Visualização em Tela Cheia:** As imagens podem ser abertas em uma visualização em tela cheia usando o plugin `Magnific Popup`.
- **Design Responsivo:** O layout do site é otimizado para diferentes dispositivos, ajustando-se para telas menores.
- **Contato via WhatsApp:** Um ícone flutuante de WhatsApp permite que os visitantes entrem em contato diretamente com Leo Oli.

## Estrutura de Pastas

A estrutura do projeto está organizada da seguinte forma:

```
PORTFOLIO
  └─ src
    ├─ assets
    │   └─ img
    │       ├─ favicon.png
    │       └─ logo.png
    ├─ js
    │   ├─ carregafotos.js
    │   └─ script.js
    ├─ json
    │   └─ photos.json
    ├─ styles
    │   └─ style.css
    └─ index.html
```

- **assets/img**: Contém imagens utilizadas no site, como o logo e favicon.
- **js**: Scripts JavaScript que controlam a lógica do site, incluindo o carregamento das fotos e a integração com o `Magnific Popup`.
- **json**: Contém o arquivo `photos.json` com os dados das imagens a serem exibidas.
- **styles**: Contém o arquivo CSS para o design e estilo do site.
- **index.html**: O arquivo HTML principal do projeto.

## Tecnologias Utilizadas

- **HTML5**: Estrutura do site.
- **CSS3**: Estilo do site, com ênfase na responsividade.
- **JavaScript**: Para interatividade, incluindo o carregamento dinâmico das fotos e manipulação da galeria.
- **jQuery**: Biblioteca para manipulação do DOM.
- **Isotope.js**: Plugin para filtrar as imagens.
- **Magnific Popup**: Plugin para abrir as imagens em uma visualização em tela cheia.
- **FontAwesome**: Para o ícone flutuante do WhatsApp.

## Como Rodar o Projeto?

É só entrar aqui:
https://leooli-portfolio.web.app/

## Personalização

- **Imagens:** Adicione ou remova imagens no arquivo `json/photos.json`. Cada entrada deve ter o formato:

    ```json
    {
      "src": "URL-da-imagem",
      "category": "nome-da-categoria",
      "alt": "descrição-da-imagem"
    }
    ```

- **Filtros:** Os filtros de categoria são definidos automaticamente pelas categorias presentes nas imagens.


---

Desenvolvido com ❤️ por Leo Oli.
