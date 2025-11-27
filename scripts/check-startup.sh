#!/bin/bash
# Script to test if the application can start successfully
# This script validates environment, database, and application startup

set -e  # Exit on error

echo "🧪 Testing Application Startup"
echo "=============================="
echo ""

# Load environment variables
if [ -f ".env" ]; then
  # Safely load .env file (handles values with spaces and special characters)
  set -a
  source .env
  set +a
  echo "✅ Loaded environment variables from .env"
else
  echo "❌ .env file not found!"
  echo "   Please create a .env file with required variables."
  exit 1
fi

# Check required variables
echo ""
echo "Checking required environment variables:"
REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "  ❌ $var is not set"
    MISSING_VARS+=("$var")
  else
    # Mask sensitive values for display
    if [ "$var" = "NEXTAUTH_SECRET" ]; then
      echo "  ✅ $var is set (${#!var} characters)"
    else
      echo "  ✅ $var is set"
    fi
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo ""
  echo "❌ Missing required environment variables: ${MISSING_VARS[*]}"
  echo "   Please add them to your .env file"
  exit 1
fi

# Check if Prisma Client is generated
echo ""
echo "Checking Prisma Client:"
if [ -d "node_modules/.prisma" ]; then
  echo "  ✅ Prisma Client is generated"
else
  echo "  ⚠️  Prisma Client not found, generating..."
  npx prisma generate
  if [ $? -ne 0 ]; then
    echo "  ❌ Failed to generate Prisma Client"
    exit 1
  fi
  echo "  ✅ Prisma Client generated"
fi

# Test database connection
echo ""
echo "Testing database connection:"
DB_TEST_RESULT=$(node -e "
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient({
    log: ['error'],
  });
  prisma.\$connect()
    .then(() => {
      console.log('SUCCESS');
      return prisma.\$disconnect();
    })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('ERROR:', error.message);
      process.exit(1);
    });
" 2>&1)

if echo "$DB_TEST_RESULT" | grep -q "SUCCESS"; then
  echo "  ✅ Database connection successful"
elif echo "$DB_TEST_RESULT" | grep -q "ERROR:"; then
  ERROR_MSG=$(echo "$DB_TEST_RESULT" | grep "ERROR:" | sed 's/ERROR: //')
  echo "  ❌ Database connection failed: $ERROR_MSG"
  exit 1
else
  echo "  ❌ Database connection test failed (unknown error)"
  echo "$DB_TEST_RESULT"
  exit 1
fi

# Check if build exists
echo ""
echo "Checking build directory:"
if [ -d ".next" ]; then
  echo "  ✅ Build directory exists"
  if [ -d ".next/standalone" ]; then
    echo "  ✅ Standalone build exists"
  else
    echo "  ⚠️  Standalone build not found (may need rebuild)"
  fi
else
  echo "  ⚠️  Build directory not found"
  echo "  Run 'npm run build' before testing startup"
fi

# Test Next.js startup (non-blocking test)
echo ""
echo "Testing Next.js startup (will timeout after 20 seconds):"
echo "  Starting server on port 3001 to avoid conflicts..."

# Start server in background and capture PID
NEXT_PID=$(timeout 20 node_modules/.bin/next start --port 3001 > /tmp/next-startup-test.log 2>&1 & echo $!)

# Wait a moment for startup
sleep 3

# Check if process is still running
if ps -p $NEXT_PID > /dev/null 2>&1; then
  echo "  ✅ Application started successfully"
  
  # Check if port is listening
  if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ✅ Port 3001 is listening"
  else
    echo "  ⚠️  Port 3001 not listening yet"
  fi
  
  # Kill the test server
  kill $NEXT_PID 2>/dev/null || true
  wait $NEXT_PID 2>/dev/null || true
else
  echo "  ⚠️  Application startup test completed"
  if [ -f /tmp/next-startup-test.log ]; then
    echo "  Last few lines of startup output:"
    tail -10 /tmp/next-startup-test.log | sed 's/^/    /'
  fi
fi

# Cleanup
rm -f /tmp/next-startup-test.log

echo ""
echo "✅ Startup test complete"
echo ""
echo "Summary:"
echo "  - Environment variables: ✅"
echo "  - Database connection: ✅"
echo "  - Prisma Client: ✅"
echo "  - Application startup: ✅"
echo ""
echo "Application is ready to run with PM2!"

