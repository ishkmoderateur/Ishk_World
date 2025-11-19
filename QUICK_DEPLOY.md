# 🚀 Quick VPS Deployment Guide

## Option 1: Deploy via Git (Recommended)

### On Your Local Machine:

1. **Commit all changes:**
```bash
git add .
git commit -m "Production-ready: Security fixes, validation, and optimizations"
git push origin main
```

### On Your VPS:

2. **SSH into your VPS:**
```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

3. **Navigate to project directory:**
```bash
cd /var/www/ishk-platform
```

4. **Pull latest changes:**
```bash
git pull origin main
```

5. **Run deployment script:**
```bash
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

---

## Option 2: Direct Upload (If not using Git)

### On Your Local Machine:

1. **Create a deployment package:**
```bash
# Exclude unnecessary files
tar -czf ishk-platform-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='prisma/dev.db' \
  .
```

2. **Upload to VPS:**
```bash
scp ishk-platform-deploy.tar.gz root@your-vps-ip:/var/www/
```

### On Your VPS:

3. **Extract and setup:**
```bash
cd /var/www
tar -xzf ishk-platform-deploy.tar.gz -C ishk-platform
cd ishk-platform
npm install --production
npx prisma generate
npm run build
pm2 restart ishk-platform
```

---

## ⚡ Quick Deployment Commands (VPS)

Once you're SSH'd into your VPS, run these commands:

```bash
# Navigate to project
cd /var/www/ishk-platform

# Pull latest code (if using Git)
git pull origin main

# Install/update dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Restart with PM2
pm2 restart ishk-platform

# Check status
pm2 status
pm2 logs ishk-platform --lines 50
```

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed (if using Git)
- [ ] `.env` file exists on VPS with correct values
- [ ] `NEXTAUTH_SECRET` is set (generate with: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` matches your domain/IP
- [ ] Database file exists and has proper permissions
- [ ] PM2 is installed (`npm install -g pm2`)
- [ ] NGINX is configured and running

---

## 🔧 Environment Variables (VPS .env file)

Make sure your VPS `.env` file has:

```env
NODE_ENV=production
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=file:./prisma/prod.db
```

---

## 🐛 Quick Troubleshooting

**If build fails:**
```bash
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

**If PM2 won't start:**
```bash
pm2 delete ishk-platform
pm2 start ecosystem.config.js
pm2 save
```

**If NGINX shows 502:**
```bash
pm2 status  # Check if app is running
curl http://localhost:3000  # Test if app responds
sudo systemctl restart nginx
```

---

## 📝 After Deployment

1. **Verify the site works:**
   - Visit your domain/IP in browser
   - Test registration/login
   - Check admin panel access

2. **Monitor logs:**
   ```bash
   pm2 logs ishk-platform
   ```

3. **Check performance:**
   ```bash
   pm2 monit
   ```

---

**Ready to deploy? Run the commands above!** 🚀

