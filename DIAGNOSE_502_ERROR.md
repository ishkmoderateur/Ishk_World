# 🔍 How to Diagnose 502 Bad Gateway Error

## What I Observed

When I tried to log in at `https://ishk-world.com/auth/signin`, the browser redirected to `/api/auth/error` with a **502 Bad Gateway** error. This means:

- ✅ The website homepage loads (static pages work)
- ❌ The authentication API endpoint is failing
- ❌ NextAuth.js cannot process the login request

## How to Verify This Yourself

### 1. Check PM2 Status (Is the app running?)

SSH into your VPS and run:

```bash
ssh root@31.97.155.232
cd /var/www/ishk-platform
pm2 status
```

**What to look for:**
- ✅ Status should show `online` (green)
- ❌ If it shows `errored` or `stopped`, the app crashed

**If the app is down, restart it:**
```bash
pm2 restart ishk-platform
pm2 logs ishk-platform --lines 50
```

---

### 2. Check PM2 Logs (What errors are happening?)

```bash
# View recent logs
pm2 logs ishk-platform --lines 100

# Or view logs in real-time
pm2 logs ishk-platform
```

**What to look for:**
- Database connection errors
- Missing environment variables
- Prisma client errors
- NextAuth configuration errors
- Stack traces showing where it crashed

**Common errors you might see:**
```
Error: PrismaClient is not configured
Error: NEXTAUTH_SECRET is missing
Error: Cannot connect to database
```

---

### 3. Test the API Endpoint Directly

From your VPS, test if the NextAuth API is responding:

```bash
# Test the auth endpoint
curl -v http://localhost:3000/api/auth/signin

# Test if the server is running at all
curl -v http://localhost:3000
```

**What to look for:**
- ✅ `200 OK` = Server is working
- ❌ `502 Bad Gateway` = Server is down or NGINX can't reach it
- ❌ `Connection refused` = App is not running on port 3000

---

### 4. Check NGINX Logs (Is NGINX working?)

```bash
# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Check NGINX access logs
sudo tail -f /var/log/nginx/access.log
```

**What to look for:**
- `upstream prematurely closed connection` = App crashed
- `connect() failed (111: Connection refused)` = App not running
- `upstream timed out` = App is hanging

---

### 5. Verify Environment Variables

```bash
cd /var/www/ishk-platform

# Check if .env file exists
ls -la .env

# View environment variables (be careful, contains secrets)
cat .env | grep -E "NEXTAUTH|DATABASE"

# Or check specific variables
grep NEXTAUTH_SECRET .env
grep NEXTAUTH_URL .env
grep DATABASE_URL .env
```

**Required variables:**
- ✅ `NEXTAUTH_SECRET` must be set (32+ character string)
- ✅ `NEXTAUTH_URL` must match your domain (`https://ishk-world.com`)
- ✅ `DATABASE_URL` must point to valid database file

---

### 6. Check Database File

```bash
cd /var/www/ishk-platform

# Check if database exists
ls -lh prisma/prod.db

# Check database permissions
ls -la prisma/prod.db

# Verify Prisma client is generated
ls -la node_modules/.prisma/client
```

**What to look for:**
- ✅ Database file exists and has read/write permissions
- ✅ Prisma client is generated in `node_modules/.prisma/client`

**If database is missing or permissions are wrong:**
```bash
# Fix permissions
chmod 664 prisma/prod.db
chown $USER:$USER prisma/prod.db

# Regenerate Prisma client
npx prisma generate
```

---

### 7. Test from Browser Developer Tools

1. Open `https://ishk-world.com/auth/signin` in your browser
2. Press `F12` to open Developer Tools
3. Go to the **Network** tab
4. Try to log in
5. Look for failed requests (they'll be red)

**What to check:**
- Click on the failed request (usually `/api/auth/callback/credentials` or `/api/auth/signin`)
- Check the **Response** tab - what error message does it show?
- Check the **Headers** tab - what status code? (502, 500, etc.)

---

### 8. Quick Health Check Script

Create a test script to check everything at once:

```bash
cd /var/www/ishk-platform

cat > check-health.sh << 'EOF'
#!/bin/bash
echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== Testing localhost:3000 ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000
echo ""
echo "=== Testing auth endpoint ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/api/auth/signin
echo ""
echo "=== Environment Variables ==="
[ -f .env ] && echo ".env file exists" || echo ".env file MISSING"
grep -q "NEXTAUTH_SECRET" .env && echo "NEXTAUTH_SECRET: ✓" || echo "NEXTAUTH_SECRET: ✗"
grep -q "NEXTAUTH_URL" .env && echo "NEXTAUTH_URL: ✓" || echo "NEXTAUTH_URL: ✗"
grep -q "DATABASE_URL" .env && echo "DATABASE_URL: ✓" || echo "DATABASE_URL: ✗"
echo ""
echo "=== Database ==="
[ -f prisma/prod.db ] && echo "Database file exists" || echo "Database file MISSING"
echo ""
echo "=== Prisma Client ==="
[ -d node_modules/.prisma/client ] && echo "Prisma client generated" || echo "Prisma client MISSING"
EOF

chmod +x check-health.sh
./check-health.sh
```

---

## Common Fixes

### Fix 0: **MISSING BUILD** (Your Current Issue!)

**Error in logs:**
```
Error: Could not find a production build in the '.next' directory.
```

**Solution:**
```bash
cd /var/www/ishk-platform
npm run build
pm2 restart ishk-platform
```

**Or use the automated fix script:**
```bash
# Upload VPS_BUILD_FIX.sh to your VPS, then:
bash VPS_BUILD_FIX.sh
```

This is the **most common cause** of 502 errors after deployment!

---

### Fix 1: Restart the Application

```bash
cd /var/www/ishk-platform
pm2 restart ishk-platform
pm2 logs ishk-platform --lines 50
```

### Fix 2: Regenerate Prisma Client

```bash
cd /var/www/ishk-platform
npx prisma generate
pm2 restart ishk-platform
```

### Fix 3: Check and Fix Environment Variables

```bash
cd /var/www/ishk-platform
nano .env
```

Make sure these are set correctly:
```env
NEXTAUTH_SECRET="your-secret-here"  # Must be set!
NEXTAUTH_URL="https://ishk-world.com"  # Must match your domain!
DATABASE_URL="file:/var/www/ishk-platform/prisma/prod.db"
```

Then restart:
```bash
pm2 restart ishk-platform
```

### Fix 4: Rebuild the Application

```bash
cd /var/www/ishk-platform
npm run build
pm2 restart ishk-platform
```

### Fix 5: Check NGINX Configuration

```bash
# Test NGINX config
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

# Check NGINX status
sudo systemctl status nginx
```

---

## Summary

**To know if you have a 502 error:**

1. ✅ **Browser shows 502** - You'll see it in the browser
2. ✅ **PM2 logs show errors** - Check `pm2 logs`
3. ✅ **NGINX logs show connection errors** - Check `/var/log/nginx/error.log`
4. ✅ **API endpoint doesn't respond** - Test with `curl http://localhost:3000/api/auth/signin`

**Most likely causes:**
- App crashed (check PM2 status)
- Missing environment variables (check `.env`)
- Database connection issue (check database file)
- Prisma client not generated (run `npx prisma generate`)

