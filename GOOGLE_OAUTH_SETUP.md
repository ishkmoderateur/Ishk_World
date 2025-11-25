# Google OAuth Setup for ishk-world.com

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - User Type: **External** (unless you have a Google Workspace)
   - App name: **Ishk World**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Add `email`, `profile`, `openid`
   - Test users: Add your email (if in testing mode)
   - Click **Save and Continue**

6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Ishk World Web Client**
   - **Authorized JavaScript origins:**
     ```
     https://ishk-world.com
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     https://ishk-world.com/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**

7. Copy the **Client ID** and **Client Secret**

## Step 2: Update VPS Environment Variables

SSH into your VPS and update the `.env` file:

```bash
cd /var/www/ishk-platform
nano .env
```

Add or update these lines (replace with your actual values):

```env
NEXTAUTH_URL=https://ishk-world.com
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important:**
- `NEXTAUTH_URL` must be exactly `https://ishk-world.com` (no trailing slash)
- `NEXTAUTH_SECRET` should be a long random string (you can generate one with: `openssl rand -base64 32`)

## Step 3: Restart the Application

```bash
cd /var/www/ishk-platform
git pull origin main
pm2 restart ishk-platform
pm2 logs ishk-platform
```

## Step 4: Verify Configuration

Run the verification script:

```bash
cd /var/www/ishk-platform
node scripts/verify-google-oauth.js
```

## Troubleshooting

### Issue: "Page just reloads"
- Check that `NEXTAUTH_URL` is set correctly in `.env`
- Verify the redirect URI in Google Cloud Console matches exactly: `https://ishk-world.com/api/auth/callback/google`
- Check PM2 logs: `pm2 logs ishk-platform`

### Issue: "Missing client ID"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env`
- Make sure there are no extra spaces or quotes
- Restart PM2 after updating `.env`

### Issue: "Redirect URI mismatch"
- In Google Cloud Console, ensure the redirect URI is exactly: `https://ishk-world.com/api/auth/callback/google`
- Make sure `NEXTAUTH_URL` in `.env` is exactly `https://ishk-world.com`

## Testing

1. Visit: `https://ishk-world.com/auth/signin`
2. Click "Continue with Google"
3. You should be redirected to Google's login page
4. After logging in, you should be redirected back to your profile page
