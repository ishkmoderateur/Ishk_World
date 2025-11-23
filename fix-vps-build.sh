#!/bin/bash
# VPS Build Fix Script
# Run this on your VPS to fix all build issues

set -e  # Exit on error

echo "🔧 Starting VPS build fix..."
cd /var/www/ishk-platform

echo "📦 Step 1: Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🧹 Step 2: Cleaning build cache..."
rm -rf .next

echo "🔨 Step 3: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🔄 Step 4: Restarting PM2..."
    pm2 restart ishk-platform --update-env
    echo "✅ All done! Your application should be running now."
    echo "📊 Check status with: pm2 status"
    echo "📝 Check logs with: pm2 logs ishk-platform"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi







