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
      where: { createdAt: { gte: from, lte: to } },
      select: { createdById: true },
    })

    const counts = new Map<number, number>()
    for (const session of sessions) {
      counts.set(session.createdById, (counts.get(session.createdById) || 0) + 1)
    }

    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

    const ids = sorted.map(([id]) => id)
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true },
    })
    const byId = new Map(users.map((u) => [u.id, u]))

    const items = sorted.map(([id, count]) => ({
      userId: id,
      email: byId.get(id)?.email || 'Utilisateur',
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
