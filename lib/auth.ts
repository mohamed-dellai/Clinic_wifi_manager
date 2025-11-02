import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function hashPassword(plain: string){
  return bcrypt.hashSync(plain, 10)
}

export function comparePassword(plain: string, hash: string){
  return bcrypt.compareSync(plain, hash)
}

export function signJwt(payload: object, options?: jwt.SignOptions){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...(options || {}) })
}

export function verifyJwt<T = any>(token: string){
  try{
    return jwt.verify(token, JWT_SECRET) as T
  }catch(e){
    return null
  }
}

export function createAuthCookie(token: string){
  return cookie.serialize('clinic_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearAuthCookie(){
  return cookie.serialize('clinic_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
