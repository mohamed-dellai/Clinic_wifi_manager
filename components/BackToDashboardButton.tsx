"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function BackToDashboardButton({ children }:{ children?: React.ReactNode }){
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    let mounted = true
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(r=>r.json())
      .then(d=>{ if(mounted) setRole(d?.user?.role ?? null) })
      .catch(()=>{ if(mounted) setRole(null) })
      .finally(()=>{ if(mounted) setLoading(false) })
    return ()=>{ mounted = false }
  },[])

  function go(){
    if(role === 'ADMIN') return router.push('/admin')
    if(role === 'SECRETARY') return router.push('/secretary')
    return router.push('/login')
  }

  return (
    //make this button a pointer cursor
    <Button variant="outline" size="sm" onClick={go} disabled={loading} className="inline-flex items-center gap-2" style={{ cursor: 'pointer' }}>
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Retour</span>
    </Button>
  )
}
