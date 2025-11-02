const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main(){
  // Supprimer tous les utilisateurs existants pour éviter les conflits d'ID
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['admin@example.com', 'secretary@example.com']
      }
    }
  })

  const adminPassword = bcrypt.hashSync('c', 10)
  const secPassword = bcrypt.hashSync('secretpass', 10)

  await prisma.user.create({
    data: { email: 'admin@example.com', password: adminPassword, role: 'ADMIN' }
  })

  await prisma.user.create({
    data: { email: 'secretary@example.com', password: secPassword, role: 'SECRETARY' }
  })

  console.log('Seeded admin and secretary users: admin@example.com / adminpass, secretary@example.com / secretpass')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
