import { NextRequest, NextResponse } from 'next/server';
import {
  getTeamMembers,
  searchTeamMembers,
  updateTeamMember,
  deactivateTeamMember,
  reactivateTeamMember,
  removeMultipleTeamMembers,
  getTeamStats,
  changeTeamMemberRole,
} from '@/lib/db/team';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieString = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieString);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access team management
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const stats = url.searchParams.get('stats');

    if (stats === 'true') {
      const teamStats = await getTeamStats();
      return NextResponse.json(teamStats);
    }

    let members;
    if (search) {
      members = await searchTeamMembers(search);
    } else {
      members = await getTeamMembers();
    }

    return NextResponse.json(members);
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieString = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieString);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update team
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Handle different update types
    if (body.action === 'role') {
      if (!body.role) {
        return NextResponse.json(
          { error: 'Role is required' },
          { status: 400 }
        );
      }
      await changeTeamMemberRole(body.id, body.role);
    } else if (body.action === 'deactivate') {
      await deactivateTeamMember(body.id);
    } else if (body.action === 'reactivate') {
      await reactivateTeamMember(body.id);
    } else {
      // Generic update
      await updateTeamMember(body.id, {
        role: body.role,
        isActive: body.isActive,
      });
    }

    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieString = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieString);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete team members
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: 'Member IDs are required' },
        { status: 400 }
      );
    }

    // Remove team members
    await removeMultipleTeamMembers(body.ids);

    return NextResponse.json({
      success: true,
      deleted: body.ids.length,
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
