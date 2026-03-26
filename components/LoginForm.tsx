"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TypographyP, TypographySmall, TypographyMuted } from '@/components/ui/typography'
import { AlertCircle } from 'lucide-react'

export default function LoginForm(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-label">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}
          placeholder="secretary@clinic.com"
          disabled={loading}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-label">Mot de passe</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
          className="h-11"
        />
      </div>

      {error && (
        <div className="flex gap-3 rounded-lg bg-red-50 border border-red-200 p-3">
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <TypographySmall className="text-danger">{error}</TypographySmall>
        </div>
      )}

      <div className="space-y-4 pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-11 btn-primary text-base font-semibold"
        >
          {loading? 'Connexion…' : 'Se connecter'}
        </Button>
        <TypographyMuted className="text-center">
          Les utilisateurs connectés seront redirigés vers le tableau de bord.
        </TypographyMuted>
      </div>
    </form>
  )
}
