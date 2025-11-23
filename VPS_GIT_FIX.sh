#!/bin/bash
# Fix git divergent branches and deploy
# Run this on your VPS

cd /var/www/ishk-platform

echo "🔄 Resolving git conflicts..."

# Stash any local changes
git stash

# Set merge strategy
git config pull.rebase false

# Pull with merge
git pull origin main

# Apply the TypeScript fix
echo "🔧 Applying TypeScript fix..."
sed -i 's/updateData.images = images as Prisma.InputJsonValue;/(updateData as any).images = images;/' src/app/api/admin/products/\[id\]/route.ts

# Rebuild
echo "🔨 Building..."
npm run build

# Restart
echo "🔄 Restarting PM2..."
pm2 restart ishk-platform

echo "✅ Done!"
pm2 status





