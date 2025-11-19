# Testing Guide - ISHK Platform

## 🚀 Quick Start

### 1. Create Test Users

Run the script to create test accounts for all roles:

```bash
npm run create-test-users
```

This will create the following test accounts (all with password: `test123`):

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Super Admin** | `superadmin@ishk.test` | `test123` | Full access to everything |
| **News Admin** | `newsadmin@ishk.test` | `test123` | News briefs only |
| **Party Admin** | `partyadmin@ishk.test` | `test123` | Venues & inquiries only |
| **Boutique Admin** | `boutiqueadmin@ishk.test` | `test123` | Products only |
| **Association Admin** | `associationadmin@ishk.test` | `test123` | Campaigns & donations only |
| **Photography Admin** | `photographyadmin@ishk.test` | `test123` | Photography portfolio only |
| **Regular User** | `user@ishk.test` | `test123` | No admin access |

---

## 🧪 Testing Checklist

### ✅ Authentication Tests

#### Test 1: User Registration
1. Go to `/auth/register`
2. Fill in:
   - Name: `Test User`
   - Email: `newuser@test.com`
   - Password: `test123`
3. Click "Register"
4. **Expected**: Redirected to homepage, logged in

#### Test 2: User Login
1. Go to `/auth/signin`
2. Login with: `superadmin@ishk.test` / `test123`
3. **Expected**: Successfully logged in, redirected

#### Test 3: Logout
1. Click logout button
2. **Expected**: Logged out, redirected to homepage

---

### ✅ Role-Based Access Tests

#### Test 4: Super Admin Access
1. Login as `superadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - See all tabs: Overview, Products, Venues, Campaigns, Orders, Users, Inquiries, Donations, News
   - Can access all sections

#### Test 5: News Admin Access
1. Login as `newsadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - Only see: Overview, News tabs
   - Can only access News section
   - Other tabs hidden

#### Test 6: Party Admin Access
1. Login as `partyadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - Only see: Overview, Venues, Inquiries tabs
   - Can manage venues and inquiries only

#### Test 7: Boutique Admin Access
1. Login as `boutiqueadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - Only see: Overview, Products tabs
   - Can manage products only

#### Test 8: Association Admin Access
1. Login as `associationadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - Only see: Overview, Campaigns, Donations tabs
   - Can manage campaigns and donations only

#### Test 9: Photography Admin Access
1. Login as `photographyadmin@ishk.test`
2. Go to `/admin`
3. **Expected**: 
   - Only see: Overview tab (and Photography panel link)
   - Can manage photography portfolio

#### Test 10: Regular User Access
1. Login as `user@ishk.test`
2. Try to access `/admin`
3. **Expected**: Redirected to homepage (no admin access)

---

### ✅ CRUD Operations Tests

#### Test 11: Products CRUD (Boutique Admin)
1. Login as `boutiqueadmin@ishk.test`
2. Go to `/admin` → Products tab
3. **Create**: Click "Add Product", fill form, submit
   - **Expected**: Product created, appears in list
4. **Read**: View product list
   - **Expected**: All products displayed
5. **Update**: Edit a product
   - **Expected**: Changes saved
6. **Delete**: Delete a product
   - **Expected**: Product removed from list

#### Test 12: Venues CRUD (Party Admin)
1. Login as `partyadmin@ishk.test`
2. Go to `/admin` → Venues tab
3. **Create**: Add new venue
   - **Expected**: Venue created
4. **Read**: View venues list
   - **Expected**: All venues displayed
5. **Update**: Edit a venue
   - **Expected**: Changes saved
6. **Delete**: Delete a venue
   - **Expected**: Venue removed

#### Test 13: Campaigns CRUD (Association Admin)
1. Login as `associationadmin@ishk.test`
2. Go to `/admin` → Campaigns tab
3. **Create**: Add new campaign
   - **Expected**: Campaign created
4. **Read**: View campaigns list
   - **Expected**: All campaigns displayed
5. **Update**: Edit a campaign
   - **Expected**: Changes saved
6. **Delete**: Delete a campaign
   - **Expected**: Campaign removed

#### Test 14: News CRUD (News Admin)
1. Login as `newsadmin@ishk.test`
2. Go to `/admin` → News tab
3. **Create**: Add news brief
   - **Expected**: News brief created
4. **Read**: View news list
   - **Expected**: All news displayed
5. **Update**: Edit news brief
   - **Expected**: Changes saved
6. **Delete**: Delete news brief
   - **Expected**: News brief removed

---

### ✅ API Endpoint Tests (Using Browser DevTools)

#### Test 15: Test API Authorization
1. Open Chrome DevTools (F12) → Network tab
2. Login as `newsadmin@ishk.test`
3. Try to access Products API:
   ```javascript
   fetch('/api/admin/products')
     .then(r => r.json())
     .then(console.log)
   ```
   - **Expected**: `401 Unauthorized` error (News admin can't access products)

4. Try to access News API:
   ```javascript
   fetch('/api/admin/news')
     .then(r => r.json())
     .then(console.log)
   ```
   - **Expected**: Returns news data (News admin can access)

#### Test 16: Test Super Admin API Access
1. Login as `superadmin@ishk.test`
2. Test all API endpoints:
   ```javascript
   // All should work for super admin
   fetch('/api/admin/products').then(r => r.json()).then(console.log)
   fetch('/api/admin/venues').then(r => r.json()).then(console.log)
   fetch('/api/admin/campaigns').then(r => r.json()).then(console.log)
   fetch('/api/admin/news').then(r => r.json()).then(console.log)
   fetch('/api/admin/users').then(r => r.json()).then(console.log)
   fetch('/api/admin/orders').then(r => r.json()).then(console.log)
   ```
   - **Expected**: All return data (no errors)

---

### ✅ Database Verification

#### Test 17: Check Database
1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Navigate to `users` table
3. **Expected**: See all test users with their roles
4. Check other tables (products, venues, campaigns, etc.)
5. **Expected**: See data created through CRUD operations

---

## 🔍 Chrome DevTools Testing

### Network Tab Monitoring
1. Open DevTools (F12) → Network tab
2. Filter by "Fetch/XHR"
3. Perform operations (login, CRUD)
4. Check:
   - ✅ Request URLs are correct
   - ✅ Status codes (200, 401, etc.)
   - ✅ Request/Response payloads
   - ✅ Headers include authentication

### Console Testing
Open Console tab and test:

```javascript
// Test session
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)

// Test admin stats (requires admin)
fetch('/api/admin/stats')
  .then(r => r.json())
  .then(console.log)
```

---

## 📝 Notes

- All test users have password: `test123`
- Regular users (role: `USER`) cannot access `/admin`
- Section admins can only access their assigned section
- Super admin has access to everything
- API endpoints return `401 Unauthorized` if user lacks permission

---

## 🐛 Troubleshooting

### Issue: Can't login
- Check if user exists in database
- Verify password is correct
- Check browser console for errors

### Issue: API returns 401
- Verify user is logged in
- Check user role in database
- Ensure session includes role

### Issue: Can't see admin sections
- Verify user role is correct
- Check browser console for errors
- Try logging out and back in






