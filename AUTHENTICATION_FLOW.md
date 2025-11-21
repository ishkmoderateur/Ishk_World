# 🔐 Authentication Flow Explanation

## Overview
This application uses **NextAuth.js v5 (beta.30)** with **JWT strategy** for authentication. The system supports both **Credentials** (email/password) and **Google OAuth** login methods.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Login Flow (Step-by-Step)](#login-flow-step-by-step)
3. [Logout Flow](#logout-flow)
4. [Session Management](#session-management)
5. [Role-Based Access Control](#role-based-access-control)
6. [Security Features](#security-features)

---

## 🏗️ Architecture Overview

### Components Involved:
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-SIDE (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ SignIn Form  │  │   Navbar     │  │  Components  │     │
│  │  (React)     │  │  (React)     │  │  (React)     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │ next-auth/react │                        │
│                    │  (Client SDK)   │                        │
│                    └───────┬─────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                            │ HTTP Requests
                            │ (POST /api/auth/callback/credentials)
┌────────────────────────────▼──────────────────────────────────┐
│                  SERVER-SIDE (Next.js API)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         /api/auth/[...nextauth]/route.ts              │   │
│  │         (NextAuth.js API Route Handler)               │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │   src/lib/auth.ts       │                          │
│         │   (Auth Configuration)  │                          │
│         └────────────┬────────────┘                          │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │  CredentialsProvider    │                          │
│         │  (authorize function)    │                          │
│         └────────────┬────────────┘                          │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │   Prisma + SQLite      │                          │
│         │   (Database Query)      │                          │
│         └────────────┬────────────┘                          │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │   bcrypt.compare()     │                          │
│         │   (Password Verify)    │                          │
│         └────────────┬────────────┘                          │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │   JWT Token Creation   │                          │
│         │   (jwt callback)       │                          │
│         └────────────┬────────────┘                          │
│                      │                                        │
│         ┌────────────▼────────────┐                          │
│         │   Session Creation     │                          │
│         │   (session callback)   │                          │
│         └────────────────────────┘                          │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 Login Flow (Step-by-Step)

### **1. User Submits Login Form**

**File:** `src/app/auth/signin/page.tsx`

```typescript
const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  
  // Normalize email (trim + lowercase)
  const res = await signIn("credentials", {
    redirect: false,
    email: email.trim().toLowerCase(),
    password,
    callbackUrl,
  });
  // ... handle response
};
```

**What happens:**
- User enters email and password
- Form prevents default submission
- `signIn()` from `next-auth/react` is called
- Email is normalized (trimmed and lowercased)

---

### **2. NextAuth Client SDK Sends Request**

**What happens:**
- `signIn("credentials", {...})` makes a **POST** request to:
  ```
  POST /api/auth/callback/credentials
  ```
- Request body contains:
  ```json
  {
    "email": "admin@ishk.com",
    "password": "admin123",
    "redirect": false,
    "callbackUrl": "/profile"
  }
  ```

---

### **3. NextAuth API Route Handler**

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

**What happens:**
- Next.js catches `/api/auth/*` routes
- Routes to NextAuth.js handler
- Handler processes the credentials request

---

### **4. Credentials Provider - Authorization**

**File:** `src/lib/auth.ts` (lines 57-108)

```typescript
CredentialsProvider({
  async authorize(credentials) {
    // 1. Validate credentials exist
    if (!credentials?.email || !credentials?.password) {
      return null; // Reject
    }

    // 2. Normalize email
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // 3. Query database for user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        password: true,  // Hashed password
        role: true,
      },
    });

    // 4. Check if user exists and has password
    if (!user || !user.password) {
      return null; // Reject
    }

    // 5. Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null; // Reject
    }

    // 6. Return user object (without password!)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      // Note: role is NOT included here - it's added in jwt callback
    };
  },
})
```

**What happens:**
1. ✅ Validates credentials are provided
2. ✅ Normalizes email (trim + lowercase)
3. ✅ Queries Prisma database for user by email
4. ✅ Checks user exists and has password
5. ✅ Verifies password using `bcrypt.compare()`
6. ✅ Returns user object (password excluded)

**Security Notes:**
- Password is **never** returned in the user object
- Email is normalized to prevent duplicate accounts
- Uses `bcrypt.compare()` for secure password verification

---

### **5. JWT Callback - Token Creation**

**File:** `src/lib/auth.ts` (lines 119-164)

```typescript
async jwt({ token, user, trigger }) {
  // On initial login, user object is provided
  if (user) {
    // Add user info to token
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
    token.picture = user.image;
    
    // Fetch user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    
    token.role = dbUser?.role || "USER";
  }
  
  return token;
}
```

**What happens:**
1. On **first login**, `user` object is provided
2. User data is added to JWT token
3. **Role is fetched from database** (not from authorize return)
4. Token is signed with `NEXTAUTH_SECRET`
5. Token is stored in **HTTP-only cookie**

**JWT Token Structure:**
```json
{
  "id": "clx123...",
  "email": "admin@ishk.com",
  "name": "Admin User",
  "picture": null,
  "role": "SUPER_ADMIN",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

### **6. Session Callback - Session Creation**

**File:** `src/lib/auth.ts` (lines 166-181)

```typescript
async session({ session, token }) {
  if (session.user) {
    // Copy data from JWT token to session
    session.user.id = token.id as string;
    session.user.role = token.role as UserRole | undefined;
    session.user.email = token.email as string;
    session.user.name = token.name as string;
    session.user.image = token.picture as string;
  }
  return session;
}
```

**What happens:**
1. JWT token is decoded
2. Token data is copied to session object
3. Session is returned to client

**Session Object Structure:**
```typescript
{
  user: {
    id: "clx123...",
    email: "admin@ishk.com",
    name: "Admin User",
    image: null,
    role: "SUPER_ADMIN"
  },
  expires: "2024-01-01T12:00:00.000Z"
}
```

---

### **7. Response to Client**

**What happens:**
- NextAuth returns response to client
- If `redirect: false`, returns:
  ```json
  {
    "ok": true,
    "error": null,
    "status": 200,
    "url": "/profile"
  }
  ```
- If `redirect: true`, redirects to `callbackUrl`

---

### **8. Client-Side Session Update**

**File:** `src/app/auth/signin/page.tsx` (lines 58-76)

```typescript
if (res.ok) {
  // Update session to get latest data
  await update();
  
  // Redirect to callback URL
  router.push(callbackUrl);
  router.refresh(); // Refresh to update server components
}
```

**What happens:**
1. `update()` refreshes the session from server
2. Router navigates to callback URL
3. `router.refresh()` updates server components

---

## 🚪 Logout Flow

### **1. User Clicks Logout Button**

**File:** `src/components/navbar.tsx` or admin panel

```typescript
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ 
    redirect: true,
    callbackUrl: "/" 
  });
};
```

---

### **2. NextAuth SignOut Request**

**What happens:**
- `signOut()` makes a **POST** request to:
  ```
  POST /api/auth/signout
  ```
- NextAuth handler processes the request

---

### **3. Session Destruction**

**What happens:**
1. **JWT token is invalidated** (cookie is cleared)
2. **Session cookie is deleted** from browser
3. **Database session** (if using database strategy) is deleted

---

### **4. Redirect to Homepage**

**What happens:**
- User is redirected to `/` (homepage)
- Session is now `null`
- Protected routes will redirect to `/auth/signin`

---

## 🔒 Session Management

### **JWT Strategy (Current Implementation)**

**Configuration:**
```typescript
session: {
  strategy: "jwt",  // Uses JWT tokens, not database sessions
}
```

**How it works:**
1. **Token Storage:** JWT stored in **HTTP-only cookie** named `next-auth.session-token`
2. **Token Expiry:** Default 30 days (configurable)
3. **Token Refresh:** Automatically refreshed on each request
4. **No Database:** Sessions are stateless (no database queries needed)

**Advantages:**
- ✅ Fast (no database queries)
- ✅ Scalable (stateless)
- ✅ Works with serverless

**Disadvantages:**
- ❌ Cannot revoke sessions instantly (must wait for expiry)
- ❌ Token size limited (cookie size limits)

---

### **Accessing Session in Components**

**Client Components:**
```typescript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not logged in</div>;
  
  return <div>Hello {session?.user?.email}</div>;
}
```

**Server Components:**
```typescript
import { auth } from "@/lib/auth";

export default async function ServerComponent() {
  const session = await auth();
  
  if (!session) {
    return <div>Not logged in</div>;
  }
  
  return <div>Hello {session.user.email}</div>;
}
```

---

## 👥 Role-Based Access Control (RBAC)

### **User Roles**

**Defined in:** `prisma/schema.prisma`

```prisma
enum UserRole {
  USER
  SUPER_ADMIN
  ADMIN_NEWS
  ADMIN_PARTY
  ADMIN_BOUTIQUE
  ADMIN_ASSOCIATION
  ADMIN_PHOTOGRAPHY
}
```

### **Role Checking**

**File:** `src/lib/roles.ts`

```typescript
export function isAdmin(role: UserRole | undefined): boolean {
  return role !== undefined && role !== "USER";
}

export function isSuperAdmin(role: UserRole | undefined): boolean {
  return role === "SUPER_ADMIN";
}

export function canAccessSection(
  role: UserRole | undefined,
  section: "news" | "party" | "boutique" | "association" | "photography"
): boolean {
  if (isSuperAdmin(role)) return true;
  
  const roleMap = {
    news: "ADMIN_NEWS",
    party: "ADMIN_PARTY",
    boutique: "ADMIN_BOUTIQUE",
    association: "ADMIN_ASSOCIATION",
    photography: "ADMIN_PHOTOGRAPHY",
  };
  
  return role === roleMap[section];
}
```

### **API Route Protection**

**Example:** `src/app/api/admin/users/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/roles";

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!isSuperAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // ... fetch users
}
```

---

## 🛡️ Security Features

### **1. Password Hashing**

**Registration:** `src/app/api/auth/register/route.ts`

```typescript
const hashed = await bcrypt.hash(password, 12); // 12 rounds
```

**Verification:** `src/lib/auth.ts`

```typescript
const isValid = await bcrypt.compare(password, user.password);
```

**Security:**
- ✅ Passwords are **never stored in plain text**
- ✅ Uses **bcrypt** with **12 rounds** (very secure)
- ✅ Passwords are **never returned** in API responses

---

### **2. Input Validation & Sanitization**

**File:** `src/lib/validation.ts`

```typescript
// Email validation
validateAndSanitizeEmail(email)

// Password validation
isValidPassword(password) // Min 8 chars, complexity rules

// String sanitization
sanitizeString(input) // Prevents XSS
```

**Applied in:**
- ✅ Registration endpoint
- ✅ Login endpoint (email normalization)
- ✅ All user input fields

---

### **3. HTTP-Only Cookies**

**Configuration:**
- JWT tokens stored in **HTTP-only cookies**
- Cannot be accessed via JavaScript (prevents XSS)
- Automatically sent with requests

---

### **4. CSRF Protection**

**NextAuth.js automatically:**
- ✅ Generates CSRF tokens
- ✅ Validates CSRF tokens on each request
- ✅ Protects against Cross-Site Request Forgery

---

### **5. Environment Variables**

**Required:**
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

**Security:**
- ✅ `NEXTAUTH_SECRET` must be strong (32+ characters)
- ✅ Never commit `.env` to version control
- ✅ Use different secrets for dev/prod

---

## 📊 Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (SignIn)   │
└──────┬──────┘
       │
       │ POST /api/auth/callback/credentials
       │ { email, password }
       ▼
┌─────────────────────┐
│  NextAuth Handler   │
└──────┬──────────────┘
       │
       │ authorize()
       ▼
┌─────────────────────┐
│   Prisma Query      │
│  (Find User)        │
└──────┬──────────────┘
       │
       │ bcrypt.compare()
       ▼
┌─────────────────────┐
│  Password Verify    │
└──────┬──────────────┘
       │
       │ jwt() callback
       ▼
┌─────────────────────┐
│  Create JWT Token   │
│  (Include Role)     │
└──────┬──────────────┘
       │
       │ session() callback
       ▼
┌─────────────────────┐
│  Create Session     │
│  (Return to Client) │
└──────┬──────────────┘
       │
       │ HTTP Response
       ▼
┌─────────────┐
│   Browser   │
│ (Logged In) │
└─────────────┘
```

---

## 🔍 Debugging Tips

### **Check Session:**
```typescript
// Browser Console
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log);
```

### **Check Token:**
```typescript
// Server-side
const session = await auth();
console.log(session);
```

### **Common Issues:**

1. **"CredentialsSignin" Error:**
   - ❌ Wrong password
   - ❌ User doesn't exist
   - ❌ User has no password (OAuth only)

2. **Session Not Updating:**
   - ✅ Call `update()` after login
   - ✅ Check `NEXTAUTH_SECRET` is set
   - ✅ Verify cookie is being set

3. **Role Not Showing:**
   - ✅ Check `jwt()` callback fetches role
   - ✅ Verify database has role set
   - ✅ Check `session()` callback includes role

---

## 📝 Summary

**Login Process:**
1. User submits form → `signIn("credentials")`
2. NextAuth calls `authorize()` → Verify password
3. `jwt()` callback → Create token with role
4. `session()` callback → Create session
5. Client receives session → User logged in

**Logout Process:**
1. User clicks logout → `signOut()`
2. NextAuth clears cookie → Session destroyed
3. Redirect to homepage → User logged out

**Security:**
- ✅ Passwords hashed with bcrypt
- ✅ JWT in HTTP-only cookies
- ✅ CSRF protection
- ✅ Input validation & sanitization
- ✅ Role-based access control

---

**Last Updated:** 2024-01-XX
**NextAuth.js Version:** v5 (beta.30)
**Strategy:** JWT (stateless)

