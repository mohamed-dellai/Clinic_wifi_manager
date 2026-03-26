import AppLayout from '@/components/AppLayout'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const SecretarySessions = dynamic(()=>import('@/components/SecretarySessions'))

export default async function SecretarySessionsPage(){
  return (
    <AppLayout requiredRole="SECRETARY">
      <div className="p-8">
        <div className="mb-8">
          <TypographyH1>Vos sessions</TypographyH1>
          <TypographySmall className="text-muted-fg mt-2">
            Consultez et gérez vos sessions Wi-Fi actives et inactives.
          </TypographySmall>
        </div>

        <Card>
          <CardContent className="p-6">
            <SecretarySessions />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
