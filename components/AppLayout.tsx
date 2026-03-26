import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwt } from '@/lib/auth'
import AppSidebar from '@/components/AppSidebar'

interface AppLayoutProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'SECRETARY'
}

export default async function AppLayout({ 
  children, 
  requiredRole 
}: AppLayoutProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('clinic_token')?.value
  const payload: any = token ? verifyJwt(token) : null

  if (!payload) redirect('/login')
  
  if (requiredRole && payload.role !== requiredRole) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-bg-light">
      <AppSidebar role={payload.role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
