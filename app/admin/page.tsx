import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../lib/auth'
import Link from 'next/link'
import MaintenanceWorkerWrapper from '../../components/MaintenanceWorkerWrapper'
import BackToDashboardButton from '../../components/BackToDashboardButton'

export default async function AdminPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'ADMIN') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:1000,margin:'0 auto'}}>
      {/* Composant qui exécute le worker de maintenance en arrière-plan */}
      <MaintenanceWorkerWrapper />
      
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Tableau de bord administrateur</h1>
          <p className="muted">Bienvenue, administrateur</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn">Se déconnecter</button>
        </form>
      </div>

      <section style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:20}}>
        <div>
          <div className="auth-card" style={{padding:18}}>
            <h3>Gérer les utilisateurs</h3>
            <p className="muted">Créer, modifier et supprimer les utilisateurs (administrateurs et secrétaires).</p>
            <div style={{marginTop:12}}>
              <Link className="btn" href="/admin/users">Gérer les utilisateurs</Link>
            </div>
          </div>
        </div>
        <div>
          <div className="auth-card" style={{padding:18}}>
            <h3>Points d'accès (SSIDs)</h3>
            <p className="muted">Créer et supprimer des points d'accès Wi‑Fi.</p>
            <div style={{marginTop:12}}>
              <Link className="btn" href="/admin/ssids">Gérer les points d'accès</Link>
            </div>
          </div>
        </div>

        <div>
          <div className="auth-card" style={{padding:18}}>
            <h3>Gérer les sessions</h3>
            <p className="muted">Créer et supprimer des sessions Wi‑Fi</p>
            <div style={{marginTop:12}}>
              <Link className="btn" href="/admin/sessions">Gérer les sessions</Link>
            </div>
          </div>
        </div>


      </section>

    </main>
  )
}