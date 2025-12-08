#!/bin/bash
# Script to safely restart the ISHK Platform application

echo "🔄 Restarting ISHK Platform"
echo "============================"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo "❌ PM2 is not installed. Please install it with: npm install -g pm2"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo "   Please create a .env file with required environment variables."
  exit 1
fi

# Check if build exists
if [ ! -d ".next" ]; then
  echo "⚠️  .next directory not found. Building application..."
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
  fi
  echo "✅ Build completed"
fi

# Generate Prisma Client if needed
if [ ! -d "node_modules/.prisma" ]; then
  echo "⚠️  Prisma Client not found. Generating..."
  npx prisma generate
  if [ $? -ne 0 ]; then
    echo "❌ Prisma Client generation failed!"
    exit 1
  fi
  echo "✅ Prisma Client generated"
fi

# Stop existing processes
echo ""
echo "Stopping existing processes..."
pm2 stop ishk-platform 2>/dev/null || echo "  (No existing process to stop)"
pm2 delete ishk-platform 2>/dev/null || echo "  (No existing process to delete)"

# Wait a moment
sleep 2

# Start the application
echo ""
echo "Starting application with PM2..."
pm2 start ecosystem.config.js

if [ $? -eq 0 ]; then
  echo "✅ Application started successfully"
  
  # Wait a few seconds and check status
  echo ""
  echo "Waiting for application to initialize..."
  sleep 5
  
  # Check PM2 status
  echo ""
  echo "Current PM2 status:"
  pm2 status
  
  # Check if processes are online
  OFFLINE_COUNT=$(pm2 jlist | grep -o '"status":"errored"\|"status":"stopped"' | wc -l)
  
  if [ "$OFFLINE_COUNT" -gt 0 ]; then
    echo ""
    echo "⚠️  Warning: Some processes may have failed to start"
    echo "   Check logs with: pm2 logs ishk-platform"
  else
    echo ""
    echo "✅ All processes are running"
  fi
  
  # Save PM2 configuration
  pm2 save
  
  echo ""
  echo "✅ Restart complete!"
  echo ""
  echo "Useful commands:"
  echo "  - View logs: pm2 logs ishk-platform"
  echo "  - Check status: pm2 status"
  echo "  - View error logs: tail -f logs/error.log"
else
  echo "❌ Failed to start application"
  echo "   Check the error messages above"
  exit 1
fi



