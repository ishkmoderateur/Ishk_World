#!/bin/bash
# ISHK Platform - VPS Deployment Script
# Run this on your Hostinger VPS to pull latest code and restart the app

set -e  # Exit on any error

APP_DIR="/var/www/ishk-platform"
LOG_FILE="$APP_DIR/logs/deploy.log"

echo "================================"
echo "🚀 ISHK Platform Deployment"
echo "================================"
echo "Timestamp: $(date)" >> "$LOG_FILE"

# 1. Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "❌ ERROR: App directory not found at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"
echo "✓ Changed to app directory: $APP_DIR"

# 2. Pull latest code from git
echo "📥 Fetching latest code from git..."
git fetch origin main >> "$LOG_FILE" 2>&1
git reset --hard origin/main >> "$LOG_FILE" 2>&1
echo "✓ Code updated to latest commit"

# 3. Install dependencies (reproducible with lock file)
echo "📦 Installing dependencies..."
npm ci >> "$LOG_FILE" 2>&1
echo "✓ Dependencies installed"

# 4. Build the app
echo "🔨 Building Next.js app..."
npm run build >> "$LOG_FILE" 2>&1
echo "✓ Build completed successfully"

# 5. Restart PM2
echo "♻️  Restarting with PM2..."
pm2 reload ecosystem.config.js --env production >> "$LOG_FILE" 2>&1
echo "✓ PM2 reloaded"

# 6. Verify app is running
echo "✅ Checking app status..."
sleep 3
pm2 status >> "$LOG_FILE"

# 7. Show recent logs
echo ""
echo "📋 Recent app logs:"
pm2 logs ishk-platform --lines 20 --nostream

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "🌐 Application running at:"
echo "   - Local: http://localhost:3000"
echo "   - Network: http://31.97.155.232:3000"
echo ""
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs ishk-platform"
echo "🔄 Restart: pm2 restart ishk-platform"
echo "⏹️  Stop: pm2 stop ishk-platform"
