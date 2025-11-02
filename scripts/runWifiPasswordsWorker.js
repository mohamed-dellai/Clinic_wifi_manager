// Script pour exécuter le worker de mise à jour des mots de passe Wi-Fi
const path = require('path');

console.log('🕒 Démarrage du script de mise à jour des mots de passe Wi-Fi');

try {
  // Chemin vers le worker
  const workerPath = path.join(__dirname, '..', 'lib', 'updateWifiPasswordsWorker.js');
  
  // Importer et exécuter le worker directement
  console.log('🚀 Exécution du worker...');
  const { updateWifiPasswordsStatus } = require(workerPath);
  
  updateWifiPasswordsStatus()
    .then(() => {
      console.log('✅ Worker exécuté avec succès');
    })
    .catch(error => {
      console.error('❌ Erreur lors de l\'exécution du worker:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Erreur lors de l\'exécution du worker:', error);
  process.exit(1);
}