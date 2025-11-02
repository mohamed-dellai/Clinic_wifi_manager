import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../../lib/auth'
import AdminSsids from '../../../components/AdminSsids'
import BackToDashboardButton from '../../../components/BackToDashboardButton'

export default async function AdminSsidsPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'ADMIN') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Gérer les SSID</h1>
          <p className="muted">Créer et supprimer des points d'accès.</p>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <div className="auth-card">
          <AdminSsids />
        </div>
      </div>
            <BackToDashboardButton/>

    </main>
  )
}
