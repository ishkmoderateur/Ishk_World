#!/bin/bash
# Diagnostic script to check server status and identify issues

echo "🔍 ISHK Platform Server Diagnostics"
echo "===================================="
echo ""

# Check PM2 status
echo "1. PM2 Process Status:"
pm2 status
echo ""

# Check PM2 logs (last 50 lines)
echo "2. PM2 Error Logs (last 50 lines):"
if [ -f "./logs/error.log" ]; then
  tail -50 ./logs/error.log
else
  echo "   ⚠️  Error log file not found. Checking PM2 logs..."
  pm2 logs ishk-platform --err --lines 50 --nostream
fi
echo ""

echo "3. PM2 Output Logs (last 50 lines):"
if [ -f "./logs/out.log" ]; then
  tail -50 ./logs/out.log
else
  echo "   ⚠️  Output log file not found. Checking PM2 logs..."
  pm2 logs ishk-platform --out --lines 50 --nostream
fi
echo ""

# Check if port 3000 is in use
echo "4. Port 3000 Status:"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "   ✅ Port 3000 is in use"
  lsof -Pi :3000 -sTCP:LISTEN
else
  echo "   ❌ Port 3000 is NOT in use - application may not be listening"
fi
echo ""

# Check environment variables (in current shell context)
echo "5. Environment Variables Check (Current Shell):"
echo "   DATABASE_URL: ${DATABASE_URL:+✓ Set} ${DATABASE_URL:-✗ Missing}"
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:+✓ Set} ${NEXTAUTH_SECRET:-✗ Missing}"
echo "   NEXTAUTH_URL: ${NEXTAUTH_URL:+✓ Set ($NEXTAUTH_URL)} ${NEXTAUTH_URL:-✗ Missing}"
echo "   NODE_ENV: ${NODE_ENV:-Not set (defaults to production)}"
echo ""
echo "   Note: PM2 processes may have different environment variables."
echo "   Check PM2 process env: pm2 env <id>"
echo ""

# Check if .env file exists
echo "6. .env File Check:"
if [ -f ".env" ]; then
  echo "   ✅ .env file exists"
  echo "   Checking critical variables:"
  grep -q "DATABASE_URL" .env && echo "     ✓ DATABASE_URL found" || echo "     ✗ DATABASE_URL missing"
  grep -q "NEXTAUTH_SECRET" .env && echo "     ✓ NEXTAUTH_SECRET found" || echo "     ✗ NEXTAUTH_SECRET missing"
  grep -q "NEXTAUTH_URL" .env && echo "     ✓ NEXTAUTH_URL found" || echo "     ✗ NEXTAUTH_URL missing"
else
  echo "   ❌ .env file NOT found!"
fi
echo ""

# Check database file
echo "7. Database File Check:"
if [ -n "$DATABASE_URL" ]; then
  # Extract file path from SQLite URL
  DB_PATH=$(echo "$DATABASE_URL" | sed 's/file://' | sed 's|^/||')
  if [ -f "$DB_PATH" ]; then
    echo "   ✅ Database file exists: $DB_PATH"
    ls -lh "$DB_PATH"
  else
    echo "   ❌ Database file NOT found: $DB_PATH"
  fi
fi
echo ""

# Check .next build directory
echo "8. Build Directory Check:"
if [ -d ".next" ]; then
  echo "   ✅ .next directory exists"
  if [ -d ".next/standalone" ]; then
    echo "   ✅ Standalone build exists"
  else
    echo "   ⚠️  Standalone build not found (may need rebuild)"
  fi
else
  echo "   ❌ .next directory NOT found - application needs to be built"
fi
echo ""

# Check node_modules
echo "9. Dependencies Check:"
if [ -d "node_modules" ]; then
  echo "   ✅ node_modules exists"
  if [ -d "node_modules/.prisma" ]; then
    echo "   ✅ Prisma Client generated"
  else
    echo "   ⚠️  Prisma Client not found - may need to run: npx prisma generate"
  fi
else
  echo "   ❌ node_modules NOT found - run: npm install"
fi
echo ""

echo "===================================="
echo "✅ Diagnostics complete!"
echo ""
echo "Next steps:"
echo "  1. Check error logs above for specific error messages"
echo "  2. Ensure all required environment variables are set"
echo "  3. Verify database file exists and is accessible"
echo "  4. Check PM2 status for process restarts"

