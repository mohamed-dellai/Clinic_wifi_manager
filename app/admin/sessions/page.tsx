import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../../lib/auth'
import AdminSessions from '../../../components/AdminSessions'
import BackToDashboardButton from '../../../components/BackToDashboardButton'

export default async function AdminSessionsPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'ADMIN') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:1000,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Toutes les sessions</h1>
          <p className="muted">Toutes les sessions Wi‑Fi créées dans le système et l'utilisateur qui les a émises.</p>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <div className="auth-card">
          <AdminSessions />
        </div>
      </div>
            <BackToDashboardButton/>

    </main>
  )
}
