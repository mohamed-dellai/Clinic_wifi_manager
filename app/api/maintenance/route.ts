import { NextRequest, NextResponse } from 'next/server';
import { updateWifiPasswordsStatus } from '../../../lib/updateWifiPasswordsWorker';

// Cette API route exécute le worker de mise à jour des mots de passe Wi-Fi
export async function GET(request: NextRequest) {
  try {
    // Exécuter le worker en arrière-plan sans attendre sa fin
    updateWifiPasswordsStatus().catch(error => {
      console.error('Erreur lors de l\'exécution du worker:', error);
    });
    
    // Répondre immédiatement pour ne pas bloquer la page
    return NextResponse.json({ success: true, message: 'Worker lancé en arrière-plan' });
  } catch (error) {
    console.error('Erreur lors du lancement du worker:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du lancement du worker' },
      { status: 500 }
    );
  }
}