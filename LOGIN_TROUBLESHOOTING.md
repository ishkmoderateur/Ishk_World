# 🔧 Login Troubleshooting Guide

## ✅ Verified:
- User exists in database: `superadmin@ishk.test`
- Password is correct: `test123`
- Password hash matches

## 🔍 What to Check:

### 1. Check Server Console Logs
When you try to log in, check your server console (where `npm run dev` is running) for:

**Expected logs:**
```
🔐 Attempting login for: superadmin@ishk.test
✅ Login successful for: superadmin@ishk.test (Role: SUPER_ADMIN)
✅ JWT token created for user superadmin@ishk.test with role SUPER_ADMIN
```

**If you see errors:**
- `❌ Missing credentials` - Form not submitting properly
- `❌ User not found` - User doesn't exist (but we verified it does)
- `❌ Invalid password` - Password mismatch (but we verified it matches)
- `❌ Error in authorize function` - Database or other error

### 2. Check Browser Console
Open browser DevTools (F12) → Console tab, then try to log in. You should see:

**Expected logs:**
```
🔐 Client: Attempting login for: superadmin@ishk.test
🔐 Client: SignIn response: { ok: true, url: '/profile', error: null }
✅ Client: Login successful, redirecting to: /profile
```

**If you see errors:**
- `❌ Client: No response from signIn` - NextAuth not responding
- `❌ Client: SignIn error: CredentialsSignin` - Authorize function returned null
- `❌ Client: SignIn not OK` - Other error

### 3. Check Network Tab
Open browser DevTools (F12) → Network tab, then try to log in. Look for:

**Expected:**
- `POST /api/auth/callback/credentials?` → Status: 200
- `GET /api/auth/session` → Status: 200

**If you see:**
- Status 401 → Unauthorized (authorize returned null)
- Status 500 → Server error (check server console)

## 🐛 Common Issues:

### Issue 1: Authorize function returns null
**Symptom:** Browser console shows `SignIn error: CredentialsSignin`
**Fix:** Check server console for the specific error message

### Issue 2: Session not created
**Symptom:** Login succeeds but user stays on signin page
**Fix:** I've added `await update()` to refresh the session before redirect

### Issue 3: Redirect not working
**Symptom:** Login succeeds but doesn't redirect
**Fix:** I've changed to use `window.location.href` instead of `router.push`

## 🚀 Try This:

1. **Clear browser cache and cookies** for localhost:3000
2. **Restart the dev server** (`npm run dev`)
3. **Try logging in again** and check both:
   - Server console (terminal)
   - Browser console (F12)

## 📋 Share These Logs:

If login still doesn't work, share:
1. **Server console logs** (from terminal where `npm run dev` is running)
2. **Browser console logs** (F12 → Console tab)
3. **Network tab** (F12 → Network tab → look for `/api/auth/callback/credentials`)

This will help identify the exact issue!

