#!/bin/bash
# Quick fix for TypeScript error in photography-panel/page.tsx
# Run this on your VPS

cd /var/www/ishk-platform

# Fix the error by removing the problematic line
sed -i '478d' src/app/admin/photography-panel/page.tsx

# Or if that doesn't work, use this to find and remove the line:
# sed -i '/if (!albumResponse.ok) {/,/return;/{ /e\.target\.value = "";/d; }' src/app/admin/photography-panel/page.tsx

echo "✅ Fixed TypeScript error. Now rebuild:"
echo "npm run build"














