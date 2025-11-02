import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyJwt } from '../../../lib/auth'
import cookie from 'cookie'
import bcrypt from 'bcryptjs'

export async function GET(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if(payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ users })
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
    if(payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { email, password, role } = body
    if(!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const hashed = bcrypt.hashSync(password, 10)
    const created = await prisma.user.create({ data: { email, password: hashed, role: role || 'SECRETARY' } })
    return NextResponse.json({ ok: true, user: created })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    const payload: any = token ? verifyJwt(token) : null
    if(!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if(payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id, email, password, role } = body
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const data: any = {}
    if(email) data.email = email
    if(role) data.role = role
    if(password) data.password = bcrypt.hashSync(password, 10)

    const updated = await prisma.user.update({ where: { id: Number(id) }, data })
    return NextResponse.json({ ok: true, user: updated })
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
    if(payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id } = body
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.user.delete({ where: { id: Number(id) } })
    return NextResponse.json({ ok: true })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
