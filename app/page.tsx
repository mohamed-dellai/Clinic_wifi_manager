import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '../lib/auth'

export default async function Home(){
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null

  if(!payload) return redirect('/login')
  if(payload.role === 'ADMIN') return redirect('/admin')
  if(payload.role === 'SECRETARY') return redirect('/secretary')

  return redirect('/login')
}
