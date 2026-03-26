import AppLayout from '@/components/AppLayout'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const CreateSessionForm = dynamic(()=>import('@/components/CreateSessionForm'))

export default async function SecretaryCreatePage(){
  return (
    <AppLayout requiredRole="SECRETARY">
      <div className="p-8">
        <div className="mb-8">
          <TypographyH1>Créer une session Wi‑Fi</TypographyH1>
          <TypographySmall className="text-muted-fg mt-2">
            Générez un nouvel accès Wi-Fi pour un patient.
          </TypographySmall>
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
