#!/bin/bash
# Fix database issues on VPS
# Run this on your VPS: bash VPS_FIX_DATABASE.sh

set -e

echo "🔧 Fixing database issues..."
cd /var/www/ishk-platform

# 1. Check DATABASE_URL in .env
echo "📋 Checking DATABASE_URL..."
if grep -q "DATABASE_URL" .env; then
    DATABASE_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
    echo "   DATABASE_URL: $DATABASE_URL"
    
    # Extract path from DATABASE_URL (format: file:/path/to/db)
    DB_PATH=$(echo $DATABASE_URL | sed 's/file://')
    DB_DIR=$(dirname "$DB_PATH")
    
    echo "   Database path: $DB_PATH"
    echo "   Database directory: $DB_DIR"
    
    # 2. Create directory if it doesn't exist
    if [ ! -d "$DB_DIR" ]; then
        echo "📁 Creating database directory: $DB_DIR"
        mkdir -p "$DB_DIR"
    fi
    
    # 3. Check if database file exists
    if [ ! -f "$DB_PATH" ]; then
        echo "📊 Database file doesn't exist. Creating it..."
        # Create empty file first
        touch "$DB_PATH"
    fi
    
    # 4. Set correct permissions
    echo "🔐 Setting permissions..."
    chmod 664 "$DB_PATH" 2>/dev/null || true
    chown $USER:$USER "$DB_PATH" 2>/dev/null || true
    
    # 5. Run migrations to create tables
    echo "🏗️  Running database migrations..."
    npx prisma migrate deploy || npx prisma db push
    
    echo "✅ Database setup complete!"
else
    echo "❌ DATABASE_URL not found in .env file!"
    echo "   Please add: DATABASE_URL=\"file:/var/www/ishk-platform/prisma/prod.db\""
    exit 1
fi

echo ""
echo "👥 Creating test users..."
npm run create-test-users

echo ""
echo "✅ Done!"











