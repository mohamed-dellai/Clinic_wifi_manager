"use client"
import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, CheckCircle2 } from 'lucide-react'

export default function CreateSessionForm({ onCreated }:{ onCreated?: (s:any)=>void }){
  const [phone, setPhone] = useState('')
  const [duration, setDuration] = useState(4)
  const [unit, setUnit] = useState('HOURS')
  const [type, setType] = useState('REGULAR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdSession, setCreatedSession] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [ssids, setSsids] = useState<Array<{id:number,name:string}>>([])
  const [ssidLoading, setSsidLoading] = useState(true)
  const [selectedSsidId, setSelectedSsidId] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    if(!phone){ setError('Le numéro de téléphone est requis'); return }
    if(!selectedSsidId){ setError('Veuillez sélectionner un SSID Wi‑Fi'); return }
    setLoading(true)
    try{
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ phone, duration, unit, type, ssidId: selectedSsidId })
      })
      const data = await res.json()
      if(!res.ok){ setError(data?.error||'Échec'); setLoading(false); return }
      setPhone(''); setDuration(4)
      setLoading(false)
      setCreatedSession(data.session)
      setCopied(false)
      if(onCreated) onCreated(data.session)
    }catch(err){
      console.error(err)
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  useEffect(()=>{
    let mounted = true
    setSsidLoading(true)
    fetch('/api/ssids', { credentials: 'same-origin' })
      .then(r=>r.json())
      .then(data=>{
        if(!mounted) return
        const list = data?.ssids || []
        setSsids(list)
        if(list.length) setSelectedSsidId(list[0].id)
      })
      .catch(err=>{
        console.error('Échec du chargement des SSIDs', err)
      })
      .finally(()=>{ if(mounted) setSsidLoading(false) })
    return ()=>{ mounted = false }
  },[])
  
  // Effet pour changer l'unité en fonction du type de patient
  useEffect(() => {
    if (type === 'RESIDENT') {
      setUnit('DAYS')
    } else if (type === 'REGULAR') {
      setUnit('HOURS')
    }
  }, [type])

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone (international)</Label>
          <Input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+33123456789" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ssid">SSID (Réseau Wi‑Fi)</Label>
          {ssidLoading ? (
            <div className="text-sm text-muted-fg">Chargement des SSIDs…</div>
          ) : ssids.length === 0 ? (
            <div className="text-sm text-muted-fg">Aucun SSID disponible. Créez-en un dans le panneau d'administration.</div>
          ) : (
            <Select value={selectedSsidId?.toString() ?? ''} onValueChange={val => val && setSelectedSsidId(Number(val))}>
            <SelectTrigger>
              <SelectValue>
                {selectedSsidId ? ssids.find(s => s.id === selectedSsidId)?.name : 'Sélectionner un SSID'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ssids.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          )}
        </div>
          
        <div className="space-y-2">
          <Label htmlFor="type">Type de patient</Label>
          <Select value={type} onValueChange={val => val && setType(val)}>
            <SelectTrigger>
              <SelectValue>{type === 'REGULAR' ? 'Régulier' : 'Résident'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REGULAR">Régulier</SelectItem>
              <SelectItem value="RESIDENT">Résident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="duration">Durée</Label>
            <Input id="duration" type="number" min="1" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor="unit">Unité</Label>
            <Select value={unit} onValueChange={val => val && setUnit(val)}>
              <SelectTrigger>
                <SelectValue>{unit === 'HOURS' ? 'Heures' : 'Jours'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOURS">Heures</SelectItem>
                <SelectItem value="DAYS">Jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={()=>{setPhone('')}} className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-0">Effacer</Button>
          <Button variant="default" type="submit" disabled={loading} className="bg-[#00416A] hover:bg-[#00416A]/90 text-white">{loading? 'Création...' : 'Créer l’accès Wi‑Fi'}</Button>
        </div>
      </form>

      {/* success card showing generated password */}
      {createdSession && (
        <Card className="border-success/20 bg-success/5 shadow-sm mt-6 animate-in fade-in slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-success text-lg">
              <CheckCircle2 className="h-5 w-5" />
              Session créée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-muted-fg">
                Partagez ce mot de passe Wi‑Fi avec le patient
              </div>
              <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-2 shadow-sm">
                <span className="font-mono font-bold text-lg tracking-wider text-primary">{createdSession.password}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-fg hover:text-foreground"
                  onClick={async()=>{
                    try{
                      await navigator.clipboard.writeText(createdSession.password)
                      setCopied(true)
                      setTimeout(()=>setCopied(false),2000)
                    }catch(err){
                      // fallback
                      const el = document.createElement('textarea')
                      el.value = createdSession.password
                      document.body.appendChild(el)
                      el.select()
                      document.execCommand('copy')
                      document.body.removeChild(el)
                      setCopied(true)
                      setTimeout(()=>setCopied(false),2000)
                    }
                  }}
                  title="Copier le mot de passe"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={()=>setCreatedSession(null)}>
                Créer une autre session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
