import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../lib/auth'
import Link from 'next/link'
import MaintenanceWorkerWrapper from '../../components/MaintenanceWorkerWrapper'

export default async function SecretaryPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'SECRETARY') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:1000,margin:'0 auto'}}>
      {/* Composant qui exécute le worker de maintenance en arrière-plan */}
      <MaintenanceWorkerWrapper />
      
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Tableau de bord de la secrétaire</h1>
          <p className="muted">Bienvenue</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn">Se déconnecter</button>
        </form>
      </div>

      <section style={{display:'grid',gap:20,marginTop:20}}>
        <div>
          <div className="auth-card" style={{padding:18}}>
            <h3>Créer une nouvelle session Wi-Fi</h3>
            <p className="muted">Gardez le formulaire de création.</p>
            <div style={{marginTop:12}}>
              <Link className="btn" href="/secretary/create">Ouvrir le formulaire de création</Link>
            </div>
          </div>
        </div>
        <div>
          <div className="auth-card" style={{padding:18}}>
            <h3>Vos sessions</h3>
            <p className="muted">Consultez et gérez vos sessions.</p>
            <div style={{marginTop:12}}>
              <Link className="btn" href="/secretary/sessions">Voir les sessions</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
