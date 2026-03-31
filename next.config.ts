import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'diapsa-cms.test',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.grupodiapsa.com.mx',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'diapsa-storage.sfo3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/storage/**',
      },
    ],
    // Desactivar optimización en desarrollo para permitir IPs privadas
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
  },
};

export default nextConfig;
