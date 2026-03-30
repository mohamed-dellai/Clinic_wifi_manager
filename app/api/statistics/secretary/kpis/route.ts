import { NextResponse } from 'next/server'
import { add } from 'date-fns'
import prisma from '@/lib/prisma'
import { parseRange, requireAdmin } from '../_utils'

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { from, to, days } = parseRange(req)
    const [totalPasswords, patientRows, candidates] = await prisma.$transaction([
      prisma.wifiPassword.count({ where: { createdAt: { gte: from, lte: to } } }),
      prisma.wifiPassword.findMany({
        where: { createdAt: { gte: from, lte: to } },
        select: { patientId: true },
      }),
      prisma.wifiPassword.findMany({
        select: { createdAt: true, duration: true, unit: true },
      }),
    ])

    const uniquePatients = new Set(patientRows.map((row) => row.patientId)).size

    const now = new Date()
    const activeSessions = candidates.reduce((total, session) => {
      let expiration: Date | null = null
      if (session.unit === 'HOURS') {
        expiration = add(session.createdAt, { hours: session.duration })
      } else if (session.unit === 'DAYS') {
        expiration = add(session.createdAt, { days: session.duration })
      }
      if (expiration && expiration > now) return total + 1
      return total
    }, 0)

    return NextResponse.json({
      totalPasswords,
      uniquePatients,
      activeSessions,
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
        days,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
