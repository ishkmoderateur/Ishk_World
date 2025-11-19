# Quick Fix for VPS Build Error

## The Problem
Build fails with: `Cannot find module '@tailwindcss/postcss'`

## The Solution

Run these commands **on your VPS** (one by one):

```bash
# 1. Navigate to project
cd /var/www/ishk-platform

# 2. Check if package.json has @tailwindcss/postcss
grep "@tailwindcss/postcss" package.json

# 3. Remove old node_modules and lock file
rm -rf node_modules package-lock.json

# 4. Install ALL dependencies (including @tailwindcss/postcss)
npm install

# 5. Verify the package is installed
npm list @tailwindcss/postcss

# 6. Clean build cache
rm -rf .next

# 7. Rebuild
npm run build

# 8. Restart PM2
pm2 restart ishk-platform --update-env
```

## One-Line Command (Copy & Paste)

```bash
cd /var/www/ishk-platform && rm -rf node_modules package-lock.json .next && npm install && npm run build && pm2 restart ishk-platform --update-env
```

## What This Does

1. **Removes old node_modules** - Ensures clean install
2. **Removes package-lock.json** - Forces fresh dependency resolution
3. **Runs npm install** - Installs ALL packages from package.json (including @tailwindcss/postcss)
4. **Cleans .next** - Removes old build cache
5. **Rebuilds** - Creates fresh production build
6. **Restarts PM2** - Applies the new build

## Expected Output

After `npm install`, you should see:
```
+ @tailwindcss/postcss@4.1.17
```

After `npm run build`, you should see:
```
✓ Compiled successfully
✓ Generating static pages
```

## If It Still Fails

Check that package.json on VPS has the dependency:

```bash
cat package.json | grep -A 20 '"dependencies"' | grep tailwindcss
```

Should show: `"@tailwindcss/postcss": "^4.1.17"`

If it's missing, you need to upload the updated package.json file to your VPS.





