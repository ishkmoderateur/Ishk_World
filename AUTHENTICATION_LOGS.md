# Authentication Flow Logs

## Overview
This document explains the authentication flow and what logs you'll see for normal users vs administrators.

---

## 🔐 **NORMAL USER LOGIN FLOW**

### 1. **Client-Side (Sign-In Page)**
```
🔐 Client: Attempting login for: user@example.com
🔐 Client: Credentials prepared: { email: "***", hasPassword: true, passwordLength: 8 }
```

### 2. **Server-Side (Auth Config - authorize function)**
```
Missing credentials  // (only in dev mode if credentials missing)
// OR
// Password verification with bcrypt
```

### 3. **JWT Callback (Server-Side)**
```
// User object received, fetching role from database
// Role fetched: USER
// Token created with role: USER
```

### 4. **Session Callback (Server-Side)**
```
// Session created with:
// - user.id
// - user.email
// - user.name
// - user.role: USER
```

### 5. **Client-Side Redirect**
```
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: { user: { id: "...", email: "user@example.com", role: "USER" } }
👤 Regular user, redirecting to profile
✅ Client: Redirecting to: /profile
```

### 6. **Redirect Result**
```
→ User is redirected to: /profile
```

---

## 🔐 **ADMIN USER LOGIN FLOW**

### 1. **Client-Side (Sign-In Page)**
```
🔐 Client: Attempting login for: admin@example.com
🔐 Client: Credentials prepared: { email: "***", hasPassword: true, passwordLength: 12 }
```

### 2. **Server-Side (Auth Config - authorize function)**
```
// Password verification with bcrypt
// User found in database
```

### 3. **JWT Callback (Server-Side)**
```
// User object received, fetching role from database
// Role fetched: SUPER_ADMIN (or ADMIN_BOUTIQUE, ADMIN_PHOTOGRAPHY, etc.)
// Token created with role: SUPER_ADMIN
```

### 4. **Session Callback (Server-Side)**
```
// Session created with:
// - user.id
// - user.email
// - user.name
// - user.role: SUPER_ADMIN (or other admin role)
```

### 5. **Client-Side Redirect**
```
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: { user: { id: "...", email: "admin@example.com", role: "SUPER_ADMIN" } }
🔐 Admin user detected (role: SUPER_ADMIN), redirecting to admin dashboard
✅ Client: Redirecting to: /admin
```

### 6. **Redirect Result**
```
→ Admin is redirected to: /admin
```

---

## 🎯 **ROLE-BASED REDIRECTION LOGIC**

### Admin Roles (Redirected to `/admin`)
- `SUPER_ADMIN` → `/admin` (full access to all sections)
- `ADMIN_NEWS` → `/admin` (access to news section)
- `ADMIN_PARTY` → `/admin` (access to party/venues section)
- `ADMIN_BOUTIQUE` → `/admin` (access to products section)
- `ADMIN_ASSOCIATION` → `/admin` (access to campaigns section)
- `ADMIN_PHOTOGRAPHY` → `/admin` (access to photography section)

### Regular Users (Redirected to `/profile`)
- `USER` → `/profile` (no admin access)

---

## 📋 **CODE LOCATIONS**

### 1. **Sign-In Page**
- File: `src/app/auth/signin/page.tsx`
- Lines: 24-102
- Function: `onSubmit()`
- Key Logic:
  ```typescript
  if (sessionData?.user?.role && isAdmin(sessionData.user.role)) {
    redirectUrl = "/admin";
  } else {
    redirectUrl = "/profile";
  }
  ```

### 2. **Auth Configuration**
- File: `src/lib/auth.ts`
- Lines: 57-108 (authorize function)
- Lines: 119-169 (JWT callback)
- Lines: 171-186 (Session callback)
- Key Logic:
  ```typescript
  // In authorize: Returns user object
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
  
  // In JWT callback: Fetches role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  token.role = dbUser.role;
  
  // In Session callback: Adds role to session
  session.user.role = token.role;
  ```

### 3. **Role Check**
- File: `src/lib/roles.ts`
- Function: `isAdmin(role)`
- Logic:
  ```typescript
  export function isAdmin(role?: UserRole | string): boolean {
    if (!role) return false;
    return role !== "USER";
  }
  ```

---

## 🔍 **DEBUGGING LOGS**

### To see logs in browser console:
1. Open DevTools (F12)
2. Go to Console tab
3. Log in as user
4. You'll see:
   - `🔐 Client: Attempting login for: ...`
   - `✅ Client: Login successful`
   - `🔐 Session data: ...`
   - `🔐 Admin user detected...` OR `👤 Regular user...`
   - `✅ Client: Redirecting to: ...`

### To see logs in server console:
1. Check terminal/console where Next.js is running
2. You'll see:
   - `Missing credentials` (if credentials missing)
   - `Error fetching user role:` (if role fetch fails)

---

## ✅ **TESTING SCENARIOS**

### Test 1: Normal User Login
```
Email: user@example.com
Password: [user password]
Expected: Redirect to /profile
Logs: 👤 Regular user, redirecting to profile
```

### Test 2: Super Admin Login
```
Email: admin@example.com
Password: [admin password]
Role: SUPER_ADMIN
Expected: Redirect to /admin
Logs: 🔐 Admin user detected (role: SUPER_ADMIN), redirecting to admin dashboard
```

### Test 3: Section Admin Login (e.g., Photography Admin)
```
Email: photo-admin@example.com
Password: [admin password]
Role: ADMIN_PHOTOGRAPHY
Expected: Redirect to /admin
Logs: 🔐 Admin user detected (role: ADMIN_PHOTOGRAPHY), redirecting to admin dashboard
```

---

## 🎯 **CALLBACK URL BEHAVIOR**

### If callbackUrl is explicitly set:
```
Example: /auth/signin?callbackUrl=/boutique
Result: User redirected to /boutique (regardless of role)
Logs: 🔗 Using explicit callbackUrl: /boutique
```

### If callbackUrl is /profile or not set:
```
For Admin: Redirects to /admin (admin dashboard)
For User: Redirects to /profile (user profile)
```

---

## 📊 **SESSION DATA STRUCTURE**

### Normal User Session:
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "role": "USER"
  },
  "expires": "2024-..."
}
```

### Admin User Session:
```json
{
  "user": {
    "id": "clx456...",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "role": "SUPER_ADMIN"  // or ADMIN_BOUTIQUE, ADMIN_PHOTOGRAPHY, etc.
  },
  "expires": "2024-..."
}
```

---

## 🔄 **REGISTRATION FLOW**

### New User Registration:
1. User fills registration form
2. Account created with role: `USER` (default)
3. Auto sign-in after registration
4. Same redirect logic applies:
   - Normal user → `/profile`
   - Admin user → `/admin` (if somehow admin role was set during registration)

---

## ⚠️ **IMPORTANT NOTES**

1. **Session Update Delay**: There's a 200ms delay after `update()` to ensure session is fully synced before checking role
2. **Fallback**: If session fetch fails, defaults to `/profile` redirect
3. **Role Fetching**: Role is always fetched from database in JWT callback, ensuring it's always up-to-date
4. **Console Logs**: All logs are prefixed with emojis for easy identification:
   - 🔐 = Authentication related
   - ✅ = Success
   - 👤 = User
   - ⚠️ = Warning

---

## 📝 **SUMMARY**

- **Normal Users**: Always redirected to `/profile`
- **Admin Users** (any admin role): Always redirected to `/admin`
- **Explicit callbackUrl**: Always respected if set
- **Session Role**: Fetched from database on every login
- **Redirect Logic**: Checked after successful login and session update


