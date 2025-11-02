/** @type {import('next').NextConfig} */
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig = {
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
  // Add Webpack configuration for the Prisma Plugin
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
