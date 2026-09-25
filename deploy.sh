#!/usr/bin/env bash
set -euo pipefail

SERVER="azureuser@4.224.157.29"
PROJECT_DIR="~/projects/momsco"

echo "🚀 Deploying momsco to $SERVER..."

ssh "$SERVER" bash -s <<'REMOTE'
set -euo pipefail

export PATH="$HOME/.bun/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node/ 2>/dev/null | tail -1)/bin:$HOME/.local/bin:$PATH"

cd ~/projects/momsco

echo "📥 Pulling latest changes..."
git pull

echo "🔨 Building project..."
bun run build:skip-lint

# Find the pm2 process id for momsco
PM2_ID=$(pm2 jlist 2>/dev/null | grep -o '"pm_id":[0-9]*' | head -1 | cut -d: -f2)

if [ -z "$PM2_ID" ]; then
  # Fallback: restart by name
  echo "♻️  Restarting pm2 process 'momsco'..."
  pm2 restart momsco
else
  echo "♻️  Restarting pm2 process (id: $PM2_ID)..."
  pm2 restart "$PM2_ID"
fi

echo "✅ Deploy complete!"
pm2 status momsco
REMOTE
