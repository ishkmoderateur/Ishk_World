#!/bin/bash
# Fix: Build the Next.js application before starting PM2
# Run this on your VPS: bash VPS_BUILD_FIX.sh

set -e  # Exit on error

echo "🔧 Fixing VPS Build Issue..."
echo ""

# Navigate to project directory
cd /var/www/ishk-platform

echo "📦 Step 1: Installing dependencies..."
npm install --production

echo ""
echo "🔨 Step 2: Generating Prisma client..."
npx prisma generate

echo ""
echo "🏗️  Step 3: Building Next.js application (this may take a few minutes)..."
npm run build

echo ""
echo "✅ Step 4: Checking if .next directory exists..."
if [ -d ".next" ]; then
    echo "✅ Build successful! .next directory found."
    ls -la .next | head -5
else
    echo "❌ ERROR: Build failed! .next directory not found."
    exit 1
fi

echo ""
echo "🔄 Step 5: Stopping PM2 processes..."
pm2 stop ishk-platform || true
pm2 delete ishk-platform || true

echo ""
echo "🚀 Step 6: Starting application with PM2..."
pm2 start ecosystem.config.js

echo ""
echo "💾 Step 7: Saving PM2 configuration..."
pm2 save

echo ""
echo "📊 Step 8: Checking PM2 status..."
pm2 status

echo ""
echo "📝 Step 9: Viewing recent logs..."
echo "--- Last 20 lines of output log ---"
pm2 logs ishk-platform --lines 20 --nostream

echo ""
echo "✅ Done! Your application should now be running."
echo ""
echo "🔍 To monitor logs in real-time, run:"
echo "   pm2 logs ishk-platform"
echo ""
echo "🌐 Test your application:"
echo "   curl http://localhost:3000"
echo ""













