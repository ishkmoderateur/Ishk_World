# 🔐 Registration Flow - Complete Guide

## 📋 Overview

This document explains how user registration works in the ishk-platform, from the form submission to database storage.

---

## 🔄 Complete Flow Diagram

```
1. User fills form (Frontend)
   ↓
2. Client-side validation (React)
   ↓
3. POST /api/auth/register (API Route)
   ↓
4. Server-side validation (Validation functions)
   ↓
5. Check if user exists (Prisma query)
   ↓
6. Hash password (bcrypt)
   ↓
7. Create user in database (Prisma)
   ↓
8. Return user data (JSON response)
   ↓
9. Auto sign-in (NextAuth)
   ↓
10. Redirect to profile/admin (Role-based)
```

---

## 📝 Step-by-Step Breakdown

### **Step 1: User Fills Out Form** 
**File:** `src/app/auth/register/page.tsx`

**What happens:**
- User enters:
  - Name (optional)
  - Email (required)
  - Password (required, min 8 chars)
  - Confirm Password (required, must match)

**Code:**
```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");
```

---

### **Step 2: Form Submission Handler**
**File:** `src/app/auth/register/page.tsx` (lines 27-68)

**What happens:**
1. Form is submitted via `onSubmit` handler
2. `e.preventDefault()` stops default form submission
3. **Client-side validation:**
   - Trims all input values
   - Checks if email exists
   - Checks if password exists
   - Validates password length (min 8 chars)
   - Checks if passwords match

**Code:**
```tsx
const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);
  
  // Client-side validation
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const trimmedConfirm = confirm.trim();
  
  // Validation checks...
  if (!trimmedEmail) {
    setError("Email is required");
    return;
  }
  // ... more validation
}
```

---

### **Step 3: API Call to Server**
**File:** `src/app/auth/register/page.tsx` (lines 79-87)

**What happens:**
- Sends POST request to `/api/auth/register`
- Includes: `email`, `password`, `name`
- Waits for server response

**Code:**
```tsx
const res = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    email: trimmedEmail, 
    password: trimmedPassword, 
    name: trimmedName || undefined 
  }),
});
```

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

---

### **Step 4: API Route Receives Request**
**File:** `src/app/api/auth/register/route.ts` (lines 12-14)

**What happens:**
- Next.js API route receives the POST request
- Parses JSON body from request

**Code:**
```tsx
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;
    // ...
  }
}
```

---

### **Step 5: Server-Side Validation**
**File:** `src/app/api/auth/register/route.ts` (lines 27-72)

**What happens:**
1. **Required fields check:** Validates `email` and `password` exist
2. **Email validation:** Uses `validateAndSanitizeEmail()` to:
   - Check email format
   - Trim and lowercase email
3. **Password validation:** Uses `isValidPassword()` to:
   - Check password is a string
   - Validate length (8-128 chars)
4. **Phone validation:** Optional, validates format if provided

**Code:**
```tsx
// Validate required fields
const requiredValidation = validateRequired(body, ["email", "password"]);
if (!requiredValidation.valid) {
  return NextResponse.json(
    { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
    { status: 400 }
  );
}

// Validate and sanitize email
const sanitizedEmail = validateAndSanitizeEmail(email);
if (!sanitizedEmail) {
  return NextResponse.json(
    { error: "Invalid email address" },
    { status: 400 }
  );
}

// Validate password
const passwordValidation = isValidPassword(password);
if (!passwordValidation.valid) {
  return NextResponse.json(
    { error: passwordValidation.error || "Invalid password" },
    { status: 400 }
  );
}
```

---

### **Step 6: Check if User Already Exists**
**File:** `src/app/api/auth/register/route.ts` (lines 74-85)

**What happens:**
- Queries database using Prisma to check if email already exists
- If exists, returns 409 Conflict error

**Code:**
```tsx
// Check if user already exists
const existing = await prisma.user.findUnique({ 
  where: { email: sanitizedEmail } 
});
if (existing) {
  return NextResponse.json(
    { error: "An account with this email already exists" },
    { status: 409 }
  );
}
```

**Database Query:**
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

---

### **Step 7: Hash Password**
**File:** `src/app/api/auth/register/route.ts` (line 88)

**What happens:**
- Uses `bcrypt` to hash the password with 12 rounds
- Password is NEVER stored in plain text
- Only the hash is stored in database

**Code:**
```tsx
// Hash password
const hashed = await bcrypt.hash(password, 12);
```

**Example:**
- Input: `"password123"`
- Output: `"$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5k5Zl.6U8jOqe"`

---

### **Step 8: Create User in Database**
**File:** `src/app/api/auth/register/route.ts` (lines 94-109)
**Database Schema:** `prisma/schema.prisma` (lines 25-49)

**What happens:**
- Creates new user record in database using Prisma
- Stores: email, hashed password, name (optional), phone (optional)
- Default role is `USER` (can be changed later)
- Returns user data (without password!)

**Code:**
```tsx
// Create user
const user = await prisma.user.create({
  data: {
    email: sanitizedEmail,
    password: hashed,
    name: sanitizedName,
    phone: sanitizedPhone,
  },
  select: {
    id: true,
    email: true,
    name: true,
    image: true,
    createdAt: true,
  },
});
```

**Database INSERT:**
```sql
INSERT INTO users (id, email, password, name, phone, role, createdAt, updatedAt)
VALUES (
  'clx1234567890',
  'user@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCO...',
  'John Doe',
  NULL,
  'USER',
  '2024-11-22T15:57:56.000Z',
  '2024-11-22T15:57:56.000Z'
);
```

**User Model Structure:**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  password      String?   // Hashed password
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

### **Step 9: Return Response**
**File:** `src/app/api/auth/register/route.ts` (line 119)

**What happens:**
- Returns 201 Created status
- Includes user data (without password!)

**Code:**
```tsx
return NextResponse.json({ user }, { status: 201 });
```

**Response Example:**
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "createdAt": "2024-11-22T15:57:56.000Z"
  }
}
```

---

### **Step 10: Auto Sign-In After Registration**
**File:** `src/app/auth/register/page.tsx` (lines 100-119)

**What happens:**
- After successful registration, automatically signs in the user
- Uses NextAuth's `signIn()` function
- Uses the same email and password (already validated)

**Code:**
```tsx
// Auto sign-in after registration
const signInRes = await signIn("credentials", {
  redirect: false,
  email: trimmedEmail,
  password: trimmedPassword,
  callbackUrl,
});
```

**Sign-In Flow:**
1. NextAuth validates credentials (`src/lib/auth.ts`)
2. Compares password hash with bcrypt
3. Creates JWT token
4. Sets session cookie
5. Returns success

---

### **Step 11: Role-Based Redirect**
**File:** `src/app/auth/register/page.tsx` (lines 121-157)

**What happens:**
- Fetches user session to get role
- Checks if user is admin using `isAdmin()` function
- Redirects accordingly:
  - **Admin users** → `/admin` dashboard
  - **Regular users** → `/profile` page

**Code:**
```tsx
// Fetch fresh session to get user role
const response = await fetch("/api/auth/session");
const sessionData = await response.json();

let redirectUrl = callbackUrl || "/profile";

if (sessionData?.user?.role && isAdmin(sessionData.user.role)) {
  redirectUrl = "/admin";
  console.log("🔐 Admin user detected, redirecting to admin dashboard");
} else {
  redirectUrl = "/profile";
  console.log("👤 Regular user, redirecting to profile");
}

window.location.href = redirectUrl;
```

---

## 🔐 Security Features

### **1. Password Hashing**
- **Never stores plain text passwords**
- Uses `bcrypt` with 12 rounds
- Password hash is one-way (can't be reversed)

### **2. Input Validation & Sanitization**
- **Client-side:** Validates before submission
- **Server-side:** Validates again (never trust client!)
- **Email:** Sanitized and lowercased
- **Strings:** HTML entities escaped to prevent XSS

### **3. Database Schema**
- Email is **unique** (prevents duplicate accounts)
- Password is **optional** (for OAuth users)
- Role has **default value** (`USER`)

### **4. Error Handling**
- Generic error messages in production
- Detailed error messages in development
- Proper HTTP status codes (400, 409, 500)

---

## 🗄️ Database Connection

### **Prisma Configuration**
**File:** `src/lib/prisma.ts`

**What it does:**
- Creates Prisma client instance
- Connects to SQLite database (configured in `schema.prisma`)
- Singleton pattern (one instance per app)

**Code:**
```tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
```

### **Database Schema**
**File:** `prisma/schema.prisma`

**Key Models:**
1. **User** - Stores user accounts
2. **Account** - NextAuth OAuth accounts
3. **Session** - NextAuth sessions
4. **Product** - E-commerce products
5. **Photography** - Photography portfolio
6. **Campaign** - Association campaigns
7. And more...

**Database Type:** SQLite (file-based, perfect for development)

---

## 📊 Data Flow Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Registration Form (page.tsx)                     │  │
│  │  - User inputs data                               │  │
│  │  - Client-side validation                         │  │
│  │  - Sends POST to /api/auth/register               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP POST
                         │ { email, password, name }
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    API ROUTE (Next.js)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  /api/auth/register (route.ts)                    │  │
│  │  1. Parse request body                            │  │
│  │  2. Validate data (server-side)                   │  │
│  │  3. Check if user exists                          │  │
│  │  4. Hash password (bcrypt)                        │  │
│  │  5. Create user in database (Prisma)              │  │
│  │  6. Return user data                              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Prisma Query
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (SQLite)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  users table                                      │  │
│  │  - id (primary key)                               │  │
│  │  - email (unique)                                 │  │
│  │  - password (hashed)                              │  │
│  │  - name                                           │  │
│  │  - role (default: USER)                           │  │
│  │  - createdAt, updatedAt                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Returns user data
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Registration Success                             │  │
│  │  - Auto sign-in (NextAuth)                        │  │
│  │  - Fetch user role                                │  │
│  │  - Redirect to /profile or /admin                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Files & Their Roles

### **Frontend Files:**
1. **`src/app/auth/register/page.tsx`**
   - Registration form UI
   - Client-side validation
   - Form submission handler
   - Auto sign-in after registration

### **Backend Files:**
2. **`src/app/api/auth/register/route.ts`**
   - API endpoint for registration
   - Server-side validation
   - Password hashing
   - Database operations

### **Validation Files:**
3. **`src/lib/validation.ts`**
   - Email validation
   - Password validation
   - Input sanitization
   - Required fields validation

### **Database Files:**
4. **`prisma/schema.prisma`**
   - Database schema definition
   - User model structure
   - Relationships

5. **`src/lib/prisma.ts`**
   - Prisma client instance
   - Database connection

### **Authentication Files:**
6. **`src/lib/auth.ts`**
   - NextAuth configuration
   - Credentials provider
   - Session management

---

## ✅ Summary

1. **User fills form** → React form component
2. **Client validates** → Checks inputs before sending
3. **API receives request** → Next.js API route
4. **Server validates** → Validates again (security!)
5. **Check existing user** → Prisma database query
6. **Hash password** → bcrypt (never store plain text!)
7. **Create user** → Prisma database insert
8. **Return response** → JSON with user data
9. **Auto sign-in** → NextAuth handles authentication
10. **Redirect user** → Based on role (admin or profile)

**Everything is connected and working! 🎉**

---

## 🔧 Technologies Used

- **Frontend:** React, Next.js, TypeScript
- **Backend:** Next.js API Routes
- **Database:** SQLite (via Prisma ORM)
- **Authentication:** NextAuth.js
- **Password Hashing:** bcryptjs
- **Validation:** Custom validation functions

---

## 🐛 Troubleshooting

**Issue:** Registration fails
- Check browser console for client errors
- Check server console for API errors
- Verify database is running
- Check Prisma connection

**Issue:** Password not working
- Verify password is being hashed
- Check bcrypt comparison in auth.ts
- Ensure password field is not empty

**Issue:** User already exists
- Check database for duplicate emails
- Email must be unique in database

---

**Last Updated:** 2024-11-22


