"use client"
import React, { useState, useEffect } from 'react'

type Ssid = { id: number, name: string }

export type SessionFilters = {
  q?: string
  ssidId?: number | null
  dateFrom?: string | null
  dateTo?: string | null
  isActive?: 'all' | 'active' | 'inactive'
}

export default function SessionFilter({ ssids, onChange, initial }: { ssids?: Ssid[], onChange: (f: SessionFilters)=>void, initial?: SessionFilters }){
  const [q, setQ] = useState(initial?.q || '')
  const [ssidId, setSsidId] = useState<number | ''>(initial?.ssidId ?? '')
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom || '')
  const [dateTo, setDateTo] = useState(initial?.dateTo || '')
  const [isActive, setIsActive] = useState<'all'|'active'|'inactive'>(initial?.isActive || 'all')

  useEffect(()=>{
    const payload: SessionFilters = {
      q: q || undefined,
      ssidId: ssidId === '' ? undefined : Number(ssidId),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      isActive: isActive || undefined,
    }
    onChange(payload)
  },[q, ssidId, dateFrom, dateTo, isActive])

  return (
    <div className="filter-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{margin: '0 0 8px 0', fontSize: '16px'}}>Filtres de recherche</h3>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
        {/* Filtre de recherche textuelle */}
        <div className="filter-item">
          <label htmlFor="search-input" style={{display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px'}}>
            Recherche
          </label>
          <input 
            id="search-input"
            placeholder="Nom, téléphone ou mot de passe" 
            value={q} 
            onChange={e=>setQ(e.target.value)}
            style={{width: '100%'}}
          />
        </div>
        
        {/* Filtre par SSID */}
        <div className="filter-item">
          <label htmlFor="ssid-select" style={{display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px'}}>
            Réseau Wi-Fi (SSID)
          </label>
          <select 
            id="ssid-select"
            value={ssidId as any} 
            onChange={e=>setSsidId(e.target.value === '' ? '' : Number(e.target.value))}
            style={{width: '100%'}}
          >
            <option value="">Tous les SSID</option>
            {ssids?.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
        {/* Filtres de date */}
        <div className="filter-item">
          <label htmlFor="date-from" style={{display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px'}}>
            Date de début
          </label>
          <input 
            id="date-from"
            type="date" 
            value={dateFrom} 
            onChange={e=>setDateFrom(e.target.value)}
            style={{width: '100%'}}
          />
        </div>
        
        <div className="filter-item">
          <label htmlFor="date-to" style={{display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px'}}>
            Date de fin
          </label>
          <input 
            id="date-to"
            type="date" 
            value={dateTo} 
            onChange={e=>setDateTo(e.target.value)}
            style={{width: '100%'}}
          />
        </div>
        
        {/* Filtre par statut */}
        <div className="filter-item">
          <label htmlFor="status-select" style={{display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px'}}>
            Statut
          </label>
          <select 
            id="status-select"
            value={isActive} 
            onChange={e=>setIsActive(e.target.value as any)}
            style={{width: '100%'}}
          >
            <option value="all">Tous</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>
      </div>
    </div>
  )
}
