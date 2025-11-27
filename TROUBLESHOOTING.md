# ISHK Platform Troubleshooting Guide

## Website Not Loading - Quick Diagnosis

If your website is not loading, follow these steps:

### 1. Check PM2 Status

```bash
pm2 status
```

Look for:
- Status should be `online` (green)
- Restart count should be low (not 340+)
- Uptime should be increasing

### 2. Check Error Logs

```bash
# View real-time logs
pm2 logs ishk-platform --err

# Or check log files
tail -100 logs/error.log
```

Common errors to look for:
- **DATABASE_URL not set** - Database connection error
- **NEXTAUTH_SECRET missing** - Authentication error
- **Port 3000 already in use** - Port conflict
- **Prisma Client not generated** - Missing Prisma client

### 3. Run Diagnostics

Use the diagnostic script:

```bash
chmod +x scripts/diagnose-server.sh
./scripts/diagnose-server.sh
```

### 4. Common Issues and Fixes

#### Issue: High Restart Count (340+)
**Cause**: Application is crashing on startup
**Fix**: 
1. Check error logs for specific error
2. Verify all environment variables are set
3. Check database connection

#### Issue: Processes Show as "Errored" or "Stopped"
**Cause**: Application failed to start
**Fix**:
```bash
# Check logs
pm2 logs ishk-platform --err --lines 100

# Restart application
./scripts/restart-app.sh
```

#### Issue: Port 3000 Not Listening
**Cause**: Application not starting or wrong port
**Fix**:
```bash
# Check if port is in use
lsof -i :3000

# Kill process if needed (use PID from above)
kill -9 <PID>

# Restart application
pm2 restart ishk-platform
```

#### Issue: DATABASE_URL Not Set
**Cause**: Missing environment variable
**Fix**:
1. Check `.env` file exists
2. Verify `DATABASE_URL` is set in `.env`
3. For SQLite: `DATABASE_URL="file:/var/www/ishk-platform/prisma/dev.db"`
4. Restart PM2: `pm2 restart ishk-platform`

#### Issue: NEXTAUTH_SECRET Missing
**Cause**: Missing authentication secret
**Fix**:
1. Add to `.env` file: `NEXTAUTH_SECRET="your-secret-here"`
2. Generate a secure secret: `openssl rand -base64 32`
3. Restart PM2: `pm2 restart ishk-platform`

#### Issue: Prisma Client Not Generated
**Cause**: Prisma client not built
**Fix**:
```bash
npx prisma generate
pm2 restart ishk-platform
```

#### Issue: Build Files Missing
**Cause**: Application not built
**Fix**:
```bash
npm run build
pm2 restart ishk-platform
```

### 5. Complete Restart Procedure

If nothing else works, try a complete restart:

```bash
# Stop all processes
pm2 stop all
pm2 delete all

# Rebuild if needed
npm run build
npx prisma generate

# Start fresh
pm2 start ecosystem.config.js
pm2 save

# Monitor for errors
pm2 logs ishk-platform --err
```

### 6. Verify Application is Running

After restart, verify:

```bash
# Check PM2 status
pm2 status

# Test if port 3000 is listening
curl http://localhost:3000

# Or check in browser
# http://your-domain.com or http://localhost:3000
```

### 7. Check Environment Variables

Ensure these are set in `.env`:

```env
DATABASE_URL=file:/var/www/ishk-platform/prisma/dev.db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
```

### 8. Network Issues

If the website is not accessible externally:

1. **Check firewall**: Ensure port 3000 (or your configured port) is open
2. **Check reverse proxy**: If using Nginx/Apache, verify configuration
3. **Check DNS**: Verify domain points to your server
4. **Check PM2 binding**: Ensure app binds to `0.0.0.0`, not just `localhost`

### 9. Database Issues

If database connection fails:

```bash
# Check if database file exists
ls -lh prisma/dev.db

# Check file permissions
chmod 644 prisma/dev.db
chown www-data:www-data prisma/dev.db  # Adjust user as needed

# Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.\$connect().then(() => console.log('OK')).catch(e => console.error(e))"
```

### 10. Get Help

If the issue persists:

1. Run diagnostics: `./scripts/diagnose-server.sh`
2. Collect logs: `pm2 logs ishk-platform --err --lines 200 > error-log.txt`
3. Check PM2 status: `pm2 status > pm2-status.txt`
4. Review the collected information

## Quick Reference Commands

```bash
# View logs
pm2 logs ishk-platform

# Restart app
pm2 restart ishk-platform

# Check status
pm2 status

# View error logs only
pm2 logs ishk-platform --err

# Stop app
pm2 stop ishk-platform

# Delete from PM2
pm2 delete ishk-platform

# Start app
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Monitor in real-time
pm2 monit
```

