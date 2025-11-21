# 🚀 Quick VPS Setup - Fresh Clone

## Step-by-Step Commands

### 1. SSH into your VPS
```bash
ssh root@31.97.155.232
```

### 2. Run the installation script
```bash
# Download and run the installation script
curl -o /tmp/install.sh https://raw.githubusercontent.com/ishkmoderateur/Ishk_World/main/VPS_FRESH_INSTALL.sh
chmod +x /tmp/install.sh
/tmp/install.sh
```

### OR Manual Installation (Copy-paste these commands):

```bash
# Navigate to web directory
cd /var/www

# Remove old installation if exists
sudo rm -rf ishk-platform

# Clone repository
sudo git clone https://github.com/ishkmoderateur/Ishk_World.git ishk-platform
cd ishk-platform

# Set permissions
sudo chown -R $USER:$USER /var/www/ishk-platform

# Install dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Create logs directory
mkdir -p logs

# Create .env file
nano .env
```

### 3. Configure .env file

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Edit .env file:**
```bash
nano .env
```

**Paste this (replace with your values):**
```env
NODE_ENV=production
DATABASE_URL="file:/var/www/ishk-platform/prisma/prod.db"
NEXTAUTH_SECRET="paste-your-generated-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# Your Google keys (if you have them)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_TRANSLATE_API_KEY="your-google-translate-api-key"
```

**Save:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 4. Build and Start

```bash
# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Verify

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ishk-platform

# Check if app is running
curl http://localhost:3000
```

### 6. Configure NGINX (if needed)

```bash
sudo nano /etc/nginx/sites-available/ishk-platform
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

    client_max_body_size 10M;
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/ishk-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Setup SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ Done!

Your application should now be running at `http://yourdomain.com` or `https://yourdomain.com` (if SSL is configured).

## 🔄 Future Updates

To update the application:
```bash
cd /var/www/ishk-platform
git pull origin main
npm install --production
npx prisma generate
npm run build
pm2 restart ishk-platform
```

