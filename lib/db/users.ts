import { adminDb } from '@/lib/firebase/admin';
import type { User, Role, UserPermission } from '@/types';
import { hashPassword } from '@/lib/auth/auth';

// Users
export async function getUserByEmail(email: string): Promise<User | null> {
  const snapshot = await adminDb
    .collection('users')
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.(),
    updatedAt: doc.data().updatedAt?.toDate?.(),
  } as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const doc = await adminDb.collection('users').doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate?.(),
    updatedAt: doc.data()?.updatedAt?.toDate?.(),
  } as User;
}

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: string = 'user'
): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const now = new Date();

  const user: Omit<User, 'id'> = {
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    role: role as User['role'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await adminDb.collection('users').add(user);

  return {
    id: ref.id,
    ...user,
  };
}

export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<void> {
  await adminDb
    .collection('users')
    .doc(id)
    .update({
      ...updates,
      updatedAt: new Date(),
    });
}

export async function listUsers(): Promise<User[]> {
  const snapshot = await adminDb.collection('users').get();
  const users: User[] = [];
  
  snapshot.forEach((doc) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = doc.data() as any;
    users.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as User);
  });

  return users;
}

// Roles
export async function getRoleByName(name: string): Promise<Role | null> {
  const snapshot = await adminDb
    .collection('roles')
    .where('name', '==', name)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.(),
    updatedAt: doc.data().updatedAt?.toDate?.(),
  } as Role;
}

export async function createRole(
  name: string,
  description: string,
  permissions: UserPermission[]
): Promise<Role> {
  const now = new Date();

  const role: Omit<Role, 'id'> = {
    name,
    description,
    permissions,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await adminDb.collection('roles').add(role);

  return {
    id: ref.id,
    ...role,
  };
}

export async function listRoles(): Promise<Role[]> {
  const snapshot = await adminDb.collection('roles').get();
  const roles: Role[] = [];

  snapshot.forEach((doc) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = doc.data() as any;
    roles.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as Role);
  });

  return roles;
}

// Permissions
export async function getPermissionsByRole(roleId: string): Promise<UserPermission[]> {
  const doc = await adminDb.collection('roles').doc(roleId).get();

  if (!doc.exists) return [];

  return doc.data()?.permissions || [];
}

export async function updateLastLogin(userId: string): Promise<void> {
  await adminDb.collection('users').doc(userId).update({
    lastLogin: new Date(),
  });
}
