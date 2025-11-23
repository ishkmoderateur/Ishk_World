# Simple VPS Deployment Guide - Ishk Platform

This is a simplified, step-by-step guide to get your application running on your VPS.

## 🎯 What You'll Need

- A VPS running Ubuntu (20.04 or newer)
- SSH access to your VPS
- A domain name (optional, but recommended)
- About 30-45 minutes

---

## 📋 Step-by-Step Instructions

### **Step 1: Connect to Your VPS**

Open your terminal and SSH into your VPS:

```bash
ssh root@your-vps-ip-address
# or
ssh your-username@your-vps-ip-address
```

---

### **Step 2: Install Required Software**

Run these commands one by one:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 (process manager)
sudo npm install -g pm2

# Install NGINX (web server/reverse proxy)
sudo apt install nginx -y

# Install Git (if you'll clone from repository)
sudo apt install git -y
```

---

### **Step 3: Upload Your Project to VPS**

You have two options:

#### **Option A: Using Git (Recommended)**

```bash
# Create project directory
sudo mkdir -p /var/www/ishk-platform
sudo chown -R $USER:$USER /var/www/ishk-platform

# Clone your repository (replace with your repo URL)
cd /var/www
git clone <your-git-repo-url> ishk-platform
cd ishk-platform
```

#### **Option B: Using SFTP/SCP**

Upload all your project files to `/var/www/ishk-platform` using:
- **WinSCP** (Windows)
- **FileZilla** (Windows/Mac/Linux)
- **SCP command**: `scp -r ./ishk-platform root@your-vps-ip:/var/www/`

Then:

```bash
cd /var/www/ishk-platform
```

---

### **Step 4: Install Project Dependencies**

```bash
# Make sure you're in the project directory
cd /var/www/ishk-platform

# Install all dependencies
npm install --production

# Generate Prisma client (IMPORTANT!)
npx prisma generate
```

---

### **Step 5: Create Environment File**

Create a `.env` file with your configuration:

```bash
nano .env
```

Paste this template and fill in your values:

```env
# Required - Set these!
NODE_ENV=production
NEXTAUTH_SECRET=generate-this-below
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=file:./prisma/prod.db

# Optional - Add these if you have them
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=
GOOGLE_TRANSLATE_API_KEY=
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

**Save the file:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Important:** Replace `https://yourdomain.com` with your actual domain. If you don't have a domain yet, use `http://your-vps-ip-address` temporarily.

---

### **Step 6: Build Your Application**

```bash
# Make sure you're still in the project directory
cd /var/www/ishk-platform

# Build the Next.js application
npm run build
```

Wait for the build to complete. You should see:
```
✓ Compiled successfully
✓ Generating static pages
```

---

### **Step 7: Create Logs Directory**

```bash
mkdir -p logs
chmod 755 logs
```

---

### **Step 8: Start Application with PM2**

```bash
# Start the application
pm2 start ecosystem.config.js

# Check if it's running
pm2 status

# View logs (to make sure everything is working)
pm2 logs ishk-platform
```

You should see your app running! Press `Ctrl + C` to exit the logs view.

**Save PM2 configuration** (so it persists after server restart):

```bash
pm2 save
pm2 startup
```

Follow the instructions that `pm2 startup` gives you (usually just copy and paste the command it shows).

---

### **Step 9: Configure NGINX (Reverse Proxy)**

Create NGINX configuration:

```bash
sudo nano /etc/nginx/sites-available/ishk-platform
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # If you don't have a domain, use your server IP
    # server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Allow larger file uploads
    client_max_body_size 10M;
}
```

**Important:** Replace `yourdomain.com` with your actual domain, or use `_` if you don't have a domain yet.

Save the file (`Ctrl + X`, then `Y`, then `Enter`).

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ishk-platform /etc/nginx/sites-enabled/

# Remove default NGINX site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test NGINX configuration
sudo nginx -t

# If test passes, reload NGINX
sudo systemctl reload nginx
```

---

### **Step 10: Configure Firewall**

Allow HTTP and HTTPS traffic:

```bash
# Allow HTTP
sudo ufw allow 'Nginx Full'
# Or specifically:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall (if not already enabled)
sudo ufw enable

# Check firewall status
sudo ufw status
```

---

### **Step 11: Setup SSL Certificate (HTTPS) - Recommended**

If you have a domain name, get a free SSL certificate:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure NGINX for HTTPS.

**After SSL setup, update your `.env` file:**

```bash
nano .env
```

Change `NEXTAUTH_URL` to use `https://`:

```env
NEXTAUTH_URL=https://yourdomain.com
```

Then restart PM2:

```bash
pm2 restart ishk-platform
```

---

### **Step 12: Verify Everything Works**

1. **Check PM2 status:**
   ```bash
   pm2 status
   ```
   Should show `ishk-platform` as `online`

2. **Check NGINX status:**
   ```bash
   sudo systemctl status nginx
   ```
   Should show `active (running)`

3. **Visit your site:**
   - Open your browser
   - Go to `http://yourdomain.com` or `http://your-vps-ip`
   - You should see your Ishk Platform homepage!

4. **Test the application:**
   - Try registering a new account
   - Try logging in
   - Navigate through different pages

---

## 🔧 Useful Commands for Management

### **PM2 Commands**

```bash
# View application status
pm2 status

# View logs
pm2 logs ishk-platform

# Restart application
pm2 restart ishk-platform

# Stop application
pm2 stop ishk-platform

# View detailed monitoring
pm2 monit

# View process info
pm2 info ishk-platform
```

### **NGINX Commands**

```bash
# Restart NGINX
sudo systemctl restart nginx

# Check NGINX status
sudo systemctl status nginx

# View NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Test NGINX configuration
sudo nginx -t
```

### **Application Updates**

When you need to update your application:

```bash
cd /var/www/ishk-platform

# Pull latest changes (if using Git)
git pull

# Install new dependencies
npm install --production

# Regenerate Prisma client
npx prisma generate

# Rebuild application
npm run build

# Restart PM2
pm2 restart ishk-platform
```

---

## 🐛 Troubleshooting

### **Application won't start**

```bash
# Check PM2 logs
pm2 logs ishk-platform --lines 100

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Verify environment variables
pm2 env 0
```

### **NGINX shows 502 Bad Gateway**

```bash
# Check if PM2 is running
pm2 status

# Check if application is listening on port 3000
curl http://localhost:3000

# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log
```

### **Can't access the site**

```bash
# Check firewall
sudo ufw status

# Check NGINX is running
sudo systemctl status nginx

# Check if port 80 is open
sudo netstat -tlnp | grep 80
```

### **Database errors**

```bash
# Regenerate Prisma client
cd /var/www/ishk-platform
npx prisma generate

# Check database file exists
ls -la prisma/

# Check file permissions
chmod 644 prisma/prod.db
```

---

## ✅ Quick Checklist

Before you finish, make sure:

- [ ] Node.js is installed (`node --version`)
- [ ] PM2 is installed (`pm2 --version`)
- [ ] NGINX is installed and running
- [ ] Project files are in `/var/www/ishk-platform`
- [ ] Dependencies are installed (`npm install --production`)
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] `.env` file is created with correct values
- [ ] Application is built (`npm run build`)
- [ ] PM2 is running the app (`pm2 status`)
- [ ] NGINX is configured and running
- [ ] Firewall allows HTTP/HTTPS
- [ ] SSL certificate is installed (if using domain)
- [ ] Site is accessible in browser

---

## 🎉 You're Done!

Your Ishk Platform should now be running on your VPS!

**Access your site:**
- With domain: `https://yourdomain.com`
- Without domain: `http://your-vps-ip-address`

**Need help?** Check the logs:
- Application logs: `pm2 logs ishk-platform`
- NGINX logs: `sudo tail -f /var/log/nginx/error.log`

---

## 📚 Additional Resources

- Full deployment guide: See `DEPLOYMENT.md`
- Fixes summary: See `FIXES_SUMMARY.md`
- PM2 documentation: https://pm2.keymetrics.io/
- NGINX documentation: https://nginx.org/en/docs/







