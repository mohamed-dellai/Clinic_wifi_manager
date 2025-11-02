import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../../../lib/auth'
import dynamic from 'next/dynamic'
import BackToDashboardButton from '../../../components/BackToDashboardButton'
import Link from 'next/link'

const SecretarySessions = dynamic(()=>import('../../../components/SecretarySessions'))

export default async function SecretarySessionsPage(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null
  if(!payload) redirect('/login')
  if(payload.role !== 'SECRETARY') redirect('/login')

  return (
    <main style={{padding:24,maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div>
          <h1>Vos sessions</h1>
          <p className="muted"></p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn">Sign out</button>
        </form>
      </div>

      <div className="auth-card" style={{padding:18,marginTop:20}}>
        <SecretarySessions />
      </div>

      <div style={{marginTop:16}}>
        <BackToDashboardButton />
      </div>
    </main>
  )
}
