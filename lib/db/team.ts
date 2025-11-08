import { adminDb } from '@/lib/firebase/admin';
import type { User } from '@/types';

// Get all team members
export async function getTeamMembers(): Promise<User[]> {
  const snapshot = await adminDb
    .collection('users')
    .orderBy('createdAt', 'desc')
    .get();

  const users: User[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      lastLogin: data.lastLogin?.toDate?.() || null,
    } as User);
  });

  return users;
}

// Get team member by ID
export async function getTeamMember(id: string): Promise<User | null> {
  const doc = await adminDb.collection('users').doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    lastLogin: data.lastLogin?.toDate?.() || null,
  } as User;
}

// Search team members by name or email
export async function searchTeamMembers(query: string): Promise<User[]> {
  if (!query.trim()) {
    return getTeamMembers();
  }

  const queryLower = query.toLowerCase();

  const snapshot = await adminDb
    .collection('users')
    .orderBy('name')
    .startAt(queryLower)
    .endAt(queryLower + '\uf8ff')
    .get();

  const users: User[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    // Additional client-side filtering for email
    if (
      data.name.toLowerCase().includes(queryLower) ||
      data.email?.toLowerCase().includes(queryLower)
    ) {
      users.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        lastLogin: data.lastLogin?.toDate?.() || null,
      } as User);
    }
  });

  return users;
}

// Update team member role and status
export async function updateTeamMember(
  id: string,
  updates: Partial<Pick<User, 'role' | 'isActive' | 'avatar'>>
): Promise<void> {
  await adminDb
    .collection('users')
    .doc(id)
    .update({
      ...updates,
      updatedAt: new Date(),
    });
}

// Deactivate team member (soft delete)
export async function deactivateTeamMember(id: string): Promise<void> {
  await adminDb
    .collection('users')
    .doc(id)
    .update({
      isActive: false,
      updatedAt: new Date(),
    });
}

// Reactivate team member
export async function reactivateTeamMember(id: string): Promise<void> {
  await adminDb
    .collection('users')
    .doc(id)
    .update({
      isActive: true,
      updatedAt: new Date(),
    });
}

// Remove team member permanently
export async function removeTeamMember(id: string): Promise<void> {
  await adminDb.collection('users').doc(id).delete();
}

// Remove multiple team members
export async function removeMultipleTeamMembers(ids: string[]): Promise<void> {
  const batch = adminDb.batch();

  ids.forEach((id) => {
    batch.delete(adminDb.collection('users').doc(id));
  });

  await batch.commit();
}

// Get team statistics
export async function getTeamStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}> {
  const snapshot = await adminDb.collection('users').get();

  let total = 0;
  let active = 0;
  let inactive = 0;
  const byRole: Record<string, number> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    total++;

    if (data.isActive) {
      active++;
    } else {
      inactive++;
    }

    const role = data.role || 'user';
    byRole[role] = (byRole[role] || 0) + 1;
  });

  return { total, active, inactive, byRole };
}

// Get members by role
export async function getTeamMembersByRole(role: string): Promise<User[]> {
  const snapshot = await adminDb
    .collection('users')
    .where('role', '==', role)
    .get();

  const users: User[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      lastLogin: data.lastLogin?.toDate?.() || null,
    } as User);
  });

  return users;
}

// Change user role
export async function changeTeamMemberRole(
  id: string,
  newRole: string
): Promise<void> {
  // Validate role
  const validRoles = ['admin', 'manager', 'user', 'agent', 'owner'];
  if (!validRoles.includes(newRole)) {
    throw new Error(`Invalid role: ${newRole}`);
  }

  await adminDb
    .collection('users')
    .doc(id)
    .update({
      role: newRole,
      updatedAt: new Date(),
    });
}
