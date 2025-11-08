# Wajiwa Admin - WhatsApp Business Suite

Complete admin dashboard dengan **Dynamic RBAC**, WhatsApp integration, CRM, dan
AI agents menggunakan Next.js 16, React 19, TypeScript, dan Firestore.

## 🚀 Features

### Core Features

- **🔐 Dynamic Role-Based Access Control (RBAC)** - Fully configurable in
  Firestore

  - Admin, Manager, Agent roles (or create custom roles)
  - Permission-based access control
  - Dynamic menu generation based on user permissions
  - No code changes needed to modify access

- **🔑 Secure Authentication**

  - JWT-based auth dengan Firestore
  - bcryptjs password hashing (salt: 10 rounds)
  - HttpOnly cookies untuk XSS protection
  - Session management & token validation

- **🛡️ Multi-Layer Permission Checking**
  - Middleware-level authentication
  - API-level authorization
  - Component-level access guards
  - Three-tier security architecture

### WhatsApp Integration

- **WhatsApp Cloud API** - Official Meta WhatsApp API
- **WhatsApp Web API** - Unofficial WhatsApp Web integration
- **Multi-Account Support** - Kelola multiple WhatsApp accounts
- **Live Chat Interface** - Real-time messaging

### Campaign Management

- **Broadcast Campaigns** - Send to multiple contacts
- **Targeted Campaigns** - Smart targeting
- **Scheduled Campaigns** - Automation support
- **Official & Custom Templates** - Template management
- **Multimedia Support** - Images, videos, documents, audio

### CRM

- **Contact Management** - Database contacts
- **Conversation Labels** - Organize conversations
- **Conversation History** - Track all interactions
- **Audience Grouping** - Segment customers

### AI Agents

- **Intelligent Chatbots** - GPT-powered assistants
- **Custom Prompts** - Customize behavior
- **Multiple Models** - Support for GPT-3.5 & GPT-4

## 🔧 Quick Start

### 1. Install Dependencies

```bash
npm install
```

If npm install fails, try:

```bash
npm install --legacy-peer-deps
```

### 2. Seed Demo Data

```bash
npx ts-node scripts/seed-db.ts
```

**Demo Credentials**:

| Role    | Email              | Password       |
| ------- | ------------------ | -------------- |
| Admin   | admin@wajiwa.com   | Admin@123456   |
| Manager | manager@wajiwa.com | Manager@123456 |
| Agent   | agent@wajiwa.com   | Agent@123456   |

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
wajiwa/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication APIs (login, logout, verify, rbac)
│   │   └── admin/         # Admin endpoints with permission checks
│   ├── auth/login/        # Login page
│   ├── dashboard/         # Protected dashboard pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home (redirects to login)
│   └── globals.css
├── components/
│   ├── auth/              # Auth context, guards, protected routes
│   ├── layout/            # Dashboard layout components
│   └── ui/                # Reusable UI components (custom implementation)
├── lib/
│   ├── firebase/          # Firebase client & admin initialization
│   ├── auth/              # JWT, bcrypt, RBAC utilities
│   └── db/                # Firestore database queries
├── types/
│   └── index.ts           # TypeScript type definitions
├── docs/
│   ├── GETTING_STARTED.md # Quick start guide
│   ├── RBAC.md            # Dynamic RBAC documentation
│   └── PERMISSIONS.md     # Permission configuration guide
├── scripts/
│   └── seed-db.ts         # Database seeding with demo data
├── middleware.ts          # Request authentication & validation
├── .env.local             # Environment variables (Firebase config)
├── tsconfig.json
├── package.json
└── README.md
```

## 🔐 Authentication & RBAC

### How It Works

1. **User Login**

   - Email & password verified against Firestore
   - Bcrypt constant-time comparison
   - JWT token generated and stored in httpOnly cookie

2. **Permission Loading**

   - Middleware validates JWT token
   - User role fetched from Firestore
   - Role permissions fetched dynamically
   - Available resources compiled and sent to frontend

3. **Access Control**
   - Component checks `useAuth()` for permissions
   - API routes verify permissions from request headers
   - RBACGuard components conditionally render
   - Dynamic menu hides inaccessible items

### RBAC Features

- ✅ **Dynamic**: All roles and permissions stored in Firestore
- ✅ **Flexible**: Add custom roles without code changes
- ✅ **Secure**: Multiple permission check layers
- ✅ **Component-Level**: RBACGuard and RBACVisible components
- ✅ **API-Level**: Permission validation in route handlers
- ✅ **Middleware-Level**: Request authentication

## 📱 Pages & Routes

### Public Routes

- `/` → Redirect to login
- `/auth/login` - Login form

### Protected Routes (All authenticated users)

- `/dashboard` - Dashboard overview
- `/dashboard/whatsapp` - WhatsApp account management
- `/dashboard/campaigns` - Campaign management
- `/dashboard/crm` - Contact management
- `/dashboard/ai-agents` - AI chatbot configuration

### Admin Only Routes

- `/dashboard/team` - Team member management
- `/dashboard/settings` - System settings

## 🚀 API Endpoints

### Authentication

```
POST   /api/auth/login      - Login (email, password)
POST   /api/auth/logout     - Logout (clear session)
GET    /api/auth/verify     - Verify session & get user info
GET    /api/auth/rbac       - Fetch dynamic permissions & resources
```

### Admin Endpoints

```
GET    /api/admin/users     - List users (admin only)
POST   /api/admin/users     - Create user (admin only)
```

## 💾 Database Collections

- **users** - User accounts with email, role, password hash
- **roles** - Role definitions with permission arrays
- **contacts** - CRM contacts
- **campaigns** - WhatsApp campaigns
- **conversations** - Chat conversations
- **messages** - Individual messages
- **whatsapp_accounts** - Connected WhatsApp accounts
- **ai_agents** - AI chatbot configurations

## � Security Features

1. **Password Security**

   - Bcrypt hashing with 10 salt rounds
   - Constant-time password comparison
   - Never exposed in API responses

2. **Token Security**

   - JWT tokens with HS256 signing
   - 24-hour expiration
   - HttpOnly cookies prevent XSS access
   - Automatic validation on middleware

3. **Permission Security**

   - Fetched dynamically from Firestore
   - Validated at multiple layers
   - Cannot be modified on client
   - Role verification before processing

4. **Data Protection**
   - Firestore security rules
   - User data isolation
   - Admin-only resources

## �📚 Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript 5
- **Database**: Google Cloud Firestore
- **Authentication**: JWT (jose library) + bcryptjs
- **UI**: Tailwind CSS 4 (custom components, no external UI library)
- **State Management**: React Context API
- **Environment**: Node.js + npm

## 📖 Documentation

## 📖 Documentation

Complete documentation available in the `docs/` folder:

| Document                                        | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| [INDEX.md](./docs/INDEX.md)                     | **Start here** - Documentation index & quick links |
| [GETTING_STARTED.md](./docs/GETTING_STARTED.md) | Installation & quick start guide                   |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md)       | System design & architecture diagrams              |
| [RBAC.md](./docs/RBAC.md)                       | Dynamic RBAC system documentation                  |
| [PERMISSIONS.md](./docs/PERMISSIONS.md)         | Permission configuration guide                     |
| [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) | Developer quick reference & code snippets          |
| [DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | How to extend the system                           |
| [PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md) | Complete project overview                          |
| [CHECKLIST.md](./docs/CHECKLIST.md)             | Project completion status                          |

### Quick Links

- **First time?** Start with [docs/INDEX.md](./docs/INDEX.md)
- **Want to run it?** Read [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)
- **Understand RBAC?** Read [docs/RBAC.md](./docs/RBAC.md) and
  [docs/PERMISSIONS.md](./docs/PERMISSIONS.md)
- **Need code examples?** Check
  [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)
- **Want to extend?** Read [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)

## 🧪 Demo Data Included

Running `npx ts-node scripts/seed-db.ts` creates:

- **3 Demo Users** with different roles
- **3 Roles** (admin, manager, agent)
- **3 Demo Contacts** in CRM
- **2 Demo Campaigns** in different statuses
- **1 WhatsApp Account** integration demo
- **1 AI Agent** template

All with proper RBAC permissions configured.

## 🔄 Workflow Examples

### Adding a New Resource Type

1. Define role permissions in Firestore `roles` collection
2. Add resource to `availableResources` when role permissions are loaded
3. Use `RBACGuard` component in UI to hide/show features
4. Add permission check in API routes
5. Dynamic menu updates automatically

### Creating a Custom Role

1. Create new document in Firestore `roles` collection
2. Define `name`, `description`, and `permissions` array
3. Assign users to role by setting their `role` field
4. Permissions automatically loaded on user login

### Restricting API Endpoint

```typescript
// Check permission in API route
const role = request.headers.get('x-user-role')
const hasPermission = checkPermission(role, 'resource', 'action')

if (!hasPermission) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

## 🐛 Troubleshooting

### npm install fails

```bash
npm install --legacy-peer-deps
```

### Seed script fails

- Verify Firebase credentials in `.env.local`
- Check Firestore database is accessible
- Run: `npx ts-node scripts/seed-db.ts`

### Login doesn't work

- Verify user exists in Firestore `users` collection
- Check password is hashed with bcrypt
- Verify `role` field matches a role name

### Permission checks not working

- Verify role document exists in `roles` collection
- Check role name matches exactly (case-sensitive)
- Verify permissions array has correct structure
- Check `/api/auth/rbac` response in browser DevTools

## 📄 License

MIT License

---

**Developed with ❤️ for Wajiwa**
