import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../../lib/auth'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BackToDashboardButton from '../../../components/BackToDashboardButton'

const CreateSessionForm = dynamic(()=>import('../../../components/CreateSessionForm'))

export default async function SecretaryCreatePage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'SECRETARY') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:"fit-content",margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Créer une session Wi‑Fi</h1>
          <p className="muted">Bonjour</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn">Déconnexion</button>
        </form>
      </div>

      <div className="auth-card" style={{padding:18,marginTop:20}}>
        <CreateSessionForm />
      </div>

      <div style={{marginTop:16}}>
        {/* Back button navigates to the correct dashboard based on current role */}
        {/* Replaced Link with client component so it can inspect the user's role */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        {/* @ts-ignore */}
        <BackToDashboardButton />
      </div>
    </main>
  )
}
