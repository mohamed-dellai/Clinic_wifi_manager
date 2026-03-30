"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Copy, Trash2 } from 'lucide-react'

type User = { id:number, email:string, role:string, createdAt:string }

export default function AdminUsers(){
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN'|'SECRETARY'>('SECRETARY')

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch('/api/users', { credentials: 'same-origin' })
      const data = await res.json()
      if(!res.ok){ setError(data?.error || 'Échec'); setLoading(false); return }
      setUsers(data.users || [])
      setLoading(false)
    }catch(err){ console.error(err); setError('Erreur réseau'); setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function handleCreate(e:React.FormEvent){
    e.preventDefault()
    try{
      const res = await fetch('/api/users', { method: 'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ email, password, role })})
      const data = await res.json()
      if(!res.ok){ setError(data?.error || 'Échec de la création'); return }
      setEmail(''); setPassword(''); setRole('SECRETARY')
      load()
    }catch(err){ console.error(err); setError('Erreur réseau') }
  }

  async function handleDelete(id:number){
    if(!confirm('Supprimer cet utilisateur ?')) return
    try{
      const res = await fetch('/api/users', { method: 'DELETE', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ id })})
      const data = await res.json()
      if(!res.ok){ alert(data?.error || "Échec"); return }
      load()
    }catch(err){ console.error(err); alert('Erreur réseau') }
  }

  if(loading) return <div className="text-sm text-muted-fg animate-pulse">Chargement des utilisateurs…</div>
  if(error) return <div className="text-sm text-destructive">{error}</div>

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border shadow-sm">
        <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[180px]">
            <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@exemple.com" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="mot de passe" />
          </div>
          <div className="w-40">
            <Select value={role} onValueChange={(val:any)=>setRole(val)}>
              <SelectTrigger>
                <SelectValue>{role === 'ADMIN' ? 'Administrateur' : 'Secrétaire'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SECRETARY">Secrétaire</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button type="submit" className="cursor-pointer">Créer</Button>
          </div>
        </form>
      </div>

      {users.length === 0 && (
        <div className="text-center p-6 border border-dashed rounded-lg text-muted-fg bg-surface/50">Aucun utilisateur pour le moment.</div>
      )}

      <div className="space-y-4">
        {users.map(u=> (
          <div key={u.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
            <div>
              <div className="flex items-center gap-2">
                <strong>{u.email}</strong>
                {u.role === 'ADMIN' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-700">Administrateur</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700">Secrétaire</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Créé le {new Date(u.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" onClick={()=>navigator.clipboard?.writeText(u.email)} className="flex items-center gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copier</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={()=>handleDelete(u.id)} className="flex items-center gap-2 cursor-pointer">
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
