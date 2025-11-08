import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieString = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieString);

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
