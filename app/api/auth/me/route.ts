import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyJwt } from '../../../../lib/auth'
import cookie from 'cookie'

export async function GET(req: Request){
  try{
    const header = req.headers.get('cookie') || ''
    const parsed = cookie.parse(header || '')
    const token = parsed['clinic_token']
    if(!token) return NextResponse.json({ user: null }, { status: 200 })

    const payload: any = verifyJwt(token)
    if(!payload) return NextResponse.json({ user: null }, { status: 200 })

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if(!user) return NextResponse.json({ user: null }, { status: 200 })

    const safe = { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt }
    return NextResponse.json({ user: safe }, { status: 200 })
  }catch(err){
    console.error(err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
