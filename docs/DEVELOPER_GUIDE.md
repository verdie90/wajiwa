# Developer Guide - Extending Wajiwa

This guide helps developers extend and customize the Wajiwa Admin Dashboard.

## 🎯 Common Extension Tasks

### Task 1: Add a New Dashboard Page

#### Step 1: Create the Page Component

```typescript
// app/dashboard/new-feature/page.tsx
'use client'

import { useAuth } from '@/components/auth/auth-context'
import { RBACGuard } from '@/components/auth/rbac-guard'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function NewFeaturePage() {
  const { checkPermission } = useAuth()

  return (
    <DashboardLayout title='New Feature'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>New Feature</h1>

        {/* Only show for users with permission */}
        <RBACGuard
          resource='new-feature'
          action='read'>
          <div className='grid grid-cols-3 gap-4'>
            {/* Your content here */}
          </div>
        </RBACGuard>

        {/* Only show delete button for users with permission */}
        <RBACGuard
          resource='new-feature'
          action='delete'>
          <button>Delete Item</button>
        </RBACGuard>
      </div>
    </DashboardLayout>
  )
}
```

#### Step 2: Add Resource to Firestore Roles

In Firestore Console → `roles` collection → Edit each role:

```json
// For admin role, add:
{ "resource": "new-feature", "action": "read" },
{ "resource": "new-feature", "action": "create" },
{ "resource": "new-feature", "action": "update" },
{ "resource": "new-feature", "action": "delete" },

// For manager role, add:
{ "resource": "new-feature", "action": "read" },
{ "resource": "new-feature", "action": "create" },

// For agent role, add:
// (or nothing if they shouldn't access)
```

#### Step 3: Add Menu Item

```typescript
// components/layout/dashboard-header.tsx

const menuItems = [
  // ... existing items ...
  {
    href: '/dashboard/new-feature',
    label: 'New Feature',
    resource: 'new-feature',
    adminOnly: false,
  },
]
```

#### Step 4: Test

- Login with admin → Should see menu item and full access
- Login with manager → Should see if permissions match
- Login with agent → Should not see unless permissions added

---

### Task 2: Add a New API Endpoint

#### Step 1: Create Route File

```typescript
// app/api/new-feature/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { checkPermission } from '@/lib/auth/rbac'
import * as admin from 'firebase-admin'

const db = admin.firestore()

// GET: Fetch data
export async function GET(request: NextRequest) {
  // Middleware has already validated JWT and set headers
  const role = request.headers.get('x-user-role') || ''

  // Check permission
  if (!checkPermission(role, 'new-feature', 'read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Fetch from Firestore
    const snapshot = await db.collection('new-feature').get()
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create new item
export async function POST(request: NextRequest) {
  const role = request.headers.get('x-user-role') || ''

  if (!checkPermission(role, 'new-feature', 'create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate input
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create document
    const docRef = await db.collection('new-feature').add({
      name: body.name,
      description: body.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        id: docRef.id,
        name: body.name,
        description: body.description,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### Step 2: Update Type Definitions

```typescript
// types/index.ts

export interface NewFeatureItem {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}
```

#### Step 3: Test Endpoint

```bash
# Get items
curl -X GET http://localhost:3000/api/new-feature

# Create item
curl -X POST http://localhost:3000/api/new-feature \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Test"}'
```

---

### Task 3: Add Permission Checking to Existing Code

#### In Components

```typescript
import { RBACGuard } from '@/components/auth/rbac-guard'

// Hide entire component
;<RBACGuard
  resource='users'
  action='delete'>
  <DeleteButton />
</RBACGuard>

// Or check manually
const { checkPermission } = useAuth()
if (!checkPermission('users', 'delete')) {
  return <button disabled>Cannot delete</button>
}
```

#### In API Routes

```typescript
// Check permission
const role = request.headers.get('x-user-role') || ''
if (!checkPermission(role, 'resource', 'action')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

### Task 4: Create a New Role

#### Option 1: Via Firestore Console (Easiest)

1. Open Firestore Console
2. Go to `roles` collection
3. Click "Add document"
4. Enter document ID (e.g., "sales-manager")
5. Add fields:
   ```json
   {
     "name": "sales-manager",
     "description": "Sales team manager",
     "permissions": [
       { "resource": "dashboard", "action": "read" },
       { "resource": "campaigns", "action": "read" },
       { "resource": "campaigns", "action": "create" },
       { "resource": "crm", "action": "read" },
       { "resource": "crm", "action": "create" },
       { "resource": "crm", "action": "update" }
     ],
     "createdAt": (server timestamp),
     "updatedAt": (server timestamp)
   }
   ```

#### Option 2: Via Code

```typescript
// scripts/create-role.ts
import * as admin from 'firebase-admin'

async function createRole() {
  const db = admin.firestore()

  const roleData = {
    name: 'sales-manager',
    description: 'Sales team manager',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'campaigns', action: 'read' },
      { resource: 'campaigns', action: 'create' },
      { resource: 'crm', action: 'read' },
      { resource: 'crm', action: 'create' },
      { resource: 'crm', action: 'update' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await db.collection('roles').add(roleData)
  console.log('Role created:', docRef.id)
}

createRole()
```

---

### Task 5: Add User Activity Logging

#### Create Activity Logging Utility

```typescript
// lib/db/activity-logs.ts
import * as admin from 'firebase-admin'

export interface ActivityLog {
  userId: string
  action: string
  resource: string
  details?: Record<string, unknown>
  timestamp: Date
  ipAddress?: string
}

export async function logActivity(
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const db = admin.firestore()

  await db.collection('activity_logs').add({
    userId,
    action,
    resource,
    details,
    timestamp: new Date(),
    ipAddress,
  })
}
```

#### Use in API Routes

```typescript
// app/api/new-feature/route.ts
import { logActivity } from '@/lib/db/activity-logs'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || ''
  const ipAddress = request.headers.get('x-forwarded-for') || ''

  // ... permission check ...

  try {
    // Create item
    const docRef = await db.collection('new-feature').add(body)

    // Log activity
    await logActivity(
      userId,
      'CREATE',
      'new-feature',
      { itemId: docRef.id },
      ipAddress
    )

    return NextResponse.json({ id: docRef.id })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

---

### Task 6: Add Form Validation

```typescript
// lib/validation/forms.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
  role: z.enum(['admin', 'manager', 'agent']),
})

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name required'),
  message: z.string().min(10, 'Message required'),
  targetAudience: z.array(z.string()).min(1, 'Select audience'),
  scheduledAt: z.date().optional(),
})
```

#### Use in API

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate
  const result = createCampaignSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors }, { status: 400 })
  }

  // Process validated data
  const campaign = result.data
  // ...
}
```

---

### Task 7: Add Error Handling & Logging

```typescript
// lib/utils/error-handler.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
      details: null,
    }
  }

  return {
    statusCode: 500,
    message: 'Unknown error',
    details: error,
  }
}
```

#### Use in Routes

```typescript
import { AppError, handleError } from '@/lib/utils/error-handler'

export async function POST(request: NextRequest) {
  try {
    // ... logic ...
    if (!validCondition) {
      throw new AppError(400, 'Invalid input', { field: 'email' })
    }
  } catch (error) {
    const { statusCode, message, details } = handleError(error)
    return NextResponse.json(
      { error: message, details },
      { status: statusCode }
    )
  }
}
```

---

## 🏗️ Architecture Patterns

### Component Structure

```typescript
// Good: Separate concerns
export function MyComponent() {
  const { user, checkPermission } = useAuth()

  if (!checkPermission('resource', 'read')) {
    return <AccessDenied />
  }

  return <ComponentContent />
}
```

### API Route Structure

```typescript
// Good: Clear flow
export async function POST(request: NextRequest) {
  // 1. Authenticate
  const userId = request.headers.get('x-user-id')
  if (!userId) return Unauthorized()

  // 2. Authorize
  const role = request.headers.get('x-user-role')
  if (!checkPermission(role, 'resource', 'create')) {
    return Forbidden()
  }

  // 3. Validate
  const body = await request.json()
  if (!isValid(body)) return BadRequest()

  // 4. Process
  const result = await processRequest(body)

  // 5. Log
  await logActivity(userId, 'CREATE', 'resource')

  // 6. Return
  return Success(result)
}
```

---

## 📦 Best Practices

### 1. Type Safety

```typescript
// ✅ Good
interface User {
  id: string
  email: string
  role: 'admin' | 'manager' | 'agent'
}

// ❌ Bad
const user: any = fetchUser()
```

### 2. Permission Checking

```typescript
// ✅ Good - Always check on server
if (!checkPermission(role, 'users', 'delete')) {
  return Forbidden()
}

// ❌ Bad - Client-only check
if (userRole === 'admin') {
  await deleteUser() // No server check!
}
```

### 3. Error Handling

```typescript
// ✅ Good
try {
  const result = await operation()
  return Success(result)
} catch (error) {
  const { statusCode, message } = handleError(error)
  return Response(message, statusCode)
}

// ❌ Bad
await operation() // No error handling!
```

### 4. Environment Variables

```typescript
// ✅ Good
const firebaseKey = process.env.FIREBASE_ADMIN_SDK_KEY
if (!firebaseKey) throw new Error('Missing FIREBASE_ADMIN_SDK_KEY')

// ❌ Bad
const key = process.env.firebaseKey || 'default' // Unsafe!
```

---

## 🧪 Testing Checklist

When adding new features:

- [ ] Type safety: Check TypeScript compilation
- [ ] Permissions: Test with different roles
- [ ] API: Test endpoint with curl/Postman
- [ ] UI: Test component rendering
- [ ] Error handling: Test error cases
- [ ] Security: Verify permission checks
- [ ] Database: Verify data structure
- [ ] Logging: Verify activity logs

---

## 📚 File Modification Guide

### When to Modify What

| File                          | When to Modify            | Examples                   |
| ----------------------------- | ------------------------- | -------------------------- |
| `types/index.ts`              | Adding new data types     | User, Campaign, Contact    |
| `lib/db/users.ts`             | Adding DB queries         | getUsersByRole, countUsers |
| `lib/auth/rbac.ts`            | Changing permission logic | canArchive, canViewReports |
| `components/ui/*.tsx`         | Creating UI components    | NewButton, NewCard         |
| `app/api/auth/login/route.ts` | Changing auth             | 2FA, OAuth                 |
| `middleware.ts`               | Changing auth middleware  | Rate limiting, logging     |

---

## 🚀 Common Patterns

### Check Permission & Render

```typescript
const { checkPermission } = useAuth()

return (
  <>
    {checkPermission('users', 'read') && <UsersList />}
    {checkPermission('users', 'create') && <CreateUserButton />}
  </>
)
```

### API Route with CRUD

```typescript
if (request.method === 'GET') {
  // Read
} else if (request.method === 'POST') {
  // Create
} else if (request.method === 'PUT') {
  // Update
} else if (request.method === 'DELETE') {
  // Delete
}
```

### Async Data Fetching

```typescript
'use client'
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/endpoint')
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  return <DataDisplay data={data} />
}
```

---

## 📞 Getting Help

- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for code patterns
- Review [RBAC.md](./RBAC.md) for permission questions
- Check [PERMISSIONS.md](./PERMISSIONS.md) for role config
- Read existing API routes for examples
- Check type definitions in `types/index.ts`

---

## ✅ Checklist: Before Committing Code

- [ ] TypeScript compiles without errors
- [ ] Permission checks implemented
- [ ] Error handling implemented
- [ ] Environment variables used securely
- [ ] No hardcoded secrets in code
- [ ] Types are specific (not `any`)
- [ ] API endpoints are tested
- [ ] Components render correctly
- [ ] Accessibility considered
- [ ] Mobile responsive (if UI)

---

**Remember**: When extending Wajiwa, always prioritize security, type safety,
and permission checks!
