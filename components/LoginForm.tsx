"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    if(!email || !password){
      setError("Veuillez renseigner l'email et le mot de passe")
      return
    }
    setLoading(true)

    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if(!res.ok){
        setError(data?.error || "Échec de la connexion")
        setLoading(false)
        return
      }

      // server sets an HttpOnly cookie; redirect based on role returned
      const role = data?.role
      setLoading(false)
      setEmail('')
      setPassword('')
      if(role === 'ADMIN') router.push('/admin')
      else if(role === 'SECRETARY') router.push('/secretary')
      else router.push('/')
    }catch(err){
      console.error(err)
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="secretary@example.com" />
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
      </div>

      {error && <div style={{color:'var(--danger)',fontSize:13}}>{error}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
        <div className="muted">Mot de passe oublié ?</div>
        <button className="btn" type="submit" disabled={loading}>{loading? 'Connexion…' : 'Se connecter'}</button>
      </div>

      <div className="help">Les utilisateurs connectés seront redirigés vers le tableau de bord.</div>
    </form>
  )
}
