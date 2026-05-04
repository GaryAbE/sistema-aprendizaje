import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Permite imágenes locales (uploads)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Tamaño máximo del cuerpo para uploads (10 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
