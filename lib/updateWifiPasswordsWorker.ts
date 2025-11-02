import { PrismaClient } from '@prisma/client'
import { add } from 'date-fns'

const prisma = new PrismaClient()

/**
 * Met à jour le statut isActive des mots de passe Wi-Fi
 * en vérifiant s'ils sont toujours dans leur période de validité
 */
export async function updateWifiPasswordsStatus() {
  console.log('🔄 Mise à jour du statut des mots de passe Wi-Fi...')
  
  try {
    // Récupérer tous les mots de passe actuellement marqués comme actifs
    const activePasswords = await prisma.wifiPassword.findMany({
      where: {
        isActive: true
      }
    })
    
    console.log(`📊 ${activePasswords.length} mots de passe actifs trouvés`)
    
    const now = new Date()
    let deactivatedCount = 0
    
    // Vérifier chaque mot de passe
    for (const password of activePasswords) {
      let isExpired = false
      
      // Si validTo est défini, utiliser cette date directement
      if (password.validTo) {
        isExpired = now > password.validTo
      } 
      // Sinon, calculer la date d'expiration basée sur duration et unit
      else {
        let expirationDate
        
        if (password.unit === 'HOURS') {
          expirationDate = add(password.createdAt, { hours: password.duration })
        } else if (password.unit === 'DAYS') {
          expirationDate = add(password.createdAt, { days: password.duration })
        }
        
        if (expirationDate) {
          isExpired = now > expirationDate
        }
      }
      
      // Si le mot de passe est expiré, le désactiver
      if (isExpired) {
        await prisma.wifiPassword.update({
          where: { id: password.id },
          data: { isActive: false }
        })
        deactivatedCount++
      }
    }
    
    console.log(`✅ Mise à jour terminée. ${deactivatedCount} mots de passe désactivés.`)
    return { success: true, deactivatedCount }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des mots de passe Wi-Fi:', error)
    return { success: false, error }
  } finally {
    await prisma.$disconnect()
  }
}

// Fonction pour exécuter le worker
export async function runWorker() {
  console.log('🚀 Démarrage du worker de mise à jour des mots de passe Wi-Fi')
  await updateWifiPasswordsStatus()
}

// Si ce fichier est exécuté directement (node updateWifiPasswordsWorker.js)
if (require.main === module) {
  runWorker()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erreur critique dans le worker:', error)
      process.exit(1)
    })
}