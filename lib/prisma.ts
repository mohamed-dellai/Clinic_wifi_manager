import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Configuration optimisée pour Neon DB
const prisma = global.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Augmenter les timeouts pour les connexions à distance
  log: ['error', 'warn'],
  // Paramètres de connexion optimisés pour Neon DB
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
