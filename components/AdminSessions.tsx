"use client"
import React, { useEffect, useState } from 'react'
import { add } from 'date-fns'
import SessionFilter, { SessionFilters } from './SessionFilter'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, Wifi, Clock, User, Phone, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminSessions(){
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ssids, setSsids] = useState<any[]>([])
  const [filters, setFilters] = useState<SessionFilters>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDuration, setEditDuration] = useState<number>(1)
  const [editUnit, setEditUnit] = useState<string>('HOURS')

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

  async function handleStartEdit(s:any){
    setEditingId(s.id)
    setEditDuration(Number(s.duration) || 1)
    setEditUnit(s.unit || 'HOURS')
  }

  async function handleSaveEdit(id:number){
    try{
      const res = await fetch('/api/sessions/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ id, duration: Number(editDuration), unit: editUnit }) })
      const data = await res.json()
      if(!res.ok){ alert(data?.error || 'Échec de la mise à jour'); return }
      setEditingId(null)
      load()
    }catch(err){ console.error(err); alert('Network error') }
  }

  function handleCancelEdit(){ setEditingId(null) }

  if(loading) return <div className="text-sm text-muted-fg animate-pulse">Chargement des sessions…</div>
  if(error) return <div className="text-sm text-destructive">{error}</div>

  const filtered = sessions.filter(s=>{
    if(filters.q){
      const q = filters.q.toLowerCase()
      const target = `${s.password} ${s.patient?.phone || ''}`.toLowerCase()
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
    // used
    if((filters as any).used && (filters as any).used !== 'all'){
      if((filters as any).used === 'used' && !s.used) return false
      if((filters as any).used === 'unused' && s.used) return false
    }
    return true
  })

  async function handleExport(){
    try{
      const XLSX = await import('xlsx')
      const data = filtered.map(s=>({
        Password: s.password,
        SSID: s.ssid?.name ?? '',
        Phone: s.patient?.phone ?? '',
        CreatedAt: new Date(s.createdAt).toLocaleString(),
        Duration: formatDuration(s.duration, s.unit),
        Active: s.isActive ? 'Yes' : 'No',
        Used: s.used ? 'Yes' : 'No',
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sessions')
      const filename = `sessions-${new Date().toISOString().slice(0,10)}.xlsx`
      XLSX.writeFile(wb, filename)
    }catch(err){ console.error(err); alert('Échec de l\'export') }
  }

  function formatDuration(n:number, unit:string){
    if(unit === 'HOURS') return `${n} ${n > 1 ? 'heures' : 'heure'}`
    if(unit === 'DAYS') return `${n} ${n > 1 ? 'jours' : 'jour'}`
    return `${n} ${unit.toLowerCase()}`
  }
  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <SessionFilter ssids={ssids} onChange={(f)=>setFilters(f)} />
          <div className="flex-shrink-0">
              <Button onClick={handleExport} variant="secondary" size="sm" className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter Excel</span>
            </Button>
          </div>
        </div>
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
                  <div className="flex items-center gap-2">
                    {/* Status badge: Expired / Inactive / Active */}
                    {isExpired ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-400">Expirée</span>
                    ) : !s.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/40 text-slate-800 dark:bg-slate-700/30 dark:text-slate-200">Inactivée</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Active</span>
                    )}

                    {/* Used badge: Utilisée / Non utilisée */}
                    {s.used ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">Utilisée</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted-foreground/8 text-muted-fg">Non utilisée</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-fg">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium text-foreground">{s.patient?.phone ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(s.createdAt).toLocaleString()} ({formatDuration(s.duration, s.unit)})</span>
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

                {editingId === s.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Input value={String(editDuration)} onChange={(e)=>setEditDuration(Number(e.target.value))} type="number" min={1} />
                    </div>
                    <select className="h-8 rounded-lg border border-input bg-background px-2 text-sm" value={editUnit} onChange={(e)=>setEditUnit(e.target.value)}>
                      <option value="HOURS">Heures</option>
                      <option value="DAYS">Jours</option>
                    </select>
                    <Button size="sm" onClick={()=>handleSaveEdit(s.id)} className="px-3">Enregistrer</Button>
                    <Button size="sm" variant="secondary" onClick={handleCancelEdit}>Annuler</Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={()=>handleStartEdit(s)}
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier durée</span>
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
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      
    </div>
  )
}
