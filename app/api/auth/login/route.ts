import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { comparePassword, signJwt, createAuthCookie } from '../../../../lib/auth'

export async function POST(req: Request){
  try{
    const body = await req.json()
    const { email, password } = body
    if(!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = comparePassword(password, user.password)
    if(!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signJwt({ userId: user.id, role: user.role })
    const cookie = createAuthCookie(token)

    return NextResponse.json({ ok: true, role: user.role }, { status: 200, headers: { 'Set-Cookie': cookie } })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
