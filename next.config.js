/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // IMPORTANTE: Não usar trailingSlash com Firebase
  trailingSlash: false,
  
  images: {
    unoptimized: true,
    domains: ['i.ibb.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  
  distDir: 'dist',
  
  // Garantir que assets sejam servidos corretamente
  assetPrefix: '',
  basePath: '',
}

module.exports = nextConfig