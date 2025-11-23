# 🚀 Pre-Deployment Checklist - Ishk Platform

## ✅ Code Readiness

### Build & Compilation
- [x] TypeScript compilation passes
- [x] Next.js build completes successfully
- [x] All dependencies installed
- [x] No critical linter errors
- [x] Authentication redirect fixed

### Database
- [x] Prisma schema is up to date
- [x] Migrations are ready
- [x] Database connection string configured

### Environment Variables
- [ ] `.env` file prepared for production
- [ ] `NEXTAUTH_SECRET` generated (use: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `DATABASE_URL` configured
- [ ] Optional: OAuth credentials (Google)
- [ ] Optional: Stripe keys (if using payments)
- [ ] Optional: Email service keys (Resend)

## 📦 Files Ready for Deployment

### Required Files
- [x] `package.json` - Dependencies configured
- [x] `ecosystem.config.js` - PM2 configuration ready
- [x] `prisma/schema.prisma` - Database schema
- [x] `next.config.ts` - Next.js configuration
- [x] All source files in `src/`
- [x] Public assets in `public/`

### Deployment Scripts
- [x] `deploy-to-vps.sh` - Deployment script available
- [x] `DEPLOYMENT.md` - Complete deployment guide

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore` (should not be committed)
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] API keys are not hardcoded
- [ ] SSL certificate ready (Let's Encrypt)

## 🖥️ Server Requirements

### VPS Setup
- [ ] Ubuntu 20.04+ installed
- [ ] Node.js 18+ LTS installed
- [ ] PM2 installed globally
- [ ] NGINX installed
- [ ] Domain name configured (DNS pointing to VPS)
- [ ] Firewall configured (UFW)

### Server Access
- [ ] SSH access to VPS
- [ ] Sudo/root access
- [ ] Git access (if deploying from repo)
- [ ] Or SFTP/SCP access for file upload

## 📋 Pre-Deployment Steps

### 1. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Save this value for your `.env` file.

### 2. Prepare Environment File
Create `.env` with:
```env
NODE_ENV=production
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=file:./prisma/prod.db
```

### 3. Commit Changes (Optional)
```bash
git add .
git commit -m "Ready for production deployment"
git push
```

### 4. Test Build Locally
```bash
npm run build
```
Ensure it completes without errors.

## 🚀 Deployment Steps

### Option 1: Using Git (Recommended)
1. SSH into VPS
2. Clone repository
3. Install dependencies
4. Configure environment
5. Build application
6. Start with PM2
7. Configure NGINX

### Option 2: Using Deployment Script
1. Upload `deploy-to-vps.sh` to VPS
2. Make it executable: `chmod +x deploy-to-vps.sh`
3. Run: `./deploy-to-vps.sh`

### Option 3: Manual Deployment
Follow `DEPLOYMENT.md` step-by-step guide.

## ✅ Post-Deployment Verification

- [ ] Application accessible via domain
- [ ] Homepage loads correctly
- [ ] Authentication works (login/register)
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] PM2 shows app running
- [ ] NGINX serving correctly
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Logs are being generated

## 📝 Quick Deployment Commands

```bash
# On VPS - Quick Setup
cd /var/www/ishk-platform
npm install --production
npx prisma generate
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🆘 Troubleshooting

If deployment fails:
1. Check PM2 logs: `pm2 logs ishk-platform`
2. Check NGINX logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `pm2 env 0`
4. Test build: `npm run build`
5. Check database: `npx prisma studio`

## 📞 Support

Refer to:
- `DEPLOYMENT.md` - Full deployment guide
- `FIXES_SUMMARY.md` - Known issues and fixes
- `VPS_DEPLOYMENT_SIMPLE.md` - Simplified guide

---

**Status**: ✅ Ready for Deployment
**Last Updated**: $(date)





