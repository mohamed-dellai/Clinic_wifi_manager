import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyJwt } from '../../../lib/auth'
import cookie from 'cookie'

export async function GET(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Return all SSIDs to authenticated users so secretaries can select any available access point.
  const ssids = await prisma.ssid.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ ssids })
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
    const { name, description } = body
    if(!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const created = await prisma.ssid.create({ data: { name, description: description || null, createdById: payload.userId } })
    return NextResponse.json({ ok: true, ssid: created })
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

    // Admins can delete any SSID; others may delete only their own
    const ssid = await prisma.ssid.findUnique({ where: { id: Number(id) } })
    if(!ssid) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if(payload.role !== 'ADMIN' && ssid.createdById !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.ssid.delete({ where: { id: Number(id) } })
    return NextResponse.json({ ok: true })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
