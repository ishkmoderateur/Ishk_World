# GitHub Authentication Setup for blackkweather

## Important: GitHub No Longer Accepts Passwords

GitHub **stopped accepting passwords** for Git operations in August 2021. Even with your correct password, authentication will fail.

You **MUST use a Personal Access Token** instead.

## Step 1: Create Personal Access Token

1. **Login to GitHub** with your account: `blackkweather`
   - Go to: https://github.com/login

2. **Go to Token Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: Settings → Developer settings → Personal access tokens → Tokens (classic)

3. **Generate New Token:**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - If asked, authenticate with your password: `0672979039Aa`

4. **Configure Token:**
   - **Note:** `Ishk Platform - Push Access`
   - **Expiration:** Choose (I recommend 90 days or 1 year)
   - **Scopes:** Check ✅ **`repo`** (full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`

5. **Generate and Copy:**
   - Scroll down and click **"Generate token"**
   - **IMPORTANT:** Copy the token immediately - it starts with `ghp_` and looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!

## Step 2: Update Git Configuration

Your Git username is now set to: `blackkweather`

Verify with:
```bash
git config user.name
```

## Step 3: Push Using Token

When you run:
```bash
git push origin main
```

You'll be prompted:
- **Username:** `blackkweather`
- **Password:** `<paste your Personal Access Token here>` (NOT your actual password)

## Step 4: Save Credentials (Recommended)

To avoid entering the token every time:

**On Windows:**
```bash
git config --global credential.helper wincred
```

**On Linux/Server:**
```bash
git config --global credential.helper store
```

Then on your first push, enter:
- Username: `blackkweather`
- Password: `<your Personal Access Token>`

Git will save it for future use.

## Alternative: Embed Token in Remote URL

You can add the token directly to the remote URL:

```bash
git remote set-url origin https://blackkweather:YOUR_TOKEN@github.com/ishkmoderateur/Ishk_World.git
```

Replace `YOUR_TOKEN` with your actual Personal Access Token.

⚠️ **Security Note:** This stores the token in your git config. Only do this if you trust your system.

## Troubleshooting

### "Invalid username or token"
- Make sure username is: `blackkweather`
- Verify you're using the **Personal Access Token**, not your password
- Check that token has `repo` scope enabled

### "Permission denied"
- The account `blackkweather` needs write access to `ishkmoderateur/Ishk_World`
- Contact repository owner if you don't have access

### Still having issues?
1. Verify token is valid: https://github.com/settings/tokens
2. Check token hasn't expired
3. Regenerate token if needed

## Current Repository Status

- **Local Username:** `blackkweather`
- **Repository:** `https://github.com/ishkmoderateur/Ishk_World.git`
- **Ready to push:** ✅ Commit `55fcf9b` - "fix: Resolve website not loading issues"



