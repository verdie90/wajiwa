import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth/auth';

export async function middleware(request: NextRequest) {
  const cookieString = request.headers.get('cookie') || '';
  const token = extractTokenFromCookie(cookieString);

  // Public routes yang tidak memerlukan auth
  const publicRoutes = ['/auth/login', '/api/auth/login', '/api/health'];
  const pathname = request.nextUrl.pathname;

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Jika tidak ada token dan bukan public route, redirect ke login
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const session = await verifyToken(token);

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Add session to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.userId);
  requestHeaders.set('x-user-role', session.role);
  requestHeaders.set('x-user-email', session.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
