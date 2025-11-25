# Google OAuth Setup Guide

## Overview
Google OAuth is now integrated into the Ishk Platform for both sign-in and registration. Users can sign in or register using their Google account.

## Features
- ✅ Sign in with Google (existing users)
- ✅ Register with Google (new users automatically created)
- ✅ Automatic user creation in database
- ✅ Profile picture and name synced from Google
- ✅ Email verification automatically set

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (for development)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Ishk Platform` (or your preferred name)
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### 2. Add to Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 3. Restart Your Server

After adding the credentials, restart your development server:

```bash
npm run dev
```

## How It Works

### Sign In Flow
1. User clicks "Continue with Google" on sign-in page
2. Redirected to Google for authentication
3. User approves access
4. Google redirects back to your app
5. System checks if user exists in database
6. If exists: Updates profile picture/name if needed
7. If new: Creates user account automatically
8. User is signed in and redirected

### Registration Flow
1. User clicks "Continue with Google" on register page
2. Same flow as sign-in
3. New users are automatically created with:
   - Email (from Google)
   - Name (from Google)
   - Profile picture (from Google)
   - Email verified (automatically)
   - Default role: USER

## User Data Sync

The system automatically:
- Creates new users when they first sign in with Google
- Updates profile picture if user doesn't have one
- Updates name if user doesn't have one
- Sets email as verified (Google emails are pre-verified)
- Preserves existing user data (role, etc.)

## Security Notes

- Google OAuth users don't have passwords (password field is null)
- Email verification is automatic for Google accounts
- Users can still use email/password if they set one later
- OAuth tokens are handled securely by NextAuth.js

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`
- Check for trailing slashes or typos

### "Access blocked" error
- Make sure OAuth consent screen is configured
- Add your email as a test user (for development)
- Check that required scopes are added

### User not created in database
- Check server logs for errors
- Verify database connection
- Check that Prisma migrations are up to date

## Testing

1. Go to `/auth/signin` or `/auth/register`
2. Click "Continue with Google"
3. Sign in with a Google account
4. You should be redirected back and signed in
5. Check your profile page to see your Google account info

## Production Deployment

1. Update Google OAuth credentials with production URLs
2. Add production redirect URI to Google Console
3. Update `.env` file on your VPS/server
4. Restart your application



