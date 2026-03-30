import AppLayout from '@/components/AppLayout'
import { TypographyH1, TypographySmall, TypographyLead } from '@/components/ui/typography'
import BackToDashboardButton from '@/components/BackToDashboardButton'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const CreateSessionForm = dynamic(()=>import('@/components/CreateSessionForm'))

export default async function SecretaryCreatePage(){
  return (
    <AppLayout requiredRole="SECRETARY">
      <div className="p-8">
        <div className="mb-8" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>
            <TypographyH1>Créer une session Wi‑Fi</TypographyH1>
            <TypographyLead>Générez un nouvel accès Wi-Fi pour un patient.</TypographyLead>
          </div>
          <div>
            <BackToDashboardButton />
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardContent className="p-6">
              <CreateSessionForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
