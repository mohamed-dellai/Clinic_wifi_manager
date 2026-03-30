import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../lib/auth'
import AuthCard from '@/components/AuthCard'
import LoginForm from '@/components/LoginForm'
import { TypographySmall, TypographyLead } from '@/components/ui/typography'

export const metadata = {
  title: 'Connexion — Clinic',
}

export default async function LoginPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  
  if(payload) {
    if(payload.role === 'ADMIN') redirect('/admin')
    if(payload.role === 'SECRETARY') redirect('/secretary')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-bg-light to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthCard subtitle="Connexion sécurisée">
          <LoginForm />
        </AuthCard>
        <div className="text-center mt-6">
          <TypographyLead className="text-center">Système de gestion WiFi professionnel</TypographyLead>
        </div>
      </div>
    </main>
  )
}
