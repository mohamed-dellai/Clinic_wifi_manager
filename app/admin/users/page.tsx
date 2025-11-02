import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../../lib/auth'
import AdminUsers from '../../../components/AdminUsers'
import BackToDashboardButton from '../../../components/BackToDashboardButton'

export default async function AdminUsersPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'ADMIN') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:1000,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Gérer les utilisateurs</h1>
          <p className="muted">Créer et supprimer des utilisateurs de l'application.</p>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <div className="auth-card">
          <AdminUsers />
        </div>
      </div>
                  <BackToDashboardButton/>

    </main>
  )
}
