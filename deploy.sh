#!/usr/bin/env bash
set -euo pipefail

# deploy.sh — push to GitHub and deploy to Vercel
# Usage: ./deploy.sh
# Prerequisites:
#  - git installed
#  - GitHub CLI (gh) installed and authenticated (gh auth login)
#  - Vercel CLI (vercel) installed and authenticated (vercel login)
#  - Run this script from the project root (it will cd to its directory automatically)

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "Project directory: $PROJECT_DIR"

# Check required commands
for cmd in git gh vercel; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: $cmd is not installed or not on PATH. Please install and authenticate before running this script." >&2
    echo "  gh: https://cli.github.com/" >&2
    echo "  vercel: https://vercel.com/docs/cli" >&2
    exit 1
  fi
done

# Ensure GH and Vercel auth
if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI not authenticated. Run: gh auth login" >&2
  exit 1
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Vercel CLI not authenticated. Run: vercel login" >&2
  exit 1
fi

read -p "Enter GitHub repo URL (e.g. https://github.com/Awais-Yaram/jobsHub.ai.git): " GITHUB_REPO
if [ -z "$GITHUB_REPO" ]; then
  echo "No repo URL provided. Exiting." >&2
  exit 1
fi

# Initialize git if needed
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Create or checkout main branch
git checkout -B main

# Add and commit
git add --all
if git diff --staged --quiet; then
  echo "No changes to commit."
else
  git commit -m "Initial commit: jobshub scaffold"
fi

# Set remote
if git remote get-url origin >/dev/null 2>&1; then
  echo "Updating origin to $GITHUB_REPO"
  git remote set-url origin "$GITHUB_REPO"
else
  echo "Adding origin $GITHUB_REPO"
  git remote add origin "$GITHUB_REPO"
fi

# Push
echo "Pushing to remote origin main..."
git push -u origin main --force

# Deploy to Vercel
read -p "Enter Vercel project name (leave empty to use repo name): " VERCEL_PROJECT_NAME
if [ -z "$VERCEL_PROJECT_NAME" ]; then
  VERCEL_PROJECT_NAME="$(basename "$GITHUB_REPO" .git)"
fi

echo "Deploying to Vercel as project: $VERCEL_PROJECT_NAME"
# --prod will create a production deployment and create the project if needed
vercel --prod --confirm --name "$VERCEL_PROJECT_NAME"

echo "Deployment finished (check above output for the URL)."

cat <<'INSTR'
Next: set Supabase environment variables in the Vercel project. Run the following commands (you will be prompted to paste values):

  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
  vercel env add SUPABASE_SERVICE_ROLE_KEY production

Alternatively, set them in the Vercel dashboard under Project > Settings > Environment Variables.

Important: Keep SUPABASE_SERVICE_ROLE_KEY secret — do not commit it into the repository.

If you want the script to also add/env values automatically, re-run this script and paste the secrets when prompted by the vercel CLI.
INSTR

echo "Done. If you run into permission errors pushing to GitHub, make sure your local git is authorized to push to the repo (SSH key or gh auth)."
