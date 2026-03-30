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
      select: { patientId: true },
    })

    const counts = new Map<number, number>()
    for (const session of sessions) {
      counts.set(session.patientId, (counts.get(session.patientId) || 0) + 1)
    }

    const recurring = Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

    const ids = recurring.map(([id]) => id)
    const patients = await prisma.patient.findMany({
      where: { id: { in: ids } },
      select: { id: true, phone: true, name: true },
    })
    const byId = new Map(patients.map((p) => [p.id, p]))

    const items = recurring.map(([id, count]) => ({
      patientId: id,
      phone: byId.get(id)?.phone || '',
      name: byId.get(id)?.name || '',
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
