# Registration System - Quick Reference

## File Structure

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx          (Updated with register link)
│   └── register/
│       └── page.tsx          (NEW - Registration form)
└── api/
    └── auth/
        ├── login/
        │   └── route.ts      (Existing)
        └── register/
            └── route.ts      (NEW - Registration API)
```

## Features at a Glance

| Feature               | Details                                 |
| --------------------- | --------------------------------------- |
| **Registration Page** | `/auth/register`                        |
| **API Endpoint**      | `POST /api/auth/register`               |
| **Form Fields**       | Name, Email, Password, Confirm Password |
| **Password Rules**    | Min 8 chars, 1 uppercase, 1 number      |
| **Email Validation**  | Format check + duplicate detection      |
| **Storage**           | Firestore (hashed password)             |
| **Success Flow**      | Show message → Redirect to login        |
| **Error Handling**    | Real-time field validation              |

## Form Validation Flow

```
User Input
    ↓
Client-Side Validation
├─ Name length >= 2
├─ Email format valid
├─ Password >= 8 chars + rules
└─ Passwords match
    ↓
Send to /api/auth/register
    ↓
Server-Side Validation
├─ All fields required
├─ Email not in database
├─ Password strong
└─ Email format valid
    ↓
Create User (bcrypt hash)
    ↓
Return Success/Error
```

## Password Strength Example

✅ **Good:** `Admin@123456`

- Length: 12 characters (>= 8)
- Uppercase: A, a (has A)
- Number: 1, 2, 3, 4, 4, 6 (has multiple)

❌ **Bad:** `password123`

- Missing uppercase letter

❌ **Bad:** `Password`

- Missing number

## Testing Checklist

- [ ] Navigate to `/auth/register`
- [ ] Fill form with valid data
- [ ] Submit registration
- [ ] Verify user created in Firestore
- [ ] Verify redirect to login page
- [ ] Try to register same email again (error)
- [ ] Try weak password (error)
- [ ] Try non-matching passwords (error)
- [ ] Login with new account

## Login After Registration

After successful registration, user will be redirected to `/auth/login` where
they can:

1. Enter their registered email
2. Enter their password
3. Click "Sign in"
4. Access dashboard

## Demo Account (Still Available)

For testing without registration:

- **Email:** admin@wajiwa.com
- **Password:** Admin@123456

## Key Differences from Login

| Aspect       | Login                  | Register                  |
| ------------ | ---------------------- | ------------------------- |
| **URL**      | `/auth/login`          | `/auth/register`          |
| **Purpose**  | Verify existing user   | Create new user           |
| **API**      | `POST /api/auth/login` | `POST /api/auth/register` |
| **Response** | JWT Token              | Success message           |
| **Role**     | From database          | Default 'user'            |
| **Fields**   | Email, Password        | Name, Email, Password     |

## Security Highlights

✅ Passwords hashed with bcryptjs (10 salt rounds) ✅ Client & server-side
validation ✅ Email uniqueness enforced ✅ Proper error messages ✅ No sensitive
data in responses ✅ New users get 'user' role (not 'admin')

## Common Issues & Solutions

**"Email already registered"**

- Email is already in database
- User should login instead or use different email

**"Passwords do not match"**

- Confirm password doesn't match password field
- Check both fields carefully

**"Password must contain..."**

- Password needs uppercase letter or number
- See password requirements section

**"Invalid email format"**

- Email doesn't have @ or proper domain
- Example: `user@example.com`

## Links

- Register page: `http://localhost:3000/auth/register`
- Login page: `http://localhost:3000/auth/login`
- Dashboard: `http://localhost:3000/dashboard` (authenticated users)

---

**Created:** November 8, 2025 **Status:** Complete ✅ **Next:** Email
verification or password reset
