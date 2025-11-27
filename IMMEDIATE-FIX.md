# IMMEDIATE FIX: Website Not Loading

## Root Causes Identified

1. **❌ Port 3000 NOT in use** - Application isn't listening on port 3000
2. **❌ Environment variables not loading in PM2** - Variables exist in `.env` but PM2 processes don't see them
3. **❌ Database schema mismatch** - Missing `currency` column in `products` table

## Quick Fix (Run on Server)

SSH into your server and run this **one command**:

```bash
cd /var/www/ishk-platform && chmod +x scripts/*.sh && ./scripts/fix-all.sh
```

This script will:
1. ✅ Check and verify `.env` file
2. ✅ Fix database schema (add missing `currency` column)
3. ✅ Run Prisma migrations
4. ✅ Generate Prisma Client
5. ✅ Build application (if needed)
6. ✅ Restart PM2 with proper environment variables
7. ✅ Verify port 3000 is listening

## Manual Fix (If Script Fails)

### Step 1: Fix Database Schema

```bash
# Add missing currency column to products table
sqlite3 prisma/dev.db "ALTER TABLE products ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';" 2>/dev/null || echo "Column may already exist"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Step 2: Verify Environment Variables in .env

```bash
# Check .env file has these (REQUIRED):
cat .env | grep -E "DATABASE_URL|NEXTAUTH_SECRET|NEXTAUTH_URL"

# Should show:
# DATABASE_URL=file:/var/www/ishk-platform/prisma/dev.db
# NEXTAUTH_SECRET=<your-secret>
# NEXTAUTH_URL=https://ishk-world.com
```

If any are missing, add them:

```bash
nano .env
```

### Step 3: Restart PM2 Properly

```bash
# Stop all processes
pm2 stop ishk-platform
pm2 delete ishk-platform

# Restart with updated config
pm2 start ecosystem.config.js

# Save configuration
pm2 save

# Monitor logs
pm2 logs ishk-platform --err
```

### Step 4: Verify It's Working

```bash
# Check PM2 status (should show "online")
pm2 status

# Check if port 3000 is listening (should show process)
lsof -i :3000

# Test locally
curl http://localhost:3000

# Should return HTML or redirect
```

## What Was Fixed

1. **ecosystem.config.js** - Removed unreliable `env_file` property, ensuring all env vars are explicitly passed
2. **Database migration** - Created migration to add missing `currency` column
3. **Fix scripts** - Created automated scripts to fix all issues

## After Fixing

The application should:
- ✅ Show status "online" in PM2
- ✅ Listen on port 3000
- ✅ Load all environment variables correctly
- ✅ Connect to database without schema errors
- ✅ Website should be accessible

## Still Not Working?

1. **Check error logs:**
   ```bash
   pm2 logs ishk-platform --err --lines 100
   ```

2. **Check PM2 environment:**
   ```bash
   pm2 show ishk-platform | grep -A 20 "env:"
   ```

3. **Verify environment variables in running process:**
   ```bash
   pm2 env 0  # Replace 0 with process ID
   ```

4. **Run diagnostics:**
   ```bash
   ./scripts/diagnose-server.sh
   ```

## Common Issues After Fix

### Issue: Still shows "Port 3000 NOT in use"
**Fix:** Wait 10-15 seconds after restart, then check again. If still not working, check logs for startup errors.

### Issue: Environment variables still missing
**Fix:** 
1. Verify `.env` file exists and has all variables
2. Restart PM2: `pm2 delete ishk-platform && pm2 start ecosystem.config.js`
3. Check: `pm2 show ishk-platform | grep DATABASE_URL`

### Issue: Database schema errors persist
**Fix:**
1. Run: `npx prisma migrate reset` (⚠️ This will DELETE all data)
2. Or run: `npx prisma db push` to sync schema
3. Then: `npx prisma generate`

### Issue: Application crashes immediately
**Fix:**
1. Check logs: `pm2 logs ishk-platform --err`
2. Look for specific error messages
3. Most likely: Missing NEXTAUTH_SECRET or DATABASE_URL

