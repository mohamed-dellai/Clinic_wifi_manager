'use client';

import { useEffect } from 'react';

// Composant qui appelle l'API de maintenance au chargement de la page
export default function MaintenanceWorker() {
  useEffect(() => {
    // Appeler l'API de maintenance en arrière-plan
    fetch('/api/maintenance')
      .then(response => response.json())
      .catch(error => {
        // Ignorer les erreurs pour ne pas perturber l'expérience utilisateur
        console.error('Erreur lors de l\'appel à l\'API de maintenance:', error);
      });
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
}