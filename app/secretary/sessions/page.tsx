import AppLayout from '@/components/AppLayout'
import { TypographyH1, TypographySmall, TypographyLead } from '@/components/ui/typography'
import BackToDashboardButton from '@/components/BackToDashboardButton'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const SecretarySessions = dynamic(()=>import('@/components/SecretarySessions'))

export default async function SecretarySessionsPage(){
  return (
    <AppLayout requiredRole="SECRETARY">
      <div className="p-8">
        <div className="mb-8" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>
            <TypographyH1>Vos sessions</TypographyH1>
            <TypographyLead>Consultez et gérez vos sessions Wi-Fi actives et inactives.</TypographyLead>
          </div>
          <div>
            <BackToDashboardButton />
          </div>
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
