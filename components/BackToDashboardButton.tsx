"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <button className="muted" onClick={go} disabled={loading} style={{background:'transparent',border:'none',padding:0,cursor:loading? 'default' : 'pointer'}} aria-label="Retour au tableau de bord">
      {children || '← Retour au tableau de bord'}
    </button>
  )
}
