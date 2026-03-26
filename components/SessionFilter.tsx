"use client"
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Filter, Calendar } from 'lucide-react'

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
  const [ssidId, setSsidId] = useState<string>(initial?.ssidId?.toString() || 'all')
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom || '')
  const [dateTo, setDateTo] = useState(initial?.dateTo || '')
  const [isActive, setIsActive] = useState<'all'|'active'|'inactive'>(initial?.isActive || 'all')

  useEffect(()=>{
    const payload: SessionFilters = {
      q: q || undefined,
      ssidId: ssidId === 'all' ? undefined : Number(ssidId),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      isActive: isActive || undefined,
    }
    onChange(payload)
  },[q, ssidId, dateFrom, dateTo, isActive])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Filter className="w-4 h-4 text-muted-fg" />
        <h3 className="text-sm font-semibold m-0 text-foreground">Filtres</h3>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1 w-full space-y-1.5">
          <Label htmlFor="search-input" className="text-xs text-muted-fg">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-fg" />
            <Input 
              id="search-input"
              placeholder="Nom, téléphone ou mot de passe..." 
              value={q} 
              onChange={e=>setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {/* SSID */}
        <div className="w-full lg:w-48 space-y-1.5">
          <Label className="text-xs text-muted-fg">Réseau Wi-Fi</Label>
          <Select value={ssidId} onValueChange={(val) => val && setSsidId(val)}>
            <SelectTrigger>
              <SelectValue>
                {ssidId === 'all' ? 'Tous les SSID' : ssids?.find(s => s.id.toString() === ssidId)?.name || 'Tous les SSID'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les SSID</SelectItem>
              {ssids?.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="w-full lg:w-36 space-y-1.5">
          <Label className="text-xs text-muted-fg">Statut</Label>
          <Select value={isActive} onValueChange={(val: any) => setIsActive(val)}>
            <SelectTrigger>
              <SelectValue>
                {isActive === 'all' ? 'Tous' : isActive === 'active' ? 'Actives' : 'Inactives'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actives</SelectItem>
              <SelectItem value="inactive">Inactives</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range */}
        <div className="flex w-full lg:w-auto gap-2 items-end">
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-muted-fg">Du</Label>
            <div className="relative">
              <Input 
                type="date" 
                value={dateFrom} 
                onChange={e=>setDateFrom(e.target.value)}
                className="w-full lg:w-36"
              />
            </div>
          </div>
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-muted-fg">Au</Label>
            <Input 
              type="date" 
              value={dateTo} 
              onChange={e=>setDateTo(e.target.value)}
              className="w-full lg:w-36"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
