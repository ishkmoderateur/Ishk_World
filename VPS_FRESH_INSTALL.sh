#!/bin/bash
# Fresh Installation Script for Ishk Platform on VPS
# Run this on your VPS server

set -e  # Exit on error

echo "🚀 Starting fresh installation of Ishk Platform..."

# Step 1: Navigate to web directory
echo "📁 Setting up directory..."
sudo mkdir -p /var/www
cd /var/www

# Step 2: Remove old installation if exists
if [ -d "ishk-platform" ]; then
    echo "⚠️  Removing old installation..."
    sudo rm -rf ishk-platform
fi

# Step 3: Clone repository
echo "📥 Cloning repository from GitHub..."
sudo git clone https://github.com/ishkmoderateur/Ishk_World.git ishk-platform
cd ishk-platform

# Step 4: Set permissions
echo "🔐 Setting permissions..."
sudo chown -R $USER:$USER /var/www/ishk-platform
chmod -R 755 /var/www/ishk-platform

# Step 5: Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Step 6: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Step 7: Create logs directory
echo "📝 Creating logs directory..."
mkdir -p logs
chmod 755 logs

# Step 8: Create .env file (if it doesn't exist)
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# Node Environment
NODE_ENV=production

# Database (SQLite)
DATABASE_URL="file:/var/www/ishk-platform/prisma/prod.db"

# NextAuth Configuration (REQUIRED - Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="CHANGE_THIS_TO_YOUR_GENERATED_SECRET"
NEXTAUTH_URL="https://yourdomain.com"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Payment Processing
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Optional: Email Service
RESEND_API_KEY=""
ADMIN_EMAIL=""

# Optional: Translation Service
GOOGLE_TRANSLATE_API_KEY=""
EOF
    echo "⚠️  IMPORTANT: Edit .env file and set NEXTAUTH_SECRET and NEXTAUTH_URL!"
    echo "   Run: nano .env"
    echo "   Generate secret: openssl rand -base64 32"
fi

# Step 9: Build application
echo "🔨 Building application..."
npm run build

# Step 10: Stop old PM2 processes (if any)
echo "🛑 Stopping old PM2 processes..."
pm2 delete ishk-platform 2>/dev/null || true

# Step 11: Start with PM2
echo "▶️  Starting application with PM2..."
pm2 start ecosystem.config.js

# Step 12: Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Step 13: Setup PM2 startup (if not already done)
echo "🔄 Setting up PM2 startup..."
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || pm2 startup

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Set NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "3. Set NEXTAUTH_URL to your domain"
echo "4. Restart PM2: pm2 restart ishk-platform"
echo "5. Check status: pm2 status"
echo "6. View logs: pm2 logs ishk-platform"
echo ""
echo "🌐 Configure NGINX (if not already done):"
echo "   See DEPLOYMENT.md for NGINX configuration"
echo ""

