#!/bin/bash
# Deployment script for VPS
# Run this on your VPS server

echo "🚀 Deploying ishk-platform to VPS..."

# Navigate to project directory
cd /var/www/ishk-platform || exit 1

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations (if needed)
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting application with PM2..."
pm2 restart ishk-platform || pm2 start ecosystem.config.js

# Show status
echo "✅ Deployment complete!"
pm2 status






