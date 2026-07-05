import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: { serverComponentsExternalPackages: ['@prisma/client'] },
  images: { domains: ['avatars.githubusercontent.com'] },
  headers: async () => [
    { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
  ],
}
export default nextConfig
