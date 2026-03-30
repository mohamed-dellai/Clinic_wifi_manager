"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'

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

  if(loading) return <div className="text-sm text-muted-fg animate-pulse">Chargement des points d'accès…</div>
  if(error) return <div className="text-sm text-destructive">{error}</div>

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border shadow-sm">
        <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[180px]">
            <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du point d'accès" />
          </div>
          <div className="flex-1 min-w-[220px]">
            <Input value={description} onChange={e=>setDescription(e.target.value)} placeholder="description (optionnelle)" />
          </div>
          <div>
            <Button type="submit" variant="secondary" className="cursor-pointer bg-primary text-primary-foreground px-4">
              Créer SSID
            </Button>
          </div>
        </form>
      </div>

      {ssids.length === 0 && (
        <div className="text-center p-6 border border-dashed rounded-lg text-muted-fg bg-surface/50">Aucun point d'accès.</div>
      )}

      <div className="space-y-4">
        {ssids.map(s=> (
          <div key={s.id} className="group flex items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="font-medium">{s.name}</div>
              {s.description && <div className="text-sm text-muted-foreground">{s.description}</div>}
              <div className="text-sm text-muted-foreground">Créé le {new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="destructive" size="sm" onClick={()=>handleDelete(s.id)} className="cursor-pointer">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
