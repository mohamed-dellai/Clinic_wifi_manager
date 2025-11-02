"use client"
import React, { useState, useEffect } from 'react'

export default function CreateSessionForm({ onCreated }:{ onCreated?: (s:any)=>void }){
  const [name, setName] = useState('')
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
        body: JSON.stringify({ name, phone, duration, unit, type, ssidId: selectedSsidId })
      })
      const data = await res.json()
      if(!res.ok){ setError(data?.error||'Échec'); setLoading(false); return }
      setName(''); setPhone(''); setDuration(4)
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
    <form onSubmit={handleSubmit} className="create-session-form">
      <div className="field">
  <label htmlFor="name">Nom (optionnel)</label>
  <input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nom complet du patient" />
      </div>
      <div className="field">
  <label htmlFor="phone">Téléphone (international)</label>
  <input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+33123456789" />
      </div>

      <div className="field">
        <label htmlFor="ssid">SSID (Réseau Wi‑Fi)</label>
        {ssidLoading ? (
          <div className="muted">Chargement des SSIDs…</div>
        ) : ssids.length === 0 ? (
          <div className="muted">Aucun SSID disponible. Créez-en un dans le panneau d'administration.</div>
        ) : (
          <select id="ssid" value={selectedSsidId ?? undefined} onChange={e=>setSelectedSsidId(Number(e.target.value))}>
            {ssids.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>
        
      <div className="field">
  <label htmlFor="type">Type de patient</label>
        <select id="type" value={type} onChange={e=>setType(e.target.value)}>
          <option value="REGULAR">Régulier</option>
          <option value="RESIDENT">Résident</option>
        </select>
      </div>
      <div className="form-row">
        <div className="field" style={{flex:1}}>
          <label htmlFor="duration">Durée</label>
          <input id="duration" type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
        </div>
        <div className="field" style={{flex:1}}>
          <label htmlFor="unit">Unité</label>
          <select id="unit" value={unit} onChange={e=>setUnit(e.target.value)}>
            <option value="HOURS">Heures</option>
            <option value="DAYS">Jours</option>
          </select>
        </div>
      </div>


  {error && <div style={{color:'var(--danger)'}}>{error}</div>}

      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
  <button className="btn secondary" type="button" onClick={()=>{setName('');setPhone('')}}>Effacer</button>
  <button className="btn" type="submit" disabled={loading}>{loading? 'Création...' : 'Créer la session'}</button>
      </div>

      {/* success card showing generated password */}
      {createdSession && (
        <div className="success-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <div>
              <div className="success-title">Session créée</div>
              <div className="muted" style={{fontSize:13}}>Partagez ce mot de passe Wi‑Fi avec le patient</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="password-badge">{createdSession.password}</div>
              <button
                className={copied? 'copy-btn copied' : 'copy-btn'}
                type="button"
                onClick={async()=>{
                  try{
                    await navigator.clipboard.writeText(createdSession.password)
                    setCopied(true)
                    setTimeout(()=>setCopied(false),2000)
                  }catch(err){
                    // fallback for older browsers
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
              >{copied? 'Copié' : 'Copier'}</button>
            </div>
          </div>

          <div style={{marginTop:10,display:'flex',justifyContent:'flex-end'}}>
            <button className="btn" type="button" onClick={()=>setCreatedSession(null)}>Créer une autre</button>
          </div>
        </div>
      )}
    </form>
  )
}
