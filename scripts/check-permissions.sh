#!/bin/bash
# Script to check GitHub repository permissions

echo "🔍 Checking GitHub Repository Access"
echo "====================================="
echo ""

# Get current git config
GIT_USER=$(git config user.name)
REMOTE_URL=$(git remote get-url origin)

echo "Current Configuration:"
echo "  Git Username: $GIT_USER"
echo "  Remote URL: $REMOTE_URL"
echo ""

# Extract repository info
if [[ $REMOTE_URL =~ github.com[:/]([^/]+)/([^/]+)\.git ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]}"
  
  echo "Repository Information:"
  echo "  Owner: $REPO_OWNER"
  echo "  Repository: $REPO_NAME"
  echo ""
  
  echo "To check permissions:"
  echo "  1. Visit: https://github.com/$REPO_OWNER/$REPO_NAME"
  echo "  2. Check if you can see the repository"
  echo "  3. Check if you can see Settings tab (if you have admin access)"
  echo ""
  
  echo "If you don't have access:"
  echo "  - Ask $REPO_OWNER to add '$GIT_USER' as a collaborator"
  echo "  - Or use the $REPO_OWNER account instead"
  echo ""
else
  echo "⚠️  Could not parse repository URL"
fi

echo "Current Git Status:"
git status --short
echo ""

if git log origin/main..HEAD --oneline 2>/dev/null | grep -q .; then
  echo "✅ Commits ready to push:"
  git log origin/main..HEAD --oneline
else
  echo "ℹ️  No commits to push"
fi



