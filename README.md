# Leo Oli - Portfolio Fotográfico

## 🚀 Versão Next.js + TypeScript

Este projeto foi migrado de HTML/JavaScript puro para **Next.js com TypeScript**, mantendo todas as funcionalidades originais com melhorias de performance e desenvolvedor experience.

## ✨ Funcionalidades

- **Galeria Responsiva:** Layout em grid adaptativo com animações suaves
- **Filtros por Categoria:** Sistema de filtros dinâmicos baseado no JSON
- **Visualização Modal:** Modal de imagens com navegação por teclado/touch/swipe
- **Animações Fluidas:** Transições e animações com Framer Motion
- **Otimizado para Mobile:** Touch gestures, swipe navigation e instruções
- **Performance:** Images otimizadas com Next.js Image component
- **WhatsApp Integration:** Botão flutuante para contato direto
- **Scroll to Top:** Botão de volta ao topo com animação

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Framer Motion** - Animações (substitui Isotope.js)
- **CSS Grid** - Layout responsivo
- **Next.js Image** - Otimização de imagens
- **Firebase Hosting** - Deploy

## 🏗️ Estrutura do Projeto

```
portfolio-nextjs/
├── public/
│   ├── assets/img/          # Imagens (logo, favicon)
│   └── json/photos.json     # Dados das fotos
├── src/
│   ├── components/
│   │   ├── Gallery/         # Galeria e modal
│   │   ├── Filters/         # Sistema de filtros
│   │   ├── Header/          # Cabeçalho
│   │   ├── Footer/          # Rodapé
│   │   ├── Layout/          # Layout principal
│   │   └── Loading/         # Componente de loading
│   ├── hooks/
│   │   └── usePhotos.ts     # Hook para carregar fotos
│   ├── pages/
│   │   ├── _app.tsx         # App component
│   │   └── index.tsx        # Página principal
│   ├── styles/
│   │   └── globals.css      # Estilos globais
│   └── types/
│       └── index.ts         # Definições TypeScript
├── next.config.js           # Configuração Next.js
├── tsconfig.json           # Configuração TypeScript
└── firebase.json           # Configuração Firebase
```

## 🚀 Instalação e Desenvolvimento

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### 3. Build para produção
```bash
npm run build
```

### 4. Deploy no Firebase
```bash
npm run build
firebase deploy
```

## 📁 Configuração

### Imagens
As imagens devem estar organizadas da seguinte forma:

```
public/
├── assets/img/
│   ├── logo.png          # Logo do portfolio
│   └── favicon.png       # Favicon
└── json/
    └── photos.json       # Dados das fotos
```

### JSON das Fotos
O arquivo `public/json/photos.json` deve seguir este formato:

```json
[
  {
    "name": "Nome da Foto",
    "src": "https://exemplo.com/imagem.jpg",
    "filter": "categoria"
  }
]
```

### Personalização
- **Filtros**: Gerados automaticamente baseados nas categorias do JSON
- **Cores**: Definidas nas variáveis CSS em `globals.css`
- **Animações**: Configuráveis nos componentes com Framer Motion

## 🔄 Migração do HTML

### O que foi mantido:
- ✅ Todas as funcionalidades originais
- ✅ Design e layout idênticos
- ✅ Responsividade mobile
- ✅ Filtros por categoria
- ✅ Modal de visualização
- ✅ WhatsApp float
- ✅ Scroll to top
- ✅ Animações e transições

### O que foi removido:
- ❌ Tema claro (conforme solicitado)
- ❌ jQuery dependências
- ❌ Isotope.js (substituído por CSS Grid + Framer Motion)
- ❌ Magnific Popup (substituído por modal custom)

### Melhorias adicionadas:
- ⚡ Performance superior com Next.js
- 🔒 Type safety com TypeScript
- 📱 Melhor suporte mobile/touch
- 🎨 Animações mais suaves
- 🖼️ Otimização automática de imagens
- ♿ Melhor acessibilidade

## 📱 Funcionalidades Mobile

- **Touch gestures**: Swipe para navegar no modal
- **Instruções visuais**: Hints automáticos na primeira visita
- **Scroll horizontal**: Filtros com indicadores de navegação
- **Performance**: Lazy loading e otimizações específicas

## 🎯 Performance

- **Next.js Image**: Otimização automática de imagens
- **Static Generation**: Build estático para máxima velocidade
- **Code Splitting**: JavaScript dividido automaticamente
- **CSS optimizado**: Apenas estilos necessários carregados

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
npm run export   # Exportar estático
```

## 🌐 Deploy

### Firebase Hosting (Atual)
```bash
npm run build
firebase deploy
```

### Vercel (Alternativa recomendada)
```bash
npm install -g vercel
vercel
```

## 🐛 Troubleshooting

### Imagens não carregam
1. Verifique se as URLs no JSON estão corretas
2. Confirme que as imagens locais estão em `public/assets/`
3. Check se o domínio está configurado no `next.config.js`

### Build falha
1. Execute `npm run lint` para verificar erros
2. Confirme que todas as tipagens estão corretas
3. Verifique se o `photos.json` está válido

### Firebase deploy
1. Confirme que o build foi executado: `npm run build`
2. Verifique se a pasta `dist` foi criada
3. Execute `firebase login` se necessário

## 📞 Contato

- **Instagram**: [@leooli321](https://www.instagram.com/leooli321/)
- **WhatsApp**: Através do botão flutuante no site

---

Desenvolvido com ❤️ por Leo Oli  
Migrado para Next.js + TypeScript