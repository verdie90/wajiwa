# Wajiwa Quick Reference

## 🚀 Get Started in 3 Steps

```bash
npm install
npx ts-node scripts/seed-db.ts
npm run dev
```

Then visit `http://localhost:3000`

## 🔑 Demo Accounts

| User    | Email              | Password       | Access         |
| ------- | ------------------ | -------------- | -------------- |
| Admin   | admin@wajiwa.com   | Admin@123456   | ✅ Full Access |
| Manager | manager@wajiwa.com | Manager@123456 | 📊 Limited     |
| Agent   | agent@wajiwa.com   | Agent@123456   | 💬 Minimal     |

## 📁 Project Structure Quick Map

```
wajiwa/
├── app/api/auth/          → Login, logout, permissions
├── app/dashboard/         → Protected pages
├── components/auth/       → useAuth hook, guards
├── lib/auth/             → JWT, bcrypt, RBAC
├── lib/firebase/         → Firebase init
├── types/index.ts        → All TypeScript types
├── scripts/seed-db.ts    → Demo data
└── docs/                 → Full documentation
```

## 🔐 Permission Checking Examples

### Component Level

```tsx
import { RBACGuard } from '@/components/auth/rbac-guard'

// Option 1: Hide component if no permission
;<RBACGuard
  resource='users'
  action='delete'>
  <DeleteButton />
</RBACGuard>

// Option 2: Check manually
const { checkPermission } = useAuth()
if (!checkPermission('users', 'delete')) {
  return <div>No permission</div>
}
```

### API Level

```typescript
const role = request.headers.get('x-user-role')
if (!checkPermission(role, 'users', 'create')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

## 📚 Key Files Reference

| File                               | Purpose             | Key Export                           |
| ---------------------------------- | ------------------- | ------------------------------------ |
| `lib/auth/auth.ts`                 | Password & JWT      | hashPassword, signToken, verifyToken |
| `lib/auth/rbac.ts`                 | Permission check    | checkPermission                      |
| `components/auth/auth-context.tsx` | Global state        | useAuth hook                         |
| `app/api/auth/rbac/route.ts`       | Dynamic permissions | GET endpoint                         |
| `types/index.ts`                   | Type definitions    | All interfaces                       |

## 🎯 Common Tasks

### Add New Role

1. Firestore: Create doc in `roles` collection
2. Structure: `{ name, description, permissions[] }`
3. Done! - Menu updates automatically

### Restrict API Endpoint

```typescript
// 1. Get role from headers (set by middleware)
const role = request.headers.get('x-user-role')

// 2. Check permission
if (!checkPermission(role, 'resource', 'action')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Hide UI Element

```tsx
<RBACGuard
  resource='team'
  action='read'>
  <TeamSection />
</RBACGuard>
```

### Check Permission Programmatically

```tsx
const { checkPermission, hasAccess } = useAuth()

// Specific permission
const canDelete = checkPermission('users', 'delete')

// Any permission in resource
const hasAccess = hasAccess('campaigns')
```

## 🛠️ Debugging

| Issue             | Solution                                         |
| ----------------- | ------------------------------------------------ |
| npm install fails | Run: `npm install --legacy-peer-deps`            |
| Login fails       | Check user exists in Firestore with correct role |
| Menu empty        | Verify role has permissions in Firestore         |
| Permission denied | Check API checking correct resource/action       |
| CORS errors       | Check middleware and API route headers           |

## 📊 Database Quick Reference

### Collections

- `users` - Email, password hash, role
- `roles` - Name, description, permissions array
- `contacts` - CRM contact data
- `campaigns` - Campaign templates
- `whatsapp_accounts` - Account config
- `ai_agents` - Chatbot config

### Queries

```typescript
// Get user
db.collection('users').where('email', '==', email).get()

// Get role with permissions
db.collection('roles').where('name', '==', roleName).get()

// Get all users
db.collection('users').get()
```

## 🔄 API Endpoints Reference

```
POST /api/auth/login
  Body: { email, password }
  Response: { user: { id, email, role } }

POST /api/auth/logout
  Response: { message: 'Logged out' }

GET /api/auth/verify
  Response: { authenticated, user }

GET /api/auth/rbac
  Response: { role, permissions[], availableResources[] }

GET /api/admin/users
  Response: { users: [] }

POST /api/admin/users
  Body: { email, password, role }
  Response: { user: { id, email, role } }
```

## 🧪 Testing Permissions

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wajiwa.com","password":"Admin@123456"}'

# Check permissions
curl -X GET http://localhost:3000/api/auth/rbac

# List users
curl -X GET http://localhost:3000/api/admin/users
```

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens in httpOnly cookies
- ✅ Middleware validates all requests
- ✅ API checks permissions before processing
- ✅ Components guard rendering with RBACGuard
- ✅ Roles fetched dynamically from Firestore
- ✅ Three-layer permission checking

## 📦 Dependencies Overview

| Package        | Purpose                  |
| -------------- | ------------------------ |
| firebase       | Client SDK               |
| firebase-admin | Admin SDK                |
| bcryptjs       | Password hashing         |
| jose           | JWT signing/verification |
| next           | Framework                |
| react          | UI library               |
| typescript     | Type safety              |
| tailwindcss    | Styling                  |

## 🎓 Learning Path

1. Read: `GETTING_STARTED.md` - Get up and running
2. Read: `RBAC.md` - Understand permission system
3. Read: `PERMISSIONS.md` - Learn to configure access
4. Explore: `types/index.ts` - See data structures
5. Review: `app/api/auth/login/route.ts` - See auth flow
6. Check: `components/auth/auth-context.tsx` - See permission loading

## ⚡ Performance Tips

- Permissions cached in React Context (no repeated API calls)
- Menu items filtered once on component mount
- RBAC checks are O(n) array operations (fast)
- Database queries indexed on email and role name

## 🚀 Production Checklist

- [ ] Run `npm install`
- [ ] Set production Firebase credentials
- [ ] Run seed-db.ts with real data
- [ ] Test all user roles
- [ ] Enable Firestore security rules
- [ ] Set JWT secret securely
- [ ] Build: `npm run build`
- [ ] Deploy to hosting platform
- [ ] Test production deployment
- [ ] Monitor error logs

## 📞 Quick Troubleshooting

**Can't login?**

- Check email exists in Firestore users collection
- Verify password was hashed with bcrypt
- Check role field matches a role name

**Menu items not showing?**

- Check Firestore has role document
- Verify permissions array in role
- Check /api/auth/rbac returns correct data

**API returning 403?**

- Check x-user-role header set by middleware
- Verify role has permission in Firestore
- Check resource and action names match

## 🔗 Useful Links

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Spec](https://tools.ietf.org/html/rfc7519)

---

**For detailed docs, see**: `docs/` folder  
**For permissions guide, see**: `docs/PERMISSIONS.md`  
**For RBAC architecture, see**: `docs/RBAC.md`
