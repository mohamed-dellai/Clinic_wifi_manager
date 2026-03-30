"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TypographySmall } from '@/components/ui/typography'

type RangeMeta = { from: string; to: string; days: number }

type Kpis = {
  totalPasswords: number
  uniquePatients: number
  activeSessions: number
  range: RangeMeta
}

type TopSecretaries = {
  items: Array<{ userId: number; email: string; count: number }>
  range: RangeMeta
}

type RecurringPatients = {
  items: Array<{ patientId: number; phone: string; name: string; count: number }>
  range: RangeMeta
}

type TimeSeries = {
  points: Array<{ date: string; count: number }>
  range: RangeMeta
}

type Heatmap = {
  days: string[]
  hours: number[]
  cells: Array<{ day: number; hour: number; count: number }>
  range: RangeMeta
}

type BySsid = {
  items: Array<{ ssidId: number | null; name: string; count: number }>
  range: RangeMeta
}

const RANGE_OPTIONS = [
  { label: '7 j', value: '7d' },
  { label: '30 j', value: '30d' },
  { label: '90 j', value: '90d' },
]

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Erreur de chargement')
  return data as T
}

export default function StatisticSecretaireDashboard() {
  const [range, setRange] = useState('30d')
  const [customFrom, setCustomFrom] = useState(() =>
    format(subDays(new Date(), 29), 'yyyy-MM-dd')
  )
  const [customTo, setCustomTo] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [appliedFrom, setAppliedFrom] = useState(customFrom)
  const [appliedTo, setAppliedTo] = useState(customTo)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [topSecretaries, setTopSecretaries] = useState<TopSecretaries | null>(null)
  const [recurringPatients, setRecurringPatients] = useState<RecurringPatients | null>(null)
  const [timeSeries, setTimeSeries] = useState<TimeSeries | null>(null)
  const [heatmap, setHeatmap] = useState<Heatmap | null>(null)
  const [bySsid, setBySsid] = useState<BySsid | null>(null)
  const heatmapRef = useRef<HTMLDivElement | null>(null)
  const [heatmapTooltip, setHeatmapTooltip] = useState<{
    x: number
    y: number
    label: string
  } | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    const query =
      range === 'custom'
        ? `from=${encodeURIComponent(appliedFrom)}&to=${encodeURIComponent(appliedTo)}`
        : `range=${range}`
    Promise.all([
      fetchJson<Kpis>(`/api/statistics/secretary/kpis?${query}`),
      fetchJson<TopSecretaries>(`/api/statistics/secretary/top-secretaries?${query}&limit=5`),
      fetchJson<RecurringPatients>(`/api/statistics/secretary/recurring-patients?${query}&limit=5`),
      fetchJson<TimeSeries>(`/api/statistics/secretary/time-series?${query}`),
      fetchJson<Heatmap>(`/api/statistics/secretary/heatmap?${query}`),
      fetchJson<BySsid>(`/api/statistics/secretary/by-ssid?${query}&limit=6`),
    ])
      .then(([
        kpisData,
        topSecretariesData,
        recurringPatientsData,
        timeSeriesData,
        heatmapData,
        bySsidData,
      ]) => {
        if (!mounted) return
        setKpis(kpisData)
        setTopSecretaries(topSecretariesData)
        setRecurringPatients(recurringPatientsData)
        setTimeSeries(timeSeriesData)
        setHeatmap(heatmapData)
        setBySsid(bySsidData)
        setLoading(false)
      })
      .catch((err) => {
        if (!mounted) return
        console.error(err)
        setError(err?.message || 'Erreur réseau')
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [range, appliedFrom, appliedTo])

  const rangeLabel = useMemo(() => {
    if (!kpis?.range) return ''
    const from = format(parseISO(kpis.range.from), 'dd/MM/yyyy')
    const to = format(parseISO(kpis.range.to), 'dd/MM/yyyy')
    return `${from} – ${to}`
  }, [kpis?.range])

  const heatmapState = useMemo(() => {
    if (!heatmap) return { matrix: [], max: 0 }
    const matrix = Array.from({ length: heatmap.days.length }, () => Array(24).fill(0))
    for (const cell of heatmap.cells) {
      if (matrix[cell.day]) matrix[cell.day][cell.hour] = cell.count
    }
    const max = Math.max(1, ...heatmap.cells.map((cell) => cell.count))
    return { matrix, max }
  }, [heatmap])

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (loading || !kpis || !topSecretaries || !recurringPatients || !timeSeries || !heatmap || !bySsid) {
    return <div className="text-sm text-muted-fg animate-pulse">Chargement des statistiques…</div>
  }

  const topSecretariesData = topSecretaries.items.map((item) => ({
    label: item.email,
    count: item.count,
  }))

  const bySsidData = bySsid.items.map((item) => ({
    label: item.name,
    count: item.count,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <TypographySmall className="text-muted-fg">
            Période: {rangeLabel}
          </TypographySmall>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={range === option.value ? 'default' : 'secondary'}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
          <div className="flex items-center gap-2 rounded-md border px-2 py-1">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none"
            />
            <span className="text-xs text-muted-fg">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none"
            />
            <Button
              size="sm"
              variant={range === 'custom' ? 'default' : 'secondary'}
              onClick={() => {
                setAppliedFrom(customFrom)
                setAppliedTo(customTo)
                setRange('custom')
              }}
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de mots de passe émis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.totalPasswords}</div>
            <TypographySmall className="text-muted-fg mt-1">
              Sur la période sélectionnée
            </TypographySmall>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.uniquePatients}</div>
            <TypographySmall className="text-muted-fg mt-1">
              Comptés par téléphone
            </TypographySmall>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.activeSessions}</div>
            <TypographySmall className="text-muted-fg mt-1">
              Non expirées actuellement
            </TypographySmall>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mots de passe émis — au fil du temps</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {timeSeries.points.length === 0 ? (
              <div className="text-sm text-muted-fg">Aucune donnée.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries.points}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => format(parseISO(value), 'dd/MM/yyyy')}
                    formatter={(value) => [`${value}`, 'Sessions']}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carte thermique — pics d&apos;utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto relative" ref={heatmapRef}>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: '70px repeat(24, minmax(18px, 1fr))' }}
              >
                <div />
                {heatmap.hours.map((hour) => (
                  <div key={`hour-${hour}`} className="text-[10px] text-muted-fg text-center">
                    {hour}
                  </div>
                ))}
                {heatmap.days.map((dayLabel, dayIndex) => (
                  <React.Fragment key={`day-${dayLabel}`}>
                    <div className="text-xs text-muted-fg pr-2">{dayLabel}</div>
                    {heatmap.hours.map((hour) => {
                      const count = heatmapState.matrix[dayIndex]?.[hour] || 0
                      const intensity = count / (heatmapState.max || 1)
                      const bg = `rgba(37, 99, 235, ${0.1 + intensity * 0.8})`
                      const label = `${dayLabel} ${hour}h — ${count} mots de passe`
                      return (
                        <div
                          key={`cell-${dayIndex}-${hour}`}
                          className="h-6 rounded-sm"
                          onMouseEnter={(event) => {
                            const rect = heatmapRef.current?.getBoundingClientRect()
                            if (!rect) return
                            setHeatmapTooltip({
                              x: event.clientX - rect.left + 8,
                              y: event.clientY - rect.top + 8,
                              label,
                            })
                          }}
                          onMouseMove={(event) => {
                            const rect = heatmapRef.current?.getBoundingClientRect()
                            if (!rect) return
                            setHeatmapTooltip((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    x: event.clientX - rect.left + 8,
                                    y: event.clientY - rect.top + 8,
                                  }
                                : prev
                            )
                          }}
                          onMouseLeave={() => setHeatmapTooltip(null)}
                          style={{ backgroundColor: bg }}
                        />
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
              {heatmapTooltip && (
                <div
                  className="pointer-events-none absolute z-10 rounded-md border bg-background px-2 py-1 text-xs shadow-md"
                  style={{ left: heatmapTooltip.x, top: heatmapTooltip.y }}
                >
                  {heatmapTooltip.label}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mots de passe par secrétaire</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {topSecretariesData.length === 0 ? (
              <div className="text-sm text-muted-fg">Aucune donnée.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSecretariesData} margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}`, 'Sessions']} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients récurrents</CardTitle>
          </CardHeader>
          <CardContent>
            {recurringPatients.items.length === 0 ? (
              <div className="text-sm text-muted-fg">Aucune donnée.</div>
            ) : (
              <div className="space-y-3">
                {recurringPatients.items.map((item) => (
                  <div
                    key={item.patientId}
                    className="flex items-center justify-between rounded-md border px-4 py-3"
                  >
                    <div>
                      <div className="font-medium">{item.phone || '—'}</div>
                      <div className="text-sm text-muted-fg">{item.name || '—'}</div>
                    </div>
                    <div className="text-sm font-semibold">{item.count}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mots de passe par SSID (top)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {bySsidData.length === 0 ? (
            <div className="text-sm text-muted-fg">Aucune donnée.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySsidData} margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}`, 'Sessions']} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
