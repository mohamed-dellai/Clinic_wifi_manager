'use client';

import dynamic from 'next/dynamic';

// Import dynamique du composant MaintenanceWorker (côté client)
const MaintenanceWorker = dynamic(() => import('./MaintenanceWorker'), { ssr: false });

export default function MaintenanceWorkerWrapper() {
  return <MaintenanceWorker />;
}