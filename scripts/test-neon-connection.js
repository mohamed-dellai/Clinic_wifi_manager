// Script pour tester la connexion à Neon DB
const { Client } = require('pg');

async function testConnection() {
  // Chaîne de connexion à Neon DB
  const connectionString = 'postgresql://neondb_owner:npg_iFZD8Qa5YSAd@ep-damp-scene-ag1tpou7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  // Création d'un client PostgreSQL
  const client = new Client({
    connectionString,
  });

  try {
    console.log('Tentative de connexion à Neon DB...');
    
    // Connexion à la base de données
    await client.connect();
    console.log('✅ Connexion réussie à Neon DB!');
    
    // Exécution d'une requête simple pour tester
    const result = await client.query('SELECT current_database() as db_name, current_user as user_name');
    console.log('Informations de connexion:');
    console.log(`- Base de données: ${result.rows[0].db_name}`);
    console.log(`- Utilisateur: ${result.rows[0].user_name}`);
    
    // Liste des tables
    console.log('\nListe des tables dans la base de données:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tables.rows.length === 0) {
      console.log('Aucune table trouvée dans le schéma public.');
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  } finally {
    // Fermeture de la connexion
    await client.end();
  }
}

// Exécution du test de connexion
testConnection();