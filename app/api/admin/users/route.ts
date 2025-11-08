import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    // Basic auth check (middleware already did this)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can view all users' },
        { status: 403 }
      );
    }

    // Fetch all users
    const snapshot = await adminDb.collection('users').get();
    const users: Record<string, unknown>[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Don't expose passwords
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeData } = data;
      users.push({
        id: doc.id,
        ...safeData,
      });
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');

    // Only admin can create users
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create users' },
        { status: 403 }
      );
    }

    const { email, name, role } = await request.json();

    // Validate input
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingQuery = await adminDb
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user (temporary password - should be sent via email)
    const now = new Date();
    const newUser = {
      email: email.toLowerCase(),
      name,
      role,
      password: '', // Empty for now, user should set their own
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await adminDb.collection('users').add(newUser);

    return NextResponse.json(
      {
        id: ref.id,
        ...newUser,
        password: undefined, // Don't return password
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
