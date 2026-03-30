import cookie from 'cookie'
import { subDays, startOfDay, endOfDay, differenceInCalendarDays } from 'date-fns'
import { verifyJwt } from '@/lib/auth'

export function requireAdmin(req: Request) {
  const header = req.headers.get('cookie') || ''
  const parsed = cookie.parse(header || '')
  const token = parsed['clinic_token']
  const payload: any = token ? verifyJwt(token) : null
  if (!payload) {
    return { ok: false as const, status: 401, error: 'Unauthorized' }
  }
  if (payload.role !== 'ADMIN') {
    return { ok: false as const, status: 403, error: 'Forbidden' }
  }
  return { ok: true as const, payload }
}

export function parseRange(req: Request, fallbackDays = 30) {
  const { searchParams } = new URL(req.url)
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')
  if (fromParam || toParam) {
    const rawFrom = fromParam ? new Date(fromParam) : null
    const rawTo = toParam ? new Date(toParam) : null
    const now = new Date()
    const safeFrom = rawFrom && !Number.isNaN(rawFrom.getTime()) ? startOfDay(rawFrom) : null
    const safeTo = rawTo && !Number.isNaN(rawTo.getTime()) ? endOfDay(rawTo) : null
    const from = safeFrom || startOfDay(subDays(safeTo || now, fallbackDays - 1))
    const to = safeTo || endOfDay(now)
    const days = Math.max(1, differenceInCalendarDays(to, from) + 1)
    return { raw: 'custom', days, from, to }
  }
  const raw = searchParams.get('range') || `${fallbackDays}d`
  const match = raw.match(/^(\d{1,4})d$/i)
  const days = match
    ? Math.min(Math.max(parseInt(match[1], 10), 1), 3650)
    : fallbackDays
  const now = new Date()
  const from = startOfDay(subDays(now, days - 1))
  const to = endOfDay(now)
  return { raw, days, from, to }
}

export function parseLimit(req: Request, fallback = 5, max = 20) {
  const { searchParams } = new URL(req.url)
  const raw = searchParams.get('limit')
  const value = raw ? parseInt(raw, 10) : fallback
  const limit = Number.isFinite(value)
    ? Math.min(Math.max(value, 1), max)
    : fallback
  return { limit }
}
