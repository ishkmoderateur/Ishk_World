# Fix: Website Not Loading

## Immediate Actions Required

Your website is not loading because the application is crashing on startup (340+ restarts). Follow these steps **on your server** to diagnose and fix:

### Step 1: Check Error Logs (Most Important!)

SSH into your server and run:

```bash
# View recent error logs
pm2 logs ishk-platform --err --lines 100

# Or check log files
tail -100 logs/error.log
```

**Look for these common errors:**

1. **"DATABASE_URL is not set"** → Fix: Set DATABASE_URL in .env file
2. **"NEXTAUTH_SECRET is required"** → Fix: Set NEXTAUTH_SECRET in .env file  
3. **"Cannot connect to database"** → Fix: Check database file path and permissions
4. **"Port 3000 already in use"** → Fix: Kill process using port 3000
5. **"Prisma Client not generated"** → Fix: Run `npx prisma generate`

### Step 2: Check Environment Variables

Verify your `.env` file has these required variables:

```bash
# On server, check .env file
cat .env | grep -E "DATABASE_URL|NEXTAUTH_SECRET|NEXTAUTH_URL"
```

**Required variables:**
```env
DATABASE_URL=file:/var/www/ishk-platform/prisma/dev.db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://ishk-world.com
NODE_ENV=production
PORT=3000
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Check PM2 Status

```bash
pm2 status
```

**What to look for:**
- ✅ Status should be `online` (green)
- ❌ If status is `errored` or `stopped`, check logs
- ⚠️ Restart count should be LOW (not 340+)

### Step 4: Restart Application Properly

Run these commands on your server:

```bash
# Stop the application
pm2 stop ishk-platform

# Delete from PM2
pm2 delete ishk-platform

# Make scripts executable
chmod +x scripts/*.sh

# Run diagnostics
./scripts/diagnose-server.sh

# Fix any issues found, then restart
./scripts/restart-app.sh
```

### Step 5: Most Common Fixes

#### Fix 1: Missing DATABASE_URL

```bash
# Edit .env file
nano .env

# Add or update:
DATABASE_URL=file:/var/www/ishk-platform/prisma/dev.db

# Verify database file exists
ls -lh prisma/dev.db

# If missing, create it
mkdir -p prisma
touch prisma/dev.db
```

#### Fix 2: Missing NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env file
nano .env
# Add: NEXTAUTH_SECRET=<generated-secret>
```

#### Fix 3: Prisma Client Not Generated

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if needed)
npx prisma migrate deploy
```

#### Fix 4: Build Files Missing

```bash
# Build the application
npm run build

# Verify build exists
ls -la .next/
```

#### Fix 5: Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use fuser
fuser -k 3000/tcp
```

### Step 6: Verify Application Starts

After fixing issues, verify:

```bash
# Check PM2 status
pm2 status

# Should show:
# - Status: online
# - Restart count: 0 or low number
# - Uptime: increasing

# Test if port is listening
curl http://localhost:3000

# Or check in browser
# http://ishk-world.com or http://your-server-ip:3000
```

### Step 7: If Still Not Working

Run complete diagnostics:

```bash
# Run diagnostic script
./scripts/diagnose-server.sh

# Test startup
./scripts/check-startup.sh

# View full error logs
pm2 logs ishk-platform --err --lines 200
```

## Quick Fix Command Sequence

Run these commands **in order** on your server:

```bash
# 1. Stop app
pm2 stop ishk-platform
pm2 delete ishk-platform

# 2. Check/fix .env file
cat .env  # Verify DATABASE_URL and NEXTAUTH_SECRET exist

# 3. Generate Prisma Client
npx prisma generate

# 4. Build (if .next doesn't exist)
npm run build

# 5. Restart
pm2 start ecosystem.config.js
pm2 save

# 6. Monitor for errors
pm2 logs ishk-platform --err
```

## Check These Files on Server

1. **`.env` file** - Must have DATABASE_URL and NEXTAUTH_SECRET
2. **`prisma/dev.db`** - Database file must exist and be readable
3. **`.next/` directory** - Build output must exist
4. **`node_modules/.prisma/`** - Prisma Client must be generated
5. **`logs/error.log`** - Check for specific error messages

## Need More Help?

1. **Collect error information:**
   ```bash
   pm2 logs ishk-platform --err --lines 200 > error-log.txt
   pm2 status > pm2-status.txt
   ./scripts/diagnose-server.sh > diagnostics.txt
   ```

2. **Share these files** for troubleshooting

## Expected Behavior After Fix

- ✅ PM2 status shows `online` (green)
- ✅ Restart count is 0 or very low
- ✅ Uptime is increasing
- ✅ Website loads in browser
- ✅ Port 3000 is listening
- ✅ No errors in logs

## Additional Resources

- See `TROUBLESHOOTING.md` for detailed troubleshooting guide
- Run `./scripts/diagnose-server.sh` for automated diagnostics
- Use `./scripts/restart-app.sh` for safe restarts



