"use client"
import React, { useEffect, useState } from 'react'
import SessionFilter, { SessionFilters } from './SessionFilter'

export default function SecretarySessions(){
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

  async function handleDelete(id:number){
    if(!confirm("Supprimer cette session ?")) return
    try{
      const res = await fetch('/api/sessions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ id }) })
      const data = await res.json()
      if(!res.ok){ alert(data?.error || "Échec de la suppression"); return }
      load()
    }catch(err){ console.error(err); alert('Network error') }
  }

  useEffect(()=>{ load() },[])

  useEffect(()=>{
    // load ssids for filter select
    let mounted = true
    fetch('/api/ssids', { credentials: 'same-origin' })
      .then(r=>r.json())
      .then(d=>{ if(mounted && d?.ssids) setSsids(d.ssids) })
      .catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  if(loading) return <div>Chargement des sessions…</div>
  if(error) return <div style={{color:'var(--danger)'}}>{error}</div>

  // apply filters client-side
  const filtered = sessions.filter(s=>{
    // text search
    if(filters.q){
      const q = filters.q.toLowerCase()
      const target = `${s.password} ${s.patient?.name || ''} ${s.patient?.phone || ''}`.toLowerCase()
      if(!target.includes(q)) return false
    }
    // ssid
    if(filters.ssidId){
      if(!s.ssid || Number(s.ssid.id) !== Number(filters.ssidId)) return false
    }
    // date range
    if(filters.dateFrom){
      if(new Date(s.createdAt) < new Date(filters.dateFrom)) return false
    }
    if(filters.dateTo){
      const end = new Date(filters.dateTo)
      end.setHours(23,59,59,999)
      if(new Date(s.createdAt) > end) return false
    }
    // active
    if(filters.isActive && filters.isActive !== 'all'){
      if(filters.isActive === 'active' && !s.isActive) return false
      if(filters.isActive === 'inactive' && s.isActive) return false
    }
    return true
  })

  return (
    <div>
      <div style={{marginBottom:16}}>
        <SessionFilter ssids={ssids} onChange={(f)=>setFilters(f)} />
      </div>

      <div className="session-list">
    {filtered.length === 0 && <div className="muted">Aucune session.</div>}
        {filtered.map(s=> (
          <div key={s.id} className="session-item">
            <div className="session-row">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{fontWeight:800,fontSize:18}}>{s.password}</div>
                    <div className="ssid-badge">{s.ssid?.name ?? 'SSID'}</div>
                  </div>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{fontWeight:600}}>{s.patient?.name ?? '—'}</div>
                    <div className="muted">{s.patient?.phone ?? '—'}</div>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span className={`status-dot ${s.isActive? 'status-active' : 'status-inactive'}`} title={s.isActive? 'Active':'Inactive'}></span>
                  <div className="muted">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
        <div className="session-actions">
      <button className="btn secondary" onClick={()=>navigator.clipboard?.writeText(s.password)}>Copier</button>
      <button className="btn" onClick={()=>handleDelete(s.id)}>Supprimer</button>
        </div>
              </div>
            </div>
            <div className="session-meta" style={{marginTop:8}}>Durée : {s.duration} {s.unit.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
