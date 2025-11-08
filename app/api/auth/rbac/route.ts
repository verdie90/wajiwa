import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
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

    // Get user from Firestore to get their permissions
    const userDoc = await adminDb.collection('users').doc(session.userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    let permissions = userData?.permissions || [];

    // If user has a role field, fetch permissions from role
    if (userData?.role) {
      const roleQuery = await adminDb
        .collection('roles')
        .where('name', '==', userData.role)
        .limit(1)
        .get();

      if (!roleQuery.empty) {
        const roleData = roleQuery.docs[0].data();
        permissions = roleData?.permissions || permissions;
      }
    }

    // Get all available routes/features for this user
    const availableResources = permissions.map((perm) => (perm as Record<string, string>).resource);
    const uniqueResources = [...new Set(availableResources)];

    return NextResponse.json({
      role: userData?.role,
      permissions,
      availableResources: uniqueResources,
    });
  } catch (error) {
    console.error('RBAC check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
