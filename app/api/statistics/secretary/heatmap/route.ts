import { NextResponse } from 'next/server'
import { getDay, getHours } from 'date-fns'
import prisma from '@/lib/prisma'
import { parseRange, requireAdmin } from '../_utils'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { from, to, days } = parseRange(req)
    const sessions = await prisma.wifiPassword.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: { createdAt: true },
    })

    const matrix = Array.from({ length: 7 }, () => Array(24).fill(0))
    for (const session of sessions) {
      const jsDay = getDay(session.createdAt)
      const day = (jsDay + 6) % 7
      const hour = getHours(session.createdAt)
      matrix[day][hour] += 1
    }

    const cells: Array<{ day: number; hour: number; count: number }> = []
    for (let day = 0; day < 7; day += 1) {
      for (let hour = 0; hour < 24; hour += 1) {
        cells.push({ day, hour, count: matrix[day][hour] })
      }
    }

    return NextResponse.json({
      days: DAY_LABELS,
      hours: Array.from({ length: 24 }, (_, idx) => idx),
      cells,
      range: { from: from.toISOString(), to: to.toISOString(), days },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
