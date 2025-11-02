import { NextResponse } from 'next/server'
import { clearAuthCookie } from '../../../../lib/auth'

export async function POST(req: Request){
  const cookie = clearAuthCookie()
  // Redirect to login after clearing the auth cookie. Use 303 to convert POST -> GET.
  const res = NextResponse.redirect(new URL('/login', req.url), 303)
  res.headers.set('Set-Cookie', cookie)
  return res
}
