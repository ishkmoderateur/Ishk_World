#!/bin/bash
# Verification script - Run this after the fix

echo "🔍 Verifying VPS Status..."
echo ""

echo "1️⃣ PM2 Status:"
pm2 status
echo ""

echo "2️⃣ Recent PM2 Logs (last 20 lines):"
pm2 logs ishk-platform --lines 20 --nostream
echo ""

echo "3️⃣ Check if @tailwindcss/postcss is installed:"
npm list @tailwindcss/postcss 2>/dev/null || echo "❌ Package not found"
echo ""

echo "4️⃣ Check if build directory exists:"
if [ -d ".next" ]; then
    echo "✅ Build directory exists"
    ls -la .next | head -5
else
    echo "❌ Build directory missing"
fi
echo ""

echo "5️⃣ Check if auth pages have Suspense:"
if grep -q "Suspense" src/app/auth/register/page.tsx 2>/dev/null; then
    echo "✅ Register page has Suspense"
else
    echo "❌ Register page missing Suspense"
fi
echo ""

echo "6️⃣ Test if app is responding:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 || echo "❌ App not responding on port 3000"
echo ""

echo "✅ Verification complete!"





