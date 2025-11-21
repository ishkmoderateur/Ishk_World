# 🔐 Login Testing Guide

## Test Accounts

### Super Admin
- **Email:** `admin@ishk.com`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`
- **Access:** Full access to everything

### Other Admin Accounts (if created)
- **News Admin:** `newsadmin@ishk.test` / `test123`
- **Party Admin:** `partyadmin@ishk.test` / `test123`
- **Boutique Admin:** `boutiqueadmin@ishk.test` / `test123`
- **Association Admin:** `associationadmin@ishk.test` / `test123`
- **Photography Admin:** `photographyadmin@ishk.test` / `test123`

---

## Manual Testing Steps

### 1. Test Super Admin Login

1. Navigate to: `http://your-domain.com/auth/signin` (or `http://localhost:3000/auth/signin` for local)
2. Enter:
   - Email: `admin@ishk.com`
   - Password: `admin123`
3. Click "Sign in"
4. **Expected:** Should redirect to homepage or `/profile`
5. Navigate to: `/admin`
6. **Expected:** Should see full admin dashboard with all tabs:
   - Overview
   - Products
   - Venues
   - Campaigns
   - Orders (Super Admin only)
   - Users (Super Admin only)
   - Inquiries
   - Donations
   - News

### 2. Test Section Admin Login

1. Navigate to: `/auth/signin`
2. Login with a section admin (e.g., `boutiqueadmin@ishk.test` / `test123`)
3. Navigate to: `/admin`
4. **Expected:** Should only see tabs for their section:
   - Overview
   - Their specific section (e.g., Products for Boutique Admin)

### 3. Verify Access Control

**Super Admin should be able to:**
- ✅ Access `/admin` - Full dashboard
- ✅ View all orders
- ✅ View all users
- ✅ Access all section panels
- ✅ See platform statistics

**Section Admin should:**
- ✅ Access `/admin` - Limited dashboard
- ❌ NOT see Orders tab
- ❌ NOT see Users tab
- ✅ Only see their section tab

---

## Quick Test Script

Run this in browser console (F12) after logging in:

```javascript
// Check current user session
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => {
    console.log('Current User:', data);
    console.log('Role:', data.user?.role);
    console.log('Email:', data.user?.email);
  });

// Test admin API access (should work for super admin)
fetch('/api/admin/stats')
  .then(r => r.json())
  .then(data => {
    console.log('Admin Stats:', data);
  })
  .catch(err => console.error('Access denied:', err));
```

---

## Troubleshooting

### Login fails?
1. Check if user exists in database
2. Verify password is correct
3. Check browser console for errors
4. Check server logs: `pm2 logs ishk-platform`

### Can't access admin panel?
1. Verify user role in database
2. Check session: `fetch('/api/auth/session')`
3. Try logging out and back in
4. Clear browser cookies

### Create missing admin accounts:

```bash
# On VPS or local
cd /var/www/ishk-platform  # or your project path

# Create super admin
npx tsx scripts/create-admin.ts admin@ishk.com admin123 SUPER_ADMIN

# Create test users (includes all section admins)
npm run create-test-users
```

---

## Expected Results

### Super Admin Login:
- ✅ Login successful
- ✅ Redirects to homepage or profile
- ✅ Can access `/admin`
- ✅ Sees all admin tabs
- ✅ Can view all statistics
- ✅ Can manage users and orders

### Section Admin Login:
- ✅ Login successful
- ✅ Can access `/admin`
- ✅ Only sees their section tab
- ✅ Cannot access `/api/admin/users` (401 error)
- ✅ Cannot access `/api/admin/orders` (401 error)

