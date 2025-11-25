#!/bin/bash
# Restart PM2 after building the application
# Run this on your VPS after npm run build

set -e

echo "🔄 Restarting PM2 with new build..."
cd /var/www/ishk-platform

# Stop and restart PM2
pm2 restart ishk-platform

echo ""
echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📝 Recent logs (last 30 lines):"
pm2 logs ishk-platform --lines 30 --nostream

echo ""
echo "✅ Done! Your application should now be running with the production build."
echo ""
echo "🌐 Test it:"
echo "   curl http://localhost:3000"
echo ""













