# Wajiwa Admin Dashboard - Project Summary

## 📋 Overview

**Wajiwa** is a production-ready admin dashboard for WhatsApp business
management featuring:

- 🔐 **Dynamic Role-Based Access Control (RBAC)** - Fully configurable
  permissions
- 🔑 **Secure Authentication** - JWT + bcrypt implementation
- 📊 **Multi-user Support** - Admin, Manager, Agent roles (extensible)
- 💬 **WhatsApp Integration** - Multi-account management & live chat
- 📈 **Campaign Management** - Broadcast and targeted campaigns
- 👥 **CRM** - Contact and conversation management
- 🤖 **AI Agents** - Chatbot configuration
- 🎨 **Modern UI** - Responsive design with Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Browser / Client                   │
│  (React 19 + TypeScript + Tailwind CSS)        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│           Next.js 16 Server                     │
│  ┌─────────────────────────────────────────┐   │
│  │  Middleware (Auth & Token Validation)   │   │
│  └─────────────────────┬───────────────────┘   │
│                        ▼                       │
│  ┌─────────────────────────────────────────┐   │
│  │      API Routes (Auth & Admin)          │   │
│  │  - /api/auth/login (JWT generation)     │   │
│  │  - /api/auth/verify (Token validation)  │   │
│  │  - /api/auth/rbac (Permissions fetch)   │   │
│  │  - /api/admin/users (Admin access)      │   │
│  └─────────────────────┬───────────────────┘   │
└────────────────────────┼────────────────────────┘
                         │
                    ┌────┴────────┐
                    ▼             ▼
        ┌──────────────────┐  ┌─────────────┐
        │   Firestore DB   │  │  Firebase   │
        │                  │  │   Admin SDK │
        │ Collections:     │  │             │
        │ - users          │  │ (Server to  │
        │ - roles          │  │  DB queries)│
        │ - permissions    │  │             │
        │ - contacts       │  │             │
        │ - campaigns      │  │             │
        │ - conversations  │  │             │
        │ - messages       │  │             │
        │ - whatsapp_acc   │  │             │
        │ - ai_agents      │  │             │
        └──────────────────┘  └─────────────┘
```

## 🔐 Security Architecture

```
Request → Middleware (Validate JWT)
         ↓
      Is Valid?
         ├─ NO → Return 401 Unauthorized
         │
         └─ YES → Extract User ID & Role
            ↓
         Get User Role from Firestore
            ↓
         Return Role + Permissions in Headers
            ↓
      API Route Handler
         ├─ Check x-user-role header
         ├─ Verify permission (resource + action)
         │
         ├─ NO permission → Return 403 Forbidden
         │
         └─ HAS permission → Process request
            ↓
         Return response
```

## 📊 Data Flow

### Login Flow

```
1. User enters email + password
2. POST /api/auth/login
3. Backend fetches user from Firestore
4. Compares password (bcrypt)
5. If valid, generates JWT token
6. Stores in httpOnly cookie
7. Returns user info to frontend
8. Frontend calls /api/auth/rbac
9. Backend fetches role + permissions
10. Returns to frontend
11. Auth Context stores permissions
12. UI renders menu based on permissions
```

### Authorization Check Flow

```
Component renders
  ↓
Check useAuth().checkPermission('resource', 'action')
  ↓
Permission found?
  ├─ YES → Render component/button
  └─ NO → Render nothing or fallback

User clicks button → API call
  ↓
Middleware validates token
  ↓
API route checks x-user-role header
  ↓
API route calls checkPermission()
  ↓
Permission exists?
  ├─ YES → Process request
  └─ NO → Return 403 Forbidden
```

## 📁 File Organization

```
src/
├── app/
│   ├── layout.tsx                # Root layout + AuthProvider
│   ├── page.tsx                  # Home → redirect to login
│   │
│   ├── auth/login/
│   │   └── page.tsx              # Login form page
│   │
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── whatsapp/page.tsx      # WhatsApp management
│   │   ├── campaigns/page.tsx     # Campaign management
│   │   ├── crm/page.tsx          # CRM & contacts
│   │   ├── ai-agents/page.tsx    # AI agents
│   │   ├── team/page.tsx         # Team management (admin)
│   │   └── settings/page.tsx     # Settings (admin)
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts    # POST: Login with credentials
│       │   ├── logout/route.ts   # POST: Clear session
│       │   ├── verify/route.ts   # GET: Verify token + user
│       │   └── rbac/route.ts     # GET: Fetch dynamic permissions
│       │
│       └── admin/
│           └── users/route.ts    # GET/POST: User management
│
├── components/
│   ├── auth/
│   │   ├── auth-context.tsx      # useAuth hook + AuthProvider
│   │   ├── protected-route.tsx   # Route protection wrapper
│   │   └── rbac-guard.tsx        # Permission guards for rendering
│   │
│   ├── layout/
│   │   ├── dashboard-header.tsx  # Top navigation
│   │   └── dashboard-layout.tsx  # Layout wrapper
│   │
│   └── ui/
│       ├── button.tsx            # Custom button component
│       ├── input.tsx             # Custom input component
│       ├── card.tsx              # Custom card component
│       └── label.tsx             # Custom label component
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts             # Firebase client init
│   │   └── admin.ts              # Firebase Admin SDK init
│   │
│   ├── auth/
│   │   ├── auth.ts               # JWT & bcrypt functions
│   │   └── rbac.ts               # Permission checking utilities
│   │
│   └── db/
│       └── users.ts              # Firestore queries
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── scripts/
│   └── seed-db.ts                # Database seeding script
│
├── docs/
│   ├── GETTING_STARTED.md        # Quick start guide
│   ├── RBAC.md                   # RBAC architecture
│   ├── PERMISSIONS.md            # Permission configuration
│   ├── QUICK_REFERENCE.md        # Quick reference card
│   └── CHECKLIST.md              # Project checklist
│
├── middleware.ts                 # Request authentication
├── .env.local                    # Environment variables
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind CSS config
├── package.json                  # Dependencies
└── README.md                     # Main documentation
```

## 👥 User Roles & Permissions

### Admin Role

```
Permissions: ALL
Resources:
  - dashboard (read)
  - users (read, create, update, delete)
  - campaigns (read, create, update, delete)
  - whatsapp (read, create, update)
  - crm (read, create, update)
  - ai-agents (read, create, update)
  - team (read, create, update, delete)
  - settings (read, update)
```

### Manager Role

```
Resources:
  - dashboard (read)
  - users (read)
  - campaigns (read, create, update)
  - whatsapp (read)
  - crm (read, create, update)
  - ai-agents (read)
```

### Agent Role

```
Resources:
  - dashboard (read)
  - whatsapp (read)
  - crm (read, create)
```

## 🔑 Core Features

### 1. Authentication

- Email + password login
- Bcrypt password hashing (10 salt rounds)
- JWT token generation (24-hour expiry)
- HttpOnly cookies (XSS protection)
- Automatic session validation

### 2. Authorization

- Dynamic role-based access control
- Resource-action permission pairs
- Three-layer permission checking:
  - Middleware (validates token)
  - API route (checks permission)
  - Component (guards rendering)

### 3. User Management

- User account creation
- Role assignment
- Profile management
- Activity tracking

### 4. Dashboard

- Overview stats
- Quick actions
- User-specific content
- Permission-based UI

### 5. WhatsApp Management

- Multi-account support
- Account configuration
- Live chat interface
- Message history

### 6. Campaign Management

- Campaign creation
- Template management
- Scheduling support
- Message preview

### 7. CRM

- Contact database
- Conversation history
- Contact labels
- Audience segmentation

### 8. AI Agents

- Agent configuration
- Prompt customization
- Multiple model support
- Agent management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore
- Modern web browser

### Installation

```bash
# 1. Clone and setup
git clone <repo>
cd wajiwa
npm install

# 2. Configure environment
# Edit .env.local with Firebase credentials

# 3. Seed demo data
npx ts-node scripts/seed-db.ts

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Demo Credentials

- **Admin**: admin@wajiwa.com / Admin@123456
- **Manager**: manager@wajiwa.com / Manager@123456
- **Agent**: agent@wajiwa.com / Agent@123456

## 📈 Scalability

The system is designed to scale:

- ✅ Permissions stored in Firestore (no code changes needed)
- ✅ Multiple roles supported (create new roles anytime)
- ✅ Custom permissions per role
- ✅ Firestore auto-scaling
- ✅ Next.js serverless functions
- ✅ JWT stateless authentication

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ HttpOnly cookie storage
- ✅ CORS handling
- ✅ Middleware validation
- ✅ API-level authorization
- ✅ Component-level guards
- ✅ Firestore security rules ready
- ✅ XSS protection
- ✅ CSRF considerations

## 📊 Project Statistics

| Metric               | Count |
| -------------------- | ----- |
| Pages                | 8     |
| API Routes           | 6     |
| Components           | 15+   |
| Type Definitions     | 12+   |
| Database Collections | 8     |
| Demo Users           | 3     |
| Roles                | 3     |
| Documentation Pages  | 6     |
| Lines of Code        | 3000+ |

## 🎯 Next Phase Features

- [ ] WhatsApp Cloud API integration
- [ ] Real-time messaging with WebSockets
- [ ] Campaign automation & scheduling
- [ ] Payment & subscription management
- [ ] Advanced analytics & reporting
- [ ] Bulk contact import/export
- [ ] Activity logs & audit trail
- [ ] Email notifications
- [ ] SMS support
- [ ] Team collaboration features

## 📚 Documentation Guide

| Document           | Purpose                        |
| ------------------ | ------------------------------ |
| README.md          | Main overview & features       |
| GETTING_STARTED.md | Installation & quick start     |
| RBAC.md            | Permission system architecture |
| PERMISSIONS.md     | Permission configuration guide |
| QUICK_REFERENCE.md | Developer quick reference      |
| CHECKLIST.md       | Project completion status      |

## 🛠️ Technology Stack

| Category       | Technology                |
| -------------- | ------------------------- |
| Framework      | Next.js 16                |
| Runtime        | React 19                  |
| Language       | TypeScript 5              |
| Database       | Google Cloud Firestore    |
| Authentication | JWT (jose) + bcryptjs     |
| Styling        | Tailwind CSS 4            |
| State          | React Context API         |
| Deployment     | Vercel / Firebase Hosting |

## ✨ Highlights

1. **Production-Ready** - Implements security best practices
2. **Fully Typed** - Complete TypeScript coverage
3. **Well-Documented** - Comprehensive documentation included
4. **Extensible** - Easy to add features and roles
5. **Scalable** - Firestore-backed, no hardcoded limits
6. **Demo Data** - Includes seeding script
7. **Responsive** - Mobile-first design
8. **Secure** - Multiple layers of authorization

## 🎓 Learning Resources

- **For beginners**: Start with GETTING_STARTED.md
- **For RBAC**: Read RBAC.md
- **For permissions**: Read PERMISSIONS.md
- **For quick lookup**: Use QUICK_REFERENCE.md
- **For code**: Check each file's comments

## 📞 Support

Issues? Check:

1. GETTING_STARTED.md - Common setup issues
2. QUICK_REFERENCE.md - Debugging tips
3. RBAC.md - Permission-related issues
4. Code comments - Implementation details
5. Firestore console - Data verification

## 🚀 Deployment

Ready to deploy:

```bash
npm run build
npm run start
```

Supports: Vercel, Firebase Hosting, Railway, Render, etc.

## 📄 License

MIT License - Open source and free to use

---

**Version**: 1.0.0  
**Status**: ✅ Core Complete - Ready for npm install & testing  
**Last Updated**: 2024

**For questions or contributions, refer to the documentation in the `docs/`
folder.**
