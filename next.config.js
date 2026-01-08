/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out', // MUDANÇA: usar 'out' em vez de 'dist'
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
  
  // IMPORTANTE: Garantir que gere index.html no root
  generateBuildId: async () => {
    return 'build'
  },
}

module.exports = nextConfig