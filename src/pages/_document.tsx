import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
        />
        {/* Meta tags básicas */}
        <meta name="description" content="Portfolio fotográfico de Leo Oli - Fotógrafo profissional especializado em retratos e ensaios fotográficos." />
        <meta name="theme-color" content="#212121" />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}