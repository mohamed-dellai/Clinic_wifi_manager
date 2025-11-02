import { NextResponse } from 'next/server'
import { clearAuthCookie } from '../../../../lib/auth'

export async function POST(req: Request){
  const cookie = clearAuthCookie()
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
const protocol = req.headers.get('x-forwarded-proto') || 'https'
const loginUrl = `${protocol}://${host}/login`

const res = NextResponse.redirect(loginUrl, 303)
  res.headers.set('Set-Cookie', cookie)
  return res
}
