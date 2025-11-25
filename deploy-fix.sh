#!/bin/bash
# Quick deployment fix script
# Run this on your VPS after SSH connection

set -e

echo "🚀 Starting deployment fix..."

cd /var/www/ishk-platform

echo "📥 Pulling latest changes..."
git pull origin main

echo "🔧 Applying TypeScript fix..."
sed -i 's/updateData.images = images as Prisma.InputJsonValue;/(updateData as any).images = images;/' src/app/api/admin/products/\[id\]/route.ts

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart ishk-platform

echo "✅ Deployment complete!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs ishk-platform --lines 10 --nostream













