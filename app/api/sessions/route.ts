import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyJwt } from '../../../lib/auth'
import cookie from 'cookie'

function makePassword(length = 8){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let out = ''
  for(let i=0;i<length;i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export async function GET(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Admins can see all sessions; secretaries see only their own
    const where = payload.role === 'ADMIN' ? {} : { createdById: payload.userId }
    const sessions = await prisma.wifiPassword.findMany({
      where,
      include: {
        patient: true,
        ssid: true,
        createdBy: { select: { id: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ sessions })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, phone, duration, unit, type, ssidId } = body
  if(!phone || !duration || !unit) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // find or create patient by phone
    let patient = await prisma.patient.findUnique({ where: { phone } })
    if(!patient){
      patient = await prisma.patient.create({ data: { name: name || phone, phone, type: type || 'REGULAR' } })
    }

    const pwd = makePassword(8)

    // determine ssidId: prefer provided ssidId, otherwise pick the first SSID owned by the user
    let chosenSsidId: number | null = ssidId ? Number(ssidId) : null
    if(!chosenSsidId){
      const first = await prisma.ssid.findFirst({ where: { createdById: payload.userId } })
      if(first) chosenSsidId = first.id
    }

    if(!chosenSsidId) return NextResponse.json({ error: 'No SSID available. Create an SSID first.' }, { status: 400 })

    const created = await prisma.wifiPassword.create({
      data: {
        password: pwd,
        patientId: patient.id,
        createdById: payload.userId,
        duration: Number(duration),
        unit: unit,
        ssidId: chosenSsidId,
      },
      include: { patient: true, ssid: true }
    })

    return NextResponse.json({ ok: true, session: created })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { id } = body
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const existing = await prisma.wifiPassword.findUnique({ where: { id: Number(id) } })
    if(!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // allow admins or the creator to delete
    if(payload.role !== 'ADMIN' && existing.createdById !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.wifiPassword.delete({ where: { id: Number(id) } })
    return NextResponse.json({ ok: true })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
