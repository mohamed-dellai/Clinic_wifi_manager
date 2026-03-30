import AppLayout from '@/components/AppLayout'
import MaintenanceWorkerWrapper from '@/components/MaintenanceWorkerWrapper'
import BackToDashboardButton from '@/components/BackToDashboardButton'
import { TypographyH1, TypographyLead } from '@/components/ui/typography'
import StatisticSecretaireDashboard from '@/components/StatisticSecretaireDashboard'

export default async function StatisticSecretairePage() {
  return (
    <AppLayout requiredRole="ADMIN">
      <MaintenanceWorkerWrapper />
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <TypographyH1>Statistiques — Secrétaires</TypographyH1>
            <TypographyLead>
              Tableau de bord des statistiques essentielles pour le secrétariat.
            </TypographyLead>
          </div>
          <BackToDashboardButton />
        </div>

        <StatisticSecretaireDashboard />
      </div>
    </AppLayout>
  )
}
