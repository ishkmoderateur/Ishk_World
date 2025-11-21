# VPS Deployment Guide for Ishk Platform

This guide provides step-by-step instructions for deploying the Ishk Platform to a Ubuntu VPS with PM2 and NGINX.

## Prerequisites

- Ubuntu 20.04+ VPS
- Node.js 18+ LTS installed
- PM2 installed globally (`npm install -g pm2`)
- NGINX installed
- Domain name configured (optional but recommended)

## Step 1: Server Setup

### Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 globally

```bash
sudo npm install -g pm2
```

### Install NGINX (if not already installed)

```bash
sudo apt update
sudo apt install nginx -y
```

## Step 2: Deploy Application

### Clone or upload your project

```bash
# If using Git
git clone <your-repo-url> /var/www/ishk-platform
cd /var/www/ishk-platform

# Or upload via SFTP/SCP to /var/www/ishk-platform
```

### Install dependencies

```bash
cd /var/www/ishk-platform
npm install --production
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run database migrations (if needed)

```bash
npx prisma migrate deploy
# Or for SQLite, ensure the database file exists
```

## Step 3: Environment Configuration

### Create `.env` file

```bash
nano /var/www/ishk-platform/.env
```

### Required Environment Variables

```env
# Node Environment
NODE_ENV=production

# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your-super-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com

# Database (SQLite for this project)
DATABASE_URL=file:./prisma/prod.db

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Email Service
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@yourdomain.com

# Optional: Translation Service
GOOGLE_TRANSLATE_API_KEY=your-api-key
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Set proper permissions

```bash
chmod 600 /var/www/ishk-platform/.env
chown -R $USER:$USER /var/www/ishk-platform
```

## Step 4: Build the Application

```bash
cd /var/www/ishk-platform
npm run build
```

Verify the build completed successfully with no errors.

## Step 5: Create Logs Directory

```bash
mkdir -p /var/www/ishk-platform/logs
chmod 755 /var/www/ishk-platform/logs
```

## Step 6: Start with PM2

### Start the application

```bash
cd /var/www/ishk-platform
pm2 start ecosystem.config.js
```

### Save PM2 configuration

```bash
pm2 save
```

### Setup PM2 to start on system boot

```bash
pm2 startup
# Follow the instructions provided by the command
```

### Useful PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs ishk-platform

# Restart application
pm2 restart ishk-platform

# Stop application
pm2 stop ishk-platform

# Monitor
pm2 monit
```

## Step 7: Configure NGINX Reverse Proxy

### Create NGINX configuration

```bash
sudo nano /etc/nginx/sites-available/ishk-platform
```

### NGINX Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For HTTP only (remove after SSL setup)
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Increase body size for file uploads
    client_max_body_size 10M;
}

# HTTPS Configuration (after SSL setup)
# server {
#     listen 443 ssl http2;
#     server_name yourdomain.com www.yourdomain.com;
#
#     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#         proxy_cache_bypass $http_upgrade;
#     }
#
#     client_max_body_size 10M;
# }
```

### Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/ishk-platform /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 8: Setup SSL with Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts and Certbot will automatically configure NGINX for HTTPS.

## Step 9: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
# Or if using UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Step 10: Verify Deployment

1. Check PM2 status: `pm2 status`
2. Check NGINX status: `sudo systemctl status nginx`
3. Check application logs: `pm2 logs ishk-platform`
4. Visit your domain in a browser

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs ishk-platform --lines 100

# Check environment variables
pm2 env 0

# Verify build
cd /var/www/ishk-platform
npm run build
```

### NGINX 502 Bad Gateway

- Verify PM2 is running: `pm2 status`
- Check if port 3000 is listening: `netstat -tlnp | grep 3000`
- Check NGINX error logs: `sudo tail -f /var/log/nginx/error.log`

### Database Issues

```bash
# Regenerate Prisma client
cd /var/www/ishk-platform
npx prisma generate

# Check database file permissions
ls -la prisma/
```

### Memory Issues

- Adjust `max_memory_restart` in `ecosystem.config.js`
- Reduce `instances` count if running low on memory

## Maintenance

### Update Application

```bash
cd /var/www/ishk-platform
git pull  # or upload new files
npm install --production
npx prisma generate
npm run build
pm2 restart ishk-platform
```

### Backup Database

```bash
# For SQLite
cp prisma/prod.db prisma/prod.db.backup.$(date +%Y%m%d)
```

### Monitor Resources

```bash
pm2 monit
htop  # or top
```

## Production Checklist

- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET generated and set
- [ ] NEXTAUTH_URL matches your domain
- [ ] Database configured and accessible
- [ ] Build completed successfully
- [ ] PM2 running and auto-start configured
- [ ] NGINX configured and running
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Firewall configured
- [ ] Logs directory created
- [ ] Application accessible via domain
- [ ] All API endpoints working
- [ ] Authentication working

## Support

For issues or questions, check:
- PM2 logs: `pm2 logs ishk-platform`
- NGINX logs: `/var/log/nginx/error.log`
- Application logs: `/var/www/ishk-platform/logs/`






