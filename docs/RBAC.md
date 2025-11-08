# Dynamic RBAC System

Sistem Role-Based Access Control (RBAC) yang dinamis, sepenuhnya tergantung pada
konfigurasi di Firestore.

## 📋 Overview

RBAC system dalam Wajiwa dirancang untuk:

- Memberikan fleksibilitas penuh dalam mengatur permissions
- Menampilkan menu dan fitur secara dinamis berdasarkan role
- Validasi akses di level API dan UI
- Mudah menambah/mengubah roles dan permissions tanpa code changes

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          Firestore Database                     │
│  ┌─────────────────────────────────────────┐   │
│  │  Collection: roles                      │   │
│  │  ┌──────────────────────────────────┐   │   │
│  │  │ name: "admin"                    │   │   │
│  │  │ permissions: [                   │   │   │
│  │  │   {resource: "users", ...}       │   │   │
│  │  │   {resource: "settings", ...}    │   │   │
│  │  │ ]                                │   │   │
│  │  └──────────────────────────────────┘   │   │
│  └─────────────────────────────────────────┘   │
│                       ↓                         │
│  ┌─────────────────────────────────────────┐   │
│  │  Collection: users                      │   │
│  │  ┌──────────────────────────────────┐   │   │
│  │  │ email: "admin@wajiwa.com"        │   │   │
│  │  │ role: "admin"                    │   │   │
│  │  └──────────────────────────────────┘   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  API Layer: /api/auth/rbac                      │
│  - Fetch user permissions dari Firestore        │
│  - Return available resources                   │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  Auth Context & Hooks                           │
│  - checkPermission()                            │
│  - hasAccess()                                  │
│  - availableResources[]                         │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  UI Components                                  │
│  - Dashboard Header (dynamic menu)              │
│  - RBACGuard (conditional rendering)            │
│  - ProtectedRoute (page protection)             │
└─────────────────────────────────────────────────┘
```

## 🔐 Permission Structure

### Firestore Schema (roles collection)

```typescript
{
  name: string;                    // e.g., "admin", "manager", "agent"
  description: string;             // Role description
  permissions: [
    {
      resource: string;           // e.g., "users", "campaigns", "settings"
      action: 'read' | 'create' | 'update' | 'delete';
    }
  ]
}
```

### Resources

Standard resources dalam sistem:

- `dashboard` - Dashboard access
- `whatsapp` - WhatsApp management
- `campaigns` - Campaign management
- `crm` - CRM & Contacts
- `ai-agents` - AI Agents
- `team` - Team management (admin only)
- `settings` - System settings (admin only)

## 💻 Usage

### 1. Check Permission di Component

```typescript
import { useAuth } from '@/components/auth/auth-context'

export function MyComponent() {
  const { checkPermission } = useAuth()

  // Check specific action
  if (checkPermission('campaigns', 'create')) {
    // Show create button
  }

  return (
    <div>
      {checkPermission('users', 'delete') && <button>Delete User</button>}
    </div>
  )
}
```

### 2. Conditional Rendering dengan RBACGuard

```typescript
import { RBACGuard } from '@/components/auth/rbac-guard'

export function Dashboard() {
  return (
    <div>
      <RBACGuard
        resource='users'
        action='delete'>
        <button>Delete User</button>
      </RBACGuard>

      {/* Simpler version - just check resource access */}
      <RBACVisible resource='team'>
        <TeamSection />
      </RBACVisible>
    </div>
  )
}
```

### 3. API Route Protection

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const userRole = request.headers.get('x-user-role')

  // Middleware sudah validate, tapi bisa double-check
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Handle request
}
```

### 4. Available Resources Hook

```typescript
import { useAuth } from '@/components/auth/auth-context'

export function MenuBuilder() {
  const { availableResources } = useAuth()

  const allMenuItems = [
    { resource: 'dashboard', label: 'Dashboard' },
    { resource: 'campaigns', label: 'Campaigns' },
    { resource: 'team', label: 'Team' },
  ]

  // Only show accessible menu items
  const visibleItems = allMenuItems.filter((item) =>
    availableResources.includes(item.resource)
  )

  return <nav>{/* render visible items */}</nav>
}
```

## 🔄 Flow Diagram

### Login Flow dengan RBAC

```
User Login
   ↓
POST /api/auth/login
   ├─ Verify email & password
   ├─ Create JWT token
   ├─ Set httpOnly cookie
   └─ Return user data
   ↓
Frontend: useAuth().login()
   └─ Set session state
   ↓
fetchRBACData() auto-called
   ↓
GET /api/auth/rbac
   ├─ Get user doc from Firestore
   ├─ Fetch role from roles collection
   ├─ Extract permissions
   └─ Return permissions + availableResources
   ↓
Auth Context Updated
   ├─ permissions: Permission[]
   └─ availableResources: string[]
   ↓
Dashboard rendered dengan dynamic menu
```

### Menu Rendering Flow

```
DashboardHeader Component
   ↓
useAuth() → availableResources
   ↓
Filter menuItems by availableResources
   ├─ Item 1: resource in availableResources? Show : Hide
   ├─ Item 2: resource in availableResources? Show : Hide
   └─ Admin items: role === 'admin'? Show : Hide
   ↓
Render only visible items
```

## 📝 Adding New Resources & Permissions

### Step 1: Add to Firestore roles

```bash
# Go to Firebase Console
# Collection: roles
# Document: admin

# Update permissions array:
permissions: [
  { resource: "newFeature", action: "read" },
  { resource: "newFeature", action: "create" },
  { resource: "newFeature", action: "update" },
  { resource: "newFeature", action: "delete" }
]
```

### Step 2: Use in Components

```typescript
// No code change needed!
// Just use the resource name:

const { checkPermission } = useAuth()

if (checkPermission('newFeature', 'create')) {
  // Show new feature UI
}
```

### Step 3: Protect API Routes

```typescript
// Middleware already checks auth token
// Check headers in your API route:

const userRole = request.headers.get('x-user-role')

if (userRole !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

## 🔒 Security Best Practices

### ✅ DO

- Always verify permissions on the backend
- Use middleware for basic auth check
- Store sensitive permissions in Firestore
- Use httpOnly cookies for JWT
- Validate both token and permissions

### ❌ DON'T

- Trust only frontend permission checks
- Store permissions in localStorage/sessionStorage
- Allow modifying roles on frontend
- Skip backend validation
- Hardcode role checks

## 🎯 Default Roles Setup

### Admin Role

```typescript
{
  name: "admin",
  description: "Full system access",
  permissions: [
    // All resources, all actions
    { resource: "users", action: "read" },
    { resource: "users", action: "create" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "settings", action: "read" },
    { resource: "settings", action: "update" },
    // ... all other resources
  ]
}
```

### Manager Role

```typescript
{
  name: "manager",
  description: "Team and campaign management",
  permissions: [
    { resource: "campaigns", action: "read" },
    { resource: "campaigns", action: "create" },
    { resource: "campaigns", action: "update" },
    { resource: "crm", action: "read" },
    { resource: "crm", action: "create" },
  ]
}
```

### Agent Role

```typescript
{
  name: "agent",
  description: "Basic messaging and contact access",
  permissions: [
    { resource: "whatsapp", action: "read" },
    { resource: "crm", action: "read" },
    { resource: "crm", action: "create" },
  ]
}
```

## 🔄 Permission Caching

Permissions di-fetch saat login dan disimpan di React Context:

- Tidak perlu fetch ulang untuk setiap permission check
- Auto-refetch saat role berubah
- Fallback ke unavailable jika tidak ada permission

## 📊 Monitoring

### Log Permission Checks (optional)

```typescript
// lib/auth/rbac-logger.ts
export function logPermissionCheck(
  userId: string,
  resource: string,
  action: string,
  granted: boolean
) {
  // Send to analytics/logging service
  console.log(`[RBAC] User ${userId} -> ${resource}.${action} = ${granted}`)
}
```

## 🐛 Troubleshooting

### Menu items tidak muncul

1. Check Firestore: Apakah role memiliki permissions?
2. Check browser console: Cek nilai `availableResources`
3. Check middleware: Apakah token valid?

### Permission denied error

1. Verifikasi Firestore role document
2. Check user role field
3. Ensure permissions array lengkap

### API returns 403

1. Check middleware headers (`x-user-role`)
2. Verify token still valid
3. Check API route permission validation

---

**Dynamic RBAC System Ready! 🚀**
