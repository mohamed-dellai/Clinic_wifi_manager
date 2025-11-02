"use client"
import React, { useEffect, useState } from 'react'
import BackToDashboardButton from './BackToDashboardButton'

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

  if(loading) return <div>Chargement des utilisateurs…</div>
  if(error) return <div style={{color:'var(--danger)'}}>{error}</div>

  return (
    <div>
      <form onSubmit={handleCreate} style={{display:'grid',gap:8,marginBottom:12}}>
          <div style={{display:'flex',gap:8}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@exemple.com" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="mot de passe" />
          <select value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="SECRETARY">Secrétaire</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          <button className="btn" type="submit">Créer</button>
        </div>
      </form>

      {users.length === 0 && <div className="muted">Aucun utilisateur pour le moment.</div>}
      {users.map(u=> (
        <div key={u.id} style={{padding:12,marginTop:8,background:'var(--surface)',borderRadius:8,border:'1px solid rgba(12,20,40,0.04)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div><strong>{u.email}</strong> <span className="muted">· {u.role}</span></div>
              <div className="muted" style={{fontSize:13}}>Créé le {new Date(u.createdAt).toLocaleString()}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn secondary" onClick={()=>{navigator.clipboard?.writeText(u.email)}}>Copier l'email</button>
              <button className="btn" onClick={()=>handleDelete(u.id)}>Supprimer</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
