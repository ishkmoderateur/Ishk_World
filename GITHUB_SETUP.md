# GitHub Authentication Setup

## Current Configuration
- **Username:** `blackkweather`
- **Repository:** `https://github.com/ishkmoderateur/Ishk_World.git`
- **Authentication:** Requires Personal Access Token (GitHub no longer accepts passwords)

## Quick Setup

### 1. Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Ishk Platform Access`
4. Expiration: Choose your preference (90 days, 1 year, or no expiration)
5. Scopes: Check `repo` (this gives full repository access)
6. Click "Generate token"
7. **IMPORTANT:** Copy the token immediately - you won't see it again!

### 2. Use Token for Push

When you run `git push`, use:
- **Username:** `blackkweather`
- **Password:** `<paste your personal access token>`

### 3. Configure Git Credential Helper (Optional but Recommended)

Store credentials so you don't have to enter them every time:

**On Linux/Server:**
```bash
git config --global credential.helper store
```

**On Windows:**
```bash
git config --global credential.helper wincred
```

Then on your first push, enter:
- Username: `blackkweather`
- Password: `<your personal access token>`

Git will save these credentials for future use.

### 4. Alternative: Update Remote URL with Token

You can embed the token in the remote URL (less secure but convenient):

```bash
git remote set-url origin https://blackkweather:<YOUR_TOKEN>@github.com/ishkmoderateur/Ishk_World.git
```

⚠️ **Security Note:** This stores the token in your git config file. Only do this if you trust your system security.

## Troubleshooting

### "Authentication failed" error
- Make sure you're using a Personal Access Token, not your GitHub password
- Verify the token has `repo` scope enabled
- Check if the token has expired

### "Remote: Invalid username or token"
- Double-check your username: `blackkweather`
- Verify the token was copied correctly (no extra spaces)
- Generate a new token if needed

### Password prompt keeps appearing
- Set up credential helper (see step 3 above)
- Or use SSH authentication instead

## SSH Alternative

If you prefer SSH authentication:

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add SSH key to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Add to: https://github.com/settings/keys

3. Update remote URL:
   ```bash
   git remote set-url origin git@github.com:ishkmoderateur/Ishk_World.git
   ```

## Current Repository Status

- Local branch: `main`
- Remote: `origin/main`
- Repository: `https://github.com/ishkmoderateur/Ishk_World.git`



