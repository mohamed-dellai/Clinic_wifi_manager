import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseLimit, parseRange, requireAdmin } from '../_utils'

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { from, to, days } = parseRange(req)
    const { limit } = parseLimit(req)

    const sessions = await prisma.wifiPassword.findMany({
      where: {
        createdAt: { gte: from, lte: to },
        ssidId: { not: null },
      },
      select: { ssidId: true },
    })

    const counts = new Map<number, number>()
    for (const session of sessions) {
      if (session.ssidId == null) continue
      counts.set(session.ssidId, (counts.get(session.ssidId) || 0) + 1)
    }

    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

    const ids = sorted.map(([id]) => id)
    const ssids = await prisma.ssid.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    })
    const byId = new Map(ssids.map((s) => [s.id, s]))

    const items = sorted.map(([id, count]) => ({
      ssidId: id,
      name: byId.get(id)?.name || 'SSID',
      count,
    }))

    return NextResponse.json({
      items,
      range: { from: from.toISOString(), to: to.toISOString(), days },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
