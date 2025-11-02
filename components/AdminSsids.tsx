"use client"
import React, { useEffect, useState } from 'react'
import BackToDashboardButton from './BackToDashboardButton'

type Ssid = { id:number, name:string, description?:string, createdAt:string }

export default function AdminSsids(){
  const [ssids, setSsids] = useState<Ssid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch('/api/ssids', { credentials: 'same-origin' })
      const data = await res.json()
      if(!res.ok){ setError(data?.error || 'Échec'); setLoading(false); return }
      setSsids(data.ssids || [])
      setLoading(false)
    }catch(err){ console.error(err); setError('Erreur réseau'); setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function handleCreate(e:React.FormEvent){
    e.preventDefault()
    try{
      const res = await fetch('/api/ssids', { method: 'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ name, description })})
      const data = await res.json()
      if(!res.ok){ setError(data?.error || 'Échec de la création'); return }
      setName(''); setDescription('')
      load()
    }catch(err){ console.error(err); setError('Erreur réseau') }
  }

  async function handleDelete(id:number){
    if(!confirm("Supprimer ce point d'accès ?")) return
    try{
      const res = await fetch('/api/ssids', { method: 'DELETE', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ id })})
      const data = await res.json()
      if(!res.ok){ alert(data?.error || "Échec"); return }
      load()
    }catch(err){ console.error(err); alert('Erreur réseau') }
  }

  if(loading) return <div>Chargement des points d'accès…</div>
  if(error) return <div style={{color:'var(--danger)'}}>{error}</div>

  return (
    <div>
      <form onSubmit={handleCreate} style={{display:'flex',gap:8,marginBottom:12}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du point d'accès" />
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="description (optionnelle)" />
            <button className="btn" type="submit">Créer SSID</button>
          </form>

  {ssids.length === 0 && <div className="muted">Aucun point d'accès.</div>}
      {ssids.map(s=> (
        <div key={s.id} style={{padding:12,marginTop:8,background:'var(--surface)',borderRadius:8,border:'1px solid rgba(12,20,40,0.04)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{s.name}</strong></div>
              {s.description && <div className="muted" style={{fontSize:13}}>{s.description}</div>}
              <div className="muted" style={{fontSize:13}}>Créé le {new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <button className="btn" onClick={()=>handleDelete(s.id)}>Supprimer</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
