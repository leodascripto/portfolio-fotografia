/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    domains: ['i.ibb.co']
  },
  // Remover assetPrefix problemático
  // assetPrefix: './',
  basePath: '',
  distDir: 'dist',
  
  // Configurações para static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig