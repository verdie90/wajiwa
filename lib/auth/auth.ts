import bcryptjs from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { AuthSession } from '@/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key');

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

export async function signToken(payload: Omit<AuthSession, 'iat' | 'exp'>) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours

  return new SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AuthSession;
  } catch {
    return null;
  }
}

export function extractTokenFromCookie(cookieString: string): string | null {
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}
