# Wajiwa Architecture & System Design

Complete visual and textual documentation of the system architecture.

## 🏗️ System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Browser (React 19 + TypeScript + Tailwind CSS)                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Pages (8 dashboard pages + login)                         │ │
│  │  ├─ /auth/login        (public)                           │ │
│  │  ├─ /dashboard         (protected)                        │ │
│  │  ├─ /dashboard/...     (other pages with RBAC)            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Components                                                │ │
│  │  ├─ Auth: useAuth hook, AuthProvider, guards              │ │
│  │  ├─ Layout: Header, Sidebar, DashboardLayout              │ │
│  │  └─ UI: Button, Input, Card, Label (custom)               │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  State Management                                          │ │
│  │  └─ React Context API (AuthContext with permissions)      │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware (middleware.ts)                                │ │
│  │  ├─ Extract JWT from cookies                              │ │
│  │  ├─ Validate token signature                              │ │
│  │  ├─ Decode user ID & role                                 │ │
│  │  └─ Pass headers to API routes                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Routes (app/api/)                                     │ │
│  │                                                            │ │
│  │  Auth Routes:                                             │ │
│  │  ├─ POST /auth/login                                      │ │
│  │  │  ├─ Verify email exists in Firestore                  │ │
│  │  │  ├─ Compare password (bcrypt)                          │ │
│  │  │  ├─ Generate JWT token                                │ │
│  │  │  └─ Set httpOnly cookie                               │ │
│  │  │                                                        │ │
│  │  ├─ POST /auth/logout                                     │ │
│  │  │  └─ Clear auth cookie                                 │ │
│  │  │                                                        │ │
│  │  ├─ GET /auth/verify                                      │ │
│  │  │  ├─ Validate token (already done by middleware)       │ │
│  │  │  └─ Return user info                                  │ │
│  │  │                                                        │ │
│  │  └─ GET /auth/rbac                                        │ │
│  │     ├─ Get user from Firestore                           │ │
│  │     ├─ Fetch role document                               │ │
│  │     ├─ Extract permissions array                         │ │
│  │     └─ Return permissions + resources                    │ │
│  │                                                            │ │
│  │  Admin Routes:                                            │ │
│  │  └─ /admin/* (permission checked at route)                │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authentication Layer (lib/auth/)                          │ │
│  │  ├─ auth.ts                                               │ │
│  │  │  ├─ hashPassword() - bcrypt hashing                    │ │
│  │  │  ├─ comparePasswords() - constant-time comparison      │ │
│  │  │  ├─ signToken() - JWT generation                       │ │
│  │  │  └─ verifyToken() - JWT validation                     │ │
│  │  └─ rbac.ts                                               │ │
│  │     └─ checkPermission() - Verify resource+action         │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Database Layer (lib/db/)                                 │ │
│  │  └─ users.ts                                              │ │
│  │     ├─ getUserByEmail()                                   │ │
│  │     ├─ getRoleByName()                                    │ │
│  │     ├─ getPermissionsByRole()                             │ │
│  │     └─ Other CRUD operations                              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────────┘
                         │ Firebase Admin SDK
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FIRESTORE DATABASE                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Collections:                                              │ │
│  │  ├─ users/                                                 │ │
│  │  │  ├─ id: string                                         │ │
│  │  │  ├─ email: string (indexed)                            │ │
│  │  │  ├─ password: string (hashed)                          │ │
│  │  │  ├─ role: string (reference to role name)              │ │
│  │  │  ├─ lastLogin: timestamp                               │ │
│  │  │  └─ createdAt: timestamp                               │ │
│  │  │                                                        │ │
│  │  ├─ roles/                                                │ │
│  │  │  ├─ id: string                                         │ │
│  │  │  ├─ name: string (indexed, unique)                     │ │
│  │  │  ├─ description: string                                │ │
│  │  │  ├─ permissions: array of {resource, action}           │ │
│  │  │  ├─ createdAt: timestamp                               │ │
│  │  │  └─ updatedAt: timestamp                               │ │
│  │  │                                                        │ │
│  │  ├─ contacts/                                             │ │
│  │  │  ├─ name, phone, email, status, labels                │ │
│  │  │  └─ other CRM fields...                               │ │
│  │  │                                                        │ │
│  │  ├─ campaigns/                                            │ │
│  │  │  ├─ name, message, status, schedule                   │ │
│  │  │  └─ targeting info...                                 │ │
│  │  │                                                        │ │
│  │  └─ Other collections for features...                     │ │
│  │     ├─ conversations/                                     │ │
│  │     ├─ messages/                                          │ │
│  │     ├─ whatsapp_accounts/                                 │ │
│  │     └─ ai_agents/                                         │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization Flow

### Login Flow (Detailed)

```
1. USER INPUT
   User enters: email@example.com / Password123

2. CLIENT - SEND REQUEST
   POST /api/auth/login
   {
     email: "email@example.com",
     password: "Password123"
   }

3. SERVER - AUTHENTICATION
   a. Query Firestore users collection
      db.collection('users')
        .where('email', '==', 'email@example.com')
        .get()

   b. Get document data
      {
        id: "user123",
        email: "email@example.com",
        password: "$2a$10$...(bcrypt hash)...",
        role: "manager"
      }

   c. Compare password
      bcryptjs.compare("Password123", hash)
      → Returns true if matches

   d. Generate JWT token
      payload = {
        userId: "user123",
        role: "manager",
        iat: 1234567890,
        exp: 1234567890 + 24*60*60
      }
      token = jose.signJWT(payload, secret)

   e. Set cookie
      Set-Cookie: auth_token=<token>; HttpOnly; Secure; SameSite=Strict

4. SERVER - SEND RESPONSE
   {
     user: {
       id: "user123",
       email: "email@example.com",
       role: "manager"
     }
   }

5. CLIENT - STORE STATE
   AuthContext.setSession({
     userId: "user123",
     email: "email@example.com",
     role: "manager"
   })

6. CLIENT - FETCH PERMISSIONS
   GET /api/auth/rbac

7. SERVER - FETCH PERMISSIONS
   a. Get user role from Firestore
      db.collection('roles')
        .where('name', '==', 'manager')
        .get()

   b. Extract permissions array
      permissions = [
        { resource: 'dashboard', action: 'read' },
        { resource: 'campaigns', action: 'read' },
        ...
      ]

   c. Extract available resources
      availableResources = ['dashboard', 'campaigns', ...]

8. SERVER - SEND PERMISSIONS
   {
     role: "manager",
     permissions: [...],
     availableResources: [...]
   }

9. CLIENT - STORE PERMISSIONS
   AuthContext.setPermissions(permissions)
   AuthContext.setAvailableResources(availableResources)

10. CLIENT - UPDATE UI
    - Render menu items for available resources
    - Hide inaccessible menu items
    - Set up permission guards for components
```

## 📊 Permission Checking Flow

### Component Level

```
┌─────────────────────────────┐
│  Component renders          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Call useAuth()             │
│  const { permissions } = ... │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Wrap in RBACGuard          │
│  <RBACGuard resource="x"... │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Check permission exists in array   │
│  permissions.some(p =>              │
│    p.resource === "x" &&            │
│    p.action === "delete"            │
│  )                                  │
└──────────┬────────────┬─────────────┘
           │            │
      ✅ YES            ❌ NO
           │            │
           ▼            ▼
    ┌─────────┐    ┌──────────┐
    │ Render  │    │ Don't    │
    │ content │    │ render   │
    └─────────┘    └──────────┘
```

### API Level

```
┌─────────────────────────────┐
│  API request received       │
│  POST /api/resource         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Middleware validation      │
│  - Extract JWT from cookie  │
│  - Verify signature         │
│  - Decode user data         │
└──────────┬──────────────────┘
           │
      ✅ Valid?
           │
      ┌────┴────┐
      │          │
    NO           YES
      │          │
      ▼          ▼
 401 Err    ┌──────────────┐
      │     │ Set headers  │
      │     │ x-user-id    │
      │     │ x-user-role  │
      │     └──────┬───────┘
      │            │
      │            ▼
      │     ┌──────────────────┐
      │     │ API route handler│
      │     └──────┬───────────┘
      │            │
      │            ▼
      │     ┌──────────────────┐
      │     │ Check permission │
      │     │ x-user-role      │
      │     │ checkPermission()│
      │     └──────┬────┬──────┘
      │            │    │
      │        HAS NO
      │            │    │
      │            ▼    ▼
      │         ✅    403 Err
      │         │      │
      │         ▼      ▼
      │     Process  Return
      │     request  error
      │         │
      │         ▼
      └──→ Return response
```

## 💾 Data Model

### User Document

```json
{
  "_id": "user123",
  "email": "user@example.com",
  "password": "$2a$10$...", // bcrypt hash
  "role": "manager", // matches role name
  "lastLogin": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Role Document

```json
{
  "_id": "role_manager",
  "name": "manager",
  "description": "Manager with limited access",
  "permissions": [
    { "resource": "dashboard", "action": "read" },
    { "resource": "campaigns", "action": "read" },
    { "resource": "campaigns", "action": "create" },
    { "resource": "campaigns", "action": "update" },
    { "resource": "crm", "action": "read" },
    { "resource": "crm", "action": "create" }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🔀 Request Lifecycle

```
1. USER ACTION
   User clicks "Delete Campaign"

2. COMPONENT HANDLER
   handleDelete() called
   → Checks permission with useAuth().checkPermission()
   → Shows confirm dialog

3. API CALL
   DELETE /api/campaigns/123
   (browser automatically includes auth_token cookie)

4. MIDDLEWARE
   - Extracts JWT from cookie
   - Validates signature with secret
   - Decodes payload
   - Sets x-user-id and x-user-role headers
   - Passes to API route

5. API ROUTE HANDLER
   - Receives request with headers
   - Extracts x-user-role header
   - Calls checkPermission('campaigns', 'delete')
   - If permitted: processes delete
   - If denied: returns 403 Forbidden

6. DATABASE OPERATION
   - Queries Firestore
   - Validates ownership (optional)
   - Performs deletion
   - Logs activity (optional)

7. RESPONSE
   - Returns success or error
   - Client updates UI
   - Shows notification

8. STATE UPDATE
   - Component re-renders
   - List updates
   - User sees result
```

## 🎯 Permission Model

```
Permission = {
  resource: string,   // Feature name: 'users', 'campaigns', 'crm'
  action: string      // Operation: 'read', 'create', 'update', 'delete'
}

Examples:
- { resource: 'campaigns', action: 'read' }   → View campaigns
- { resource: 'campaigns', action: 'create' } → Create new campaign
- { resource: 'campaigns', action: 'update' } → Edit campaign
- { resource: 'campaigns', action: 'delete' } → Delete campaign

Role = {
  permissions: Permission[]
}

User role determines which permissions they have
Permissions determine what they can access/modify
```

## 🔒 Security Layers

```
Layer 1: Transport Layer
├─ HTTPS (in production)
├─ Secure cookies (HttpOnly, SameSite)
└─ No sensitive data in URLs

Layer 2: Middleware
├─ JWT token validation
├─ User authentication check
├─ Request headers enrichment
└─ Invalid token rejection

Layer 3: API Route
├─ Permission verification
├─ Resource ownership check
├─ Input validation
└─ Rate limiting (optional)

Layer 4: Component Level
├─ RBACGuard components
├─ Permission checks before render
├─ UI hiding (not security, just UX)
└─ Error boundary handling

Layer 5: Database
├─ Firestore security rules
├─ User data isolation
├─ Collection-level access control
└─ Field-level encryption (optional)
```

## 📈 Data Flow Diagrams

### Login to Dashboard

```
                                Browser
    ┌──────────────┐
    │ Login Page   │
    │ Enter email  │
    │ Enter pwd    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐      POST /api/auth/login
    │ Click Login  ├─────────────────────────────►
    └──────────────┘                              │
                                                  │ Server
                                         ┌────────▼─────────┐
                                         │ Fetch user from  │
                                         │ Firestore        │
                                         └────────┬─────────┘
                                                  │
                                         ┌────────▼─────────┐
                                         │ Compare password │
                                         │ (bcrypt)         │
                                         └────────┬─────────┘
                                                  │
                                  ┌───────────────┴───────────────┐
                                  │                               │
                            ✅ Match                        ❌ No Match
                                  │                               │
                                  ▼                               ▼
                          ┌──────────────┐          ┌─────────────────────┐
                          │ Generate JWT │          │ Return 401          │
                          │ Create token │          │ Unauthorized        │
                          └──────┬───────┘          └─────────────────────┘
                                 │
                          ┌──────▼───────┐
                          │ Set cookie   │
                          │ httpOnly     │
                          └──────┬───────┘
                                 │
                    ◄────────────┤
                                 │ Response + cookie
    ┌──────────────┐            │
    │ Store session│◄───────────┘
    │ AuthContext  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐      GET /api/auth/rbac
    │ Fetch perms  ├──────────────────────────────►
    └──────┬───────┘                              │
           │ (cookie included)                    │ Server
           │                                      │
           │                             ┌────────▼─────────┐
           │                             │ Fetch user from  │
           │                             │ Firestore        │
           │                             └────────┬─────────┘
           │                                      │
           │                             ┌────────▼─────────┐
           │                             │ Fetch role docs  │
           │                             │ Get permissions  │
           │                             └────────┬─────────┘
           │                                      │
           │                    ◄─────────────────┤
           │                   Response + perms    │
           │
    ┌──────▼─────────────┐
    │ Store permissions  │
    │ Set availableRes   │
    └──────┬─────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Render dashboard │
    │ Menu items show  │
    │ based on perms   │
    └──────────────────┘
```

## 🏛️ Module Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                      │
│  ├─ auth/login      ──┐                                     │
│  └─ dashboard/*     ──┼─→ useAuth()  ← AuthProvider       │
│                       │   (Context)                         │
│  Components                                                 │
│  ├─ RBACGuard   ────┼─→ checkPermission()                  │
│  ├─ Header      ────┼─→ availableResources                 │
│  └─ DashLayout  ────┘   hasAccess()                        │
└─────────────────────────────────────────────────────────────┘
                          │
                   API calls (fetch)
                          │
┌─────────────────────────▼─────────────────────────────────┐
│               NEXT.JS SERVER                              │
├─────────────────────────────────────────────────────────┐ │
│ middleware.ts                                           │ │
│ ├─ Extract JWT from cookie                              │ │
│ ├─ Validate & decode                                    │ │
│ └─ Pass user to route handlers                          │ │
└─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┐ │
│ API Routes (app/api/)                                   │ │
│ ├─ Receive x-user-id, x-user-role headers              │ │
│ ├─ Call checkPermission(role, resource, action)        │ │
│ ├─ Access db layer for Firestore queries               │ │
│ └─ Return response                                      │ │
└─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┐ │
│ lib/auth/                                               │ │
│ ├─ auth.ts: hashPassword, comparePasswords, tokens     │ │
│ └─ rbac.ts: checkPermission(role, resource, action)    │ │
└─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┐ │
│ lib/db/                                                 │ │
│ └─ users.ts: Firestore queries (CRUD for users/roles)  │ │
└─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┐ │
│ lib/firebase/                                           │ │
│ ├─ client.ts: Firebase client SDK                       │ │
│ └─ admin.ts: Firebase Admin SDK                         │ │
└─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
               Firebase Admin SDK calls
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                  FIRESTORE DATABASE                       │
├─────────────────────────────────────────────────────────┐ │
│ Collections:                                            │ │
│ ├─ users          (user profiles & auth data)          │ │
│ ├─ roles          (role definitions + permissions)     │ │
│ ├─ campaigns      (WhatsApp campaigns)                 │ │
│ ├─ contacts       (CRM contacts)                       │ │
│ ├─ messages       (Message history)                    │ │
│ └─ ... other collections                              │ │
└─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Update Cycle

```
User makes change
      │
      ▼
Component handler called
      │
      ├─ Check permission (client-side, UX)
      │
      ▼
Send API request
      │
      ├─ Include JWT (automatic via cookie)
      │
      ▼
Server middleware
      │
      ├─ Validate JWT
      ├─ Extract user info
      ├─ Set headers
      │
      ▼
API route handler
      │
      ├─ Receive request + headers
      ├─ Check permission (server-side, security)
      │
      ▼
Database operation
      │
      ├─ Query Firestore
      ├─ Update document
      ├─ Return updated data
      │
      ▼
Send response to client
      │
      ├─ Return new data/status
      │
      ▼
Update React state
      │
      ├─ Component re-renders
      ├─ UI updates
      ├─ User sees result
```

---

## 📚 See Also

- [RBAC.md](./RBAC.md) - Dynamic RBAC system details
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
