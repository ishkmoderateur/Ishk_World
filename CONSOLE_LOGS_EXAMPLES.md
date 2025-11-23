# Console Logs Examples

## 🔐 **NORMAL USER LOGIN LOGS**

### Browser Console (F12 → Console Tab)

```
🔐 Client: Attempting login for: user@example.com
🔐 Client: Credentials prepared: { 
  email: "***", 
  hasPassword: true, 
  passwordLength: 8 
}
🔐 Client: SignIn response: {
  "ok": true,
  "error": null,
  "status": 200,
  "url": null
}
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: {
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "role": "USER"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
👤 Regular user, redirecting to profile
✅ Client: Redirecting to: /profile
```

### Server Console (Terminal where Next.js runs)

```
Missing credentials  // (only if credentials are missing)
// OR (if credentials provided)
// Password verification with bcrypt
// User found: user@example.com
// Role fetched from database: USER
// JWT token created with role: USER
// Session created successfully
```

---

## 🔐 **ADMIN USER LOGIN LOGS**

### Browser Console (F12 → Console Tab)

```
🔐 Client: Attempting login for: admin@example.com
🔐 Client: Credentials prepared: { 
  email: "***", 
  hasPassword: true, 
  passwordLength: 12 
}
🔐 Client: SignIn response: {
  "ok": true,
  "error": null,
  "status": 200,
  "url": null
}
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: {
  "user": {
    "id": "clx9876543210",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "role": "SUPER_ADMIN"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
🔐 Admin user detected (role: SUPER_ADMIN), redirecting to admin dashboard
✅ Client: Redirecting to: /admin
```

### Server Console (Terminal where Next.js runs)

```
// Password verification with bcrypt
// User found: admin@example.com
// Role fetched from database: SUPER_ADMIN
// JWT token created with role: SUPER_ADMIN
// Session created successfully
```

---

## 🔐 **SECTION ADMIN LOGIN LOGS**

### Example: Photography Admin

#### Browser Console

```
🔐 Client: Attempting login for: photo-admin@example.com
🔐 Client: Credentials prepared: { 
  email: "***", 
  hasPassword: true, 
  passwordLength: 10 
}
🔐 Client: SignIn response: {
  "ok": true,
  "error": null,
  "status": 200,
  "url": null
}
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: {
  "user": {
    "id": "clx5555555555",
    "email": "photo-admin@example.com",
    "name": "Photo Admin",
    "image": null,
    "role": "ADMIN_PHOTOGRAPHY"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
🔐 Admin user detected (role: ADMIN_PHOTOGRAPHY), redirecting to admin dashboard
✅ Client: Redirecting to: /admin
```

#### Server Console

```
// Password verification with bcrypt
// User found: photo-admin@example.com
// Role fetched from database: ADMIN_PHOTOGRAPHY
// JWT token created with role: ADMIN_PHOTOGRAPHY
// Session created successfully
```

---

## ❌ **FAILED LOGIN LOGS**

### Browser Console

```
🔐 Client: Attempting login for: wrong@example.com
🔐 Client: Credentials prepared: { 
  email: "***", 
  hasPassword: true, 
  passwordLength: 8 
}
🔐 Client: SignIn response: {
  "ok": false,
  "error": "CredentialsSignin",
  "status": 401,
  "url": null
}
🔐 Client: SignIn failed: Invalid credentials
```

### Server Console

```
// Password verification with bcrypt
// Password mismatch OR user not found
// Returning null from authorize function
```

---

## 📋 **REGISTRATION LOGS**

### Browser Console

```
// Registration request sent
// Registration successful
// Auto sign-in attempt...
🔐 Client: Attempting login for: newuser@example.com
✅ Client: Login successful
✅ Client: Session updated successfully
🔐 Session data: {
  "user": {
    "id": "clx9999999999",
    "email": "newuser@example.com",
    "name": "New User",
    "image": null,
    "role": "USER"
  }
}
👤 Regular user, redirecting to profile
✅ Client: Redirecting to: /profile
```

---

## 🔍 **HOW TO VIEW LOGS**

### Browser Console:
1. Open your browser (Chrome/Firefox/Edge)
2. Press `F12` or right-click → "Inspect"
3. Go to "Console" tab
4. Log in
5. You'll see all the logs with emoji prefixes

### Server Console:
1. Open your terminal/command prompt
2. Navigate to project directory
3. Look at the terminal where `npm run dev` or `next dev` is running
4. You'll see server-side logs there

---

## 🎯 **LOG PREFIXES EXPLANATION**

- `🔐` = Authentication/Login related
- `✅` = Success operation
- `👤` = Regular user action
- `🔗` = Using explicit callback URL
- `❌` = Error occurred
- `⚠️` = Warning (non-critical)

---

## 📊 **SESSION DATA STRUCTURE**

### Normal User Session:
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "role": "USER"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
```

### Super Admin Session:
```json
{
  "user": {
    "id": "clx9876543210",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "role": "SUPER_ADMIN"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
```

### Photography Admin Session:
```json
{
  "user": {
    "id": "clx5555555555",
    "email": "photo-admin@example.com",
    "name": "Photo Admin",
    "image": null,
    "role": "ADMIN_PHOTOGRAPHY"
  },
  "expires": "2024-11-22T15:57:56.000Z"
}
```

---

## 🔄 **REDIRECT FLOW**

### Normal User:
```
Login → Session Update → Fetch Session → Check Role: "USER" → Redirect to /profile
```

### Admin User:
```
Login → Session Update → Fetch Session → Check Role: "SUPER_ADMIN" → Redirect to /admin
```

---

## 🧪 **TESTING LOGS**

### Test 1: Normal User
1. Go to `/auth/signin`
2. Enter: `user@example.com` / `password123`
3. Check console logs
4. Expected: `👤 Regular user, redirecting to profile`

### Test 2: Super Admin
1. Go to `/auth/signin`
2. Enter: `admin@example.com` / `adminpassword`
3. Check console logs
4. Expected: `🔐 Admin user detected (role: SUPER_ADMIN), redirecting to admin dashboard`

### Test 3: Section Admin
1. Go to `/auth/signin`
2. Enter: `photo-admin@example.com` / `password`
3. Check console logs
4. Expected: `🔐 Admin user detected (role: ADMIN_PHOTOGRAPHY), redirecting to admin dashboard`


