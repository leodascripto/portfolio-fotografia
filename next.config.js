/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    domains: ['i.ibb.co']
  },
  basePath: '',
  distDir: 'dist',
}

module.exports = nextConfig