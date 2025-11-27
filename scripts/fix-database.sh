#!/bin/bash
# Script to fix database schema issues

echo "🔧 Fixing Database Schema"
echo "========================="
echo ""

# Load environment variables
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Loaded environment variables from .env"
else
  echo "❌ .env file not found!"
  exit 1
fi

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set!"
  exit 1
fi

echo "Database: $DATABASE_URL"
echo ""

# Check if database file exists
DB_PATH=$(echo "$DATABASE_URL" | sed 's/file://' | sed 's|^/||')
if [ ! -f "$DB_PATH" ]; then
  echo "⚠️  Database file not found at: $DB_PATH"
  echo "   Creating database..."
  mkdir -p "$(dirname "$DB_PATH")"
  touch "$DB_PATH"
fi

# Check if currency column exists in products table
echo "Checking products table schema..."
if sqlite3 "$DB_PATH" "PRAGMA table_info(products);" 2>/dev/null | grep -q "currency"; then
  echo "  ✅ currency column exists in products table"
else
  echo "  ❌ currency column missing in products table"
  echo "  Adding currency column..."
  sqlite3 "$DB_PATH" "ALTER TABLE products ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "  ✅ Added currency column to products table"
  else
    echo "  ⚠️  Failed to add column (may already exist or error occurred)"
  fi
fi

echo ""
echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migration had issues (check output above)"
fi

echo ""
echo "Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
  echo "✅ Prisma Client generated successfully"
else
  echo "❌ Failed to generate Prisma Client"
  exit 1
fi

echo ""
echo "✅ Database fix complete!"

