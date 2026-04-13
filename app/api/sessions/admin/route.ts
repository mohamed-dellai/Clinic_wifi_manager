import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyJwt } from '../../../../lib/auth'
import cookie from 'cookie'

export async function PATCH(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if(payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id, duration, unit } = body
    if(!id || !duration || !unit) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const existing = await prisma.wifiPassword.findUnique({ where: { id: Number(id) } })
    if(!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.wifiPassword.update({ where: { id: Number(id) }, data: { duration: Number(duration), unit } })
    return NextResponse.json({ ok: true, session: updated })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
