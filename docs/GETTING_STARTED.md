# Getting Started with Wajiwa Admin Dashboard

## Overview

Wajiwa is a comprehensive admin dashboard template with dynamic Role-Based
Access Control (RBAC), Firebase/Firestore integration, authentication, and
WhatsApp business features.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase Credentials

The `.env.local` file is already configured with Firebase credentials. Make sure
it contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_ADMIN_SDK_KEY=...
NEXT_SECRET_KEY=your-jwt-secret-key
```

### 3. Seed Demo Data

```bash
npx ts-node scripts/seed-db.ts
```

This creates:

- **3 Demo Users**: admin, manager, agent
- **3 Roles**: with different permission levels
- **3 Contacts**: CRM demo data
- **2 Campaigns**: marketing templates
- **1 WhatsApp Account**: integration demo
- **1 AI Agent**: chatbot template

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Demo Credentials

### Admin Account

- **Email**: admin@wajiwa.com
- **Password**: Admin@123456
- **Access**: Full system access, all features visible

### Manager Account

- **Email**: manager@wajiwa.com
- **Password**: Manager@123456
- **Access**: Campaign management, CRM, team members view

### Agent Account

- **Email**: agent@wajiwa.com
- **Password**: Agent@123456
- **Access**: WhatsApp messaging, basic CRM

## Project Structure

```
wajiwa/
├── app/
│   ├── api/                 # API routes (auth, admin endpoints)
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard pages
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Home page (redirects to login)
│   └── globals.css
├── components/
│   ├── auth/               # Auth context, guards, protected routes
│   ├── layout/             # Dashboard layout components
│   └── ui/                 # Reusable UI components (custom implementation)
├── lib/
│   ├── auth/               # Authentication & RBAC utilities
│   ├── db/                 # Database queries (users, roles, permissions)
│   └── firebase/           # Firebase client & admin initialization
├── types/
│   └── index.ts            # TypeScript type definitions
├── scripts/
│   └── seed-db.ts          # Database seeding script
├── docs/
│   ├── RBAC.md             # Dynamic RBAC documentation
│   └── GETTING_STARTED.md  # This file
├── middleware.ts           # Request authentication validation
├── .env.local              # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features

### 1. Dynamic RBAC (Role-Based Access Control)

Permission-based access control driven entirely by Firestore. No code changes
needed to modify roles or permissions.

**Features**:

- Define roles and permissions in Firestore
- Dynamic menu generation based on user permissions
- Component-level permission guards
- API-level permission validation
- Middleware-level authentication

**Example**:

```typescript
// Check if user can read users
const canRead = auth.checkPermission('users', 'read')

// Conditionally render component
;<RBACGuard
  resource='users'
  action='read'>
  <UsersList />
</RBACGuard>

// Protect API endpoint
const hasPermission = auth.checkPermission('users', 'create')
if (!hasPermission) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### 2. Authentication

- **JWT Tokens**: Stateless authentication using jose library
- **Password Hashing**: bcryptjs with 10 salt rounds
- **HttpOnly Cookies**: XSS protection
- **Session Management**: Auto-validate on app load
- **Token Verification**: Middleware-based validation

### 3. Firestore Integration

All data stored in Firestore with proper security rules:

- **Users Collection**: Authentication & profile data
- **Roles Collection**: Role definitions with permissions
- **Permissions**: Resource-action pairs attached to roles
- **Contacts**: CRM contact information
- **Campaigns**: Marketing campaign management
- **Conversations**: WhatsApp conversation history
- **Messages**: Message storage
- **AI Agents**: Chatbot/agent configuration
- **WhatsApp Accounts**: Account integration settings

### 4. Dashboard Pages

- **Dashboard**: Stats overview, quick actions
- **WhatsApp**: Account management, live chat
- **Campaigns**: Campaign creation and management
- **CRM**: Contact management and labels
- **AI Agents**: Chatbot configuration
- **Team** (Admin only): User & role management
- **Settings** (Admin only): System configuration

## Security Features

1. **Authentication**:

   - Password verification before JWT generation
   - Tokens expire after 24 hours
   - HttpOnly cookies prevent XSS attacks

2. **Authorization**:

   - Middleware validates all requests
   - API routes double-check permissions
   - Component-level guards prevent unauthorized UI rendering

3. **Password Security**:

   - Bcrypt hashing with salt rounds
   - Passwords never returned in API responses
   - Constant-time password comparison

4. **RBAC Security**:
   - Permissions fetched from Firestore
   - User role verified from token
   - Multiple permission check levels

## Development Workflow

### Adding a New Page

1. Create page file: `app/dashboard/[feature]/page.tsx`
2. Add resource permission to roles in Firestore
3. Wrap component with `RBACGuard` for permission check
4. Add menu item to `components/layout/dashboard-header.tsx`

### Adding a New Role

1. Create role document in Firestore `roles` collection
2. Define permissions array with resource-action pairs
3. Assign users to role by setting `role` field in user document
4. Permissions automatically loaded on user login

### Adding an API Endpoint

1. Create route file: `app/api/[resource]/route.ts`
2. Extract user from token (passed in headers by middleware)
3. Check permission using `auth.checkPermission()`
4. Return 403 Forbidden if insufficient permissions

Example:

```typescript
export async function POST(request: Request) {
  const role = request.headers.get('x-user-role')
  const userId = request.headers.get('x-user-id')

  const hasPermission = checkPermission(role, 'users', 'create')
  if (!hasPermission) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Handle POST request
}
```

## Troubleshooting

### npm install fails

**Solution**: Use legacy peer dependencies flag

```bash
npm install --legacy-peer-deps
```

### Seed script fails

**Solution**: Ensure Firebase credentials are correct in `.env.local`

```bash
npx ts-node scripts/seed-db.ts
```

### Permission checks not working

**Solution**: Verify role document exists in Firestore with correct structure:

```json
{
  "name": "admin",
  "description": "Administrator",
  "permissions": [
    { "resource": "users", "action": "read" },
    { "resource": "users", "action": "create" }
  ]
}
```

### Login fails

**Solution**: Check that user document exists in Firestore with:

- `email` field matching login form
- `password` field (hashed with bcrypt)
- `role` field matching an existing role name

## API Reference

### Authentication Endpoints

#### POST /api/auth/login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajiwa.com","password":"Admin@123456"}'
```

Response:

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "admin@wajiwa.com",
    "role": "admin"
  }
}
```

#### POST /api/auth/logout

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

#### GET /api/auth/verify

```bash
curl -X GET http://localhost:3000/api/auth/verify
```

Response:

```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "email": "admin@wajiwa.com",
    "role": "admin"
  }
}
```

#### GET /api/auth/rbac

```bash
curl -X GET http://localhost:3000/api/auth/rbac
```

Response:

```json
{
  "role": "admin",
  "permissions": [
    { "resource": "users", "action": "read" },
    { "resource": "users", "action": "create" }
  ],
  "availableResources": ["users", "campaigns", "settings"]
}
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Seed demo data: `npx ts-node scripts/seed-db.ts`
3. ✅ Run dev server: `npm run dev`
4. 🔄 Test login with demo credentials
5. 🔄 Implement WhatsApp API integration
6. 🔄 Implement campaign automation
7. 🔄 Setup payment integration

## Additional Resources

- [Dynamic RBAC Documentation](./RBAC.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review RBAC documentation for permission issues
3. Check Firestore console for data structure
4. Review browser DevTools for errors

---

**Last Updated**: 2024 **Version**: 1.0.0
