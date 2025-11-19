# 🧪 Test Accounts - Quick Reference

All accounts use password: **`test123`**

## 👥 Admin Accounts

| Role | Email | Password | What They Can Access |
|------|-------|----------|---------------------|
| 🔴 **Super Admin** | `superadmin@ishk.test` | `test123` | **Everything** - All sections, users, orders |
| 📰 **News Admin** | `newsadmin@ishk.test` | `test123` | News briefs only |
| 🎉 **Party Admin** | `partyadmin@ishk.test` | `test123` | Venues & inquiries only |
| 🛍️ **Boutique Admin** | `boutiqueadmin@ishk.test` | `test123` | Products only |
| ❤️ **Association Admin** | `associationadmin@ishk.test` | `test123` | Campaigns & donations only |
| 📸 **Photography Admin** | `photographyadmin@ishk.test` | `test123` | Photography portfolio only |

## 👤 Regular User

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👤 **User** | `user@ishk.test` | `test123` | No admin access |

---

## 🚀 Quick Test Steps

### 1. Test Login
- Go to: `http://localhost:3000/auth/signin`
- Login with any account above
- ✅ Should redirect to homepage

### 2. Test Admin Access
- Login as `superadmin@ishk.test`
- Go to: `http://localhost:3000/admin`
- ✅ Should see all tabs

### 3. Test Role Restrictions
- Login as `newsadmin@ishk.test`
- Go to: `http://localhost:3000/admin`
- ✅ Should only see "Overview" and "News" tabs

### 4. Test CRUD Operations
- Login as `boutiqueadmin@ishk.test`
- Go to: `/admin` → Products tab
- Create/Edit/Delete a product
- ✅ Should work (check Network tab in DevTools)

### 5. Test API Authorization
Open Chrome DevTools Console (F12) and run:

```javascript
// Should work (you're logged in as boutique admin)
fetch('/api/admin/products')
  .then(r => r.json())
  .then(console.log)

// Should fail with 401 (boutique admin can't access news)
fetch('/api/admin/news')
  .then(r => r.json())
  .then(console.log)
```

---

## 📊 Database Check

View all test users in database:
```bash
npx prisma studio
```
Then navigate to `users` table to see all accounts with their roles.






