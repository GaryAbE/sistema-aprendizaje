import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Agregado para mayor precisión en dev
      },
      // Si despliegas en Vercel, añade aquí tu dominio de producción
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },

  // Configuración experimental y de servidor
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Esto ayuda a resolver el warning de NFT en el build
    outputFileTracingIncludes: {
      '/api/upload': ['./public/uploads/**/*'],
    },
  },

  // Opcional: Si quieres ignorar el warning de compilación específico de NFT 
  // que viste en los logs para que no detenga el flujo:
  typescript: {
    ignoreBuildErrors: false, // Mantén esto en false para corregir el error de Prisma
  },
};

export default nextConfig;
