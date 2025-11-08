import { NextRequest, NextResponse } from 'next/server';
import {
  createContact,
  getAllContacts,
  searchContacts,
  updateContact,
  deleteMultipleContacts,
  getContactStats,
} from '@/lib/db/contacts';
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

    // Get query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const stats = url.searchParams.get('stats');

    if (stats === 'true') {
      const contactStats = await getContactStats();
      return NextResponse.json(contactStats);
    }

    let contacts;
    if (search) {
      contacts = await searchContacts(search);
    } else {
      contacts = await getAllContacts();
    }

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
        { status: 400 }
      );
    }

    // Create contact
    const newContact = await createContact({
      name: body.name,
      phone: body.phone,
      email: body.email,
      status: body.status || 'active',
      labels: body.labels || [],
      notes: body.notes || '',
      company: body.company,
      tags: body.tags || [],
      lastInteraction: body.lastInteraction || null,
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('Create contact error:', error);
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

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Update contact
    await updateContact(body.id, {
      name: body.name,
      phone: body.phone,
      email: body.email,
      company: body.company,
      status: body.status,
      labels: body.labels,
      notes: body.notes,
      lastInteraction: body.lastInteraction,
    });

    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    console.error('Update contact error:', error);
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

    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: 'Contact IDs are required' },
        { status: 400 }
      );
    }

    // Delete contacts
    await deleteMultipleContacts(body.ids);

    return NextResponse.json({
      success: true,
      deleted: body.ids.length,
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
