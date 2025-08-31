/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['i.ibb.co']
  },
  assetPrefix: './',
  basePath: '',
  distDir: 'dist'
}

module.exports = nextConfig