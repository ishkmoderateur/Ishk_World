#!/bin/bash
# Complete fix script for website not loading issue

echo "🔧 Complete Fix Script for ISHK Platform"
echo "========================================="
echo ""

# Step 1: Check .env file
echo "Step 1: Checking .env file..."
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo "   Please create a .env file with required variables."
  exit 1
fi

echo "✅ .env file exists"

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check critical variables
echo ""
echo "Checking critical environment variables..."
MISSING_VARS=()

if [ -z "$DATABASE_URL" ]; then
  echo "  ❌ DATABASE_URL is missing"
  MISSING_VARS+=("DATABASE_URL")
else
  echo "  ✅ DATABASE_URL is set"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "  ❌ NEXTAUTH_SECRET is missing"
  MISSING_VARS+=("NEXTAUTH_SECRET")
else
  echo "  ✅ NEXTAUTH_SECRET is set"
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "  ⚠️  NEXTAUTH_URL is missing (will use default)"
else
  echo "  ✅ NEXTAUTH_URL is set"
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo ""
  echo "❌ Missing required variables: ${MISSING_VARS[*]}"
  echo "   Please add them to your .env file"
  exit 1
fi

# Step 2: Fix database
echo ""
echo "Step 2: Fixing database schema..."
chmod +x scripts/fix-database.sh
./scripts/fix-database.sh

if [ $? -ne 0 ]; then
  echo "⚠️  Database fix had issues, continuing anyway..."
fi

# Step 3: Generate Prisma Client
echo ""
echo "Step 3: Ensuring Prisma Client is generated..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Failed to generate Prisma Client"
  exit 1
fi

# Step 4: Build application
echo ""
echo "Step 4: Building application..."
if [ ! -d ".next" ]; then
  echo "  Building application..."
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
  fi
else
  echo "  ✅ Build directory exists"
fi

# Step 5: Stop and restart PM2
echo ""
echo "Step 5: Restarting PM2 processes..."

# Stop existing processes
pm2 stop ishk-platform 2>/dev/null || echo "  (No process to stop)"
pm2 delete ishk-platform 2>/dev/null || echo "  (No process to delete)"

# Wait a moment
sleep 2

# Start the application
pm2 start ecosystem.config.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to start application"
  exit 1
fi

# Wait for startup
echo ""
echo "Waiting for application to initialize..."
sleep 5

# Check status
echo ""
echo "PM2 Status:"
pm2 status

# Check if port is listening
echo ""
echo "Checking if port 3000 is listening..."
sleep 2
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "  ✅ Port 3000 is listening!"
else
  echo "  ⚠️  Port 3000 is not listening yet (may need more time)"
  echo "  Check logs: pm2 logs ishk-platform --err"
fi

# Save PM2 configuration
pm2 save

echo ""
echo "✅ Fix complete!"
echo ""
echo "Next steps:"
echo "  - Monitor logs: pm2 logs ishk-platform --err"
echo "  - Check status: pm2 status"
echo "  - Test website: curl http://localhost:3000"

