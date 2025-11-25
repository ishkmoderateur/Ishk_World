#!/bin/bash
# Fix git pull conflicts on VPS
# Run this on your VPS

cd /var/www/ishk-platform

echo "🔄 Stashing local changes..."
git stash

echo "📥 Pulling latest changes..."
git pull origin main

echo "✅ Done! Now rebuild:"
echo "npm run build"
echo "pm2 restart ishk-platform"













