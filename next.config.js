/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Optimisation pour Vercel
  poweredByHeader: false,
  // Optimisation des images
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
};
