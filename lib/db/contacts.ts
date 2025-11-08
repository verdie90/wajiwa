import { adminDb } from '@/lib/firebase/admin';
import type { Contact } from '@/types';

// Create a new contact
export async function createContact(
  data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contact> {
  const now = new Date();
  const contactData = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await adminDb.collection('contacts').add(contactData);

  return {
    id: ref.id,
    ...contactData,
  } as Contact;
}

// Get contact by ID
export async function getContactById(id: string): Promise<Contact | null> {
  const doc = await adminDb.collection('contacts').doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate?.() || new Date(),
    updatedAt: doc.data()?.updatedAt?.toDate?.() || new Date(),
  } as Contact;
}

// Get all contacts
export async function getAllContacts(): Promise<Contact[]> {
  const snapshot = await adminDb
    .collection('contacts')
    .orderBy('createdAt', 'desc')
    .get();

  const contacts: Contact[] = [];
  snapshot.forEach((doc) => {
    contacts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Contact);
  });

  return contacts;
}

// Search contacts by name or phone
export async function searchContacts(query: string): Promise<Contact[]> {
  if (!query.trim()) {
    return getAllContacts();
  }

  const queryLower = query.toLowerCase();

  const snapshot = await adminDb
    .collection('contacts')
    .orderBy('name')
    .startAt(queryLower)
    .endAt(queryLower + '\uf8ff')
    .get();

  const contacts: Contact[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    // Additional client-side filtering for phone
    if (
      data.name.toLowerCase().includes(queryLower) ||
      data.phone?.includes(query)
    ) {
      contacts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Contact);
    }
  });

  return contacts;
}

// Update contact
export async function updateContact(
  id: string,
  updates: Partial<Omit<Contact, 'id' | 'createdAt'>>
): Promise<void> {
  await adminDb
    .collection('contacts')
    .doc(id)
    .update({
      ...updates,
      updatedAt: new Date(),
    });
}

// Delete contact
export async function deleteContact(id: string): Promise<void> {
  await adminDb.collection('contacts').doc(id).delete();
}

// Delete multiple contacts
export async function deleteMultipleContacts(ids: string[]): Promise<void> {
  const batch = adminDb.batch();

  ids.forEach((id) => {
    batch.delete(adminDb.collection('contacts').doc(id));
  });

  await batch.commit();
}

// Get contacts by label
export async function getContactsByLabel(label: string): Promise<Contact[]> {
  const snapshot = await adminDb
    .collection('contacts')
    .where('labels', 'array-contains', label)
    .get();

  const contacts: Contact[] = [];
  snapshot.forEach((doc) => {
    contacts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Contact);
  });

  return contacts;
}

// Get contact statistics
export async function getContactStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
}> {
  const snapshot = await adminDb.collection('contacts').get();

  let total = 0;
  let active = 0;
  let inactive = 0;

  snapshot.forEach((doc) => {
    total++;
    if (doc.data().status === 'active') {
      active++;
    } else {
      inactive++;
    }
  });

  return { total, active, inactive };
}
