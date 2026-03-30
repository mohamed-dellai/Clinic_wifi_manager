import { NextResponse } from 'next/server'
import { eachDayOfInterval, format } from 'date-fns'
import prisma from '@/lib/prisma'
import { parseRange, requireAdmin } from '../_utils'

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

    const counts = new Map<string, number>()
    for (const session of sessions) {
      const key = format(session.createdAt, 'yyyy-MM-dd')
      counts.set(key, (counts.get(key) || 0) + 1)
    }

    const points = eachDayOfInterval({ start: from, end: to }).map((day) => {
      const key = format(day, 'yyyy-MM-dd')
      return { date: key, count: counts.get(key) || 0 }
    })

    return NextResponse.json({
      points,
      range: { from: from.toISOString(), to: to.toISOString(), days },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
