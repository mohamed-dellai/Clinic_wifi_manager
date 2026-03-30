"use client"
import React, { useEffect, useState } from 'react'
import { add } from 'date-fns'
import SessionFilter, { SessionFilters } from './SessionFilter'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, Wifi, Clock, User, Phone } from 'lucide-react'

export default function AdminSessions(){
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ssids, setSsids] = useState<any[]>([])
  const [filters, setFilters] = useState<SessionFilters>({})

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch('/api/sessions', { credentials: 'same-origin' })
      const data = await res.json()
      if(!res.ok){ setError(data?.error || 'Échec du chargement'); setLoading(false); return }
      setSessions(data.sessions || [])
      setLoading(false)
    }catch(err){ console.error(err); setError('Erreur réseau'); setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  useEffect(()=>{
    let mounted = true
    fetch('/api/ssids', { credentials: 'same-origin' })
      .then(r=>r.json())
      .then(d=>{ if(mounted && d?.ssids) setSsids(d.ssids) })
      .catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  async function handleDelete(id:number){
    if(!confirm('Supprimer cette session ?')) return
    try{
      const res = await fetch('/api/sessions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ id }) })
      const data = await res.json()
      if(!res.ok){ alert(data?.error || "Échec de la suppression"); return }
      load()
    }catch(err){ console.error(err); alert('Erreur réseau') }
  }

  if(loading) return <div className="text-sm text-muted-fg animate-pulse">Chargement des sessions…</div>
  if(error) return <div className="text-sm text-destructive">{error}</div>

  const filtered = sessions.filter(s=>{
    if(filters.q){
      const q = filters.q.toLowerCase()
      const target = `${s.password} ${s.patient?.name || ''} ${s.patient?.phone || ''}`.toLowerCase()
      if(!target.includes(q)) return false
    }
    if(filters.ssidId){
      if(!s.ssid || Number(s.ssid.id) !== Number(filters.ssidId)) return false
    }
    if(filters.dateFrom){
      if(new Date(s.createdAt) < new Date(filters.dateFrom)) return false
    }
    if(filters.dateTo){
      const end = new Date(filters.dateTo)
      end.setHours(23,59,59,999)
      if(new Date(s.createdAt) > end) return false
    }
    if(filters.isActive && filters.isActive !== 'all'){
      if(filters.isActive === 'active' && !s.isActive) return false
      if(filters.isActive === 'inactive' && s.isActive) return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border shadow-sm">
        <SessionFilter ssids={ssids} onChange={(f)=>setFilters(f)} />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-fg bg-surface/50">Aucune session trouvée.</div>
        )}

        {filtered.map(s=> {
          let expiration: Date | null = null
          if(s.unit === 'HOURS') expiration = add(new Date(s.createdAt), { hours: s.duration })
          else if(s.unit === 'DAYS') expiration = add(new Date(s.createdAt), { days: s.duration })
          const isExpired = expiration ? new Date() > expiration : false

          return (
            <div key={s.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg tracking-wide text-primary">{s.password}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-background text-foreground">
                    <Wifi className="w-3 h-3" />
                    {s.ssid?.name ?? 'SSID'}
                  </span>
                  {isExpired ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-400">Expirée</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Active</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-fg">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-foreground">{s.patient?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{s.patient?.phone ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(s.createdAt).toLocaleString()} ({s.duration} {s.unit.toLowerCase()})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={()=>navigator.clipboard?.writeText(s.password)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copier</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={()=>handleDelete(s.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      
    </div>
  )
}
