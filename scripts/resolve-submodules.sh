#!/bin/sh
set -e

echo "=== Resolving git submodules ==="

# Copy .git from read-only bind mount to writable location
cp -r /tmp/.git /app/.git

# Read GITHUB_TOKEN from Vault .env (CI only)
TOKEN=""
if [ -f /tmp/.env ]; then
  TOKEN=$(grep '^GITHUB_TOKEN=' /tmp/.env | cut -d'=' -f2- | tr -d '\r')
fi

if [ -n "$TOKEN" ]; then
  echo "Token: found (length: ${#TOKEN})"
  git submodule init
  SUB_URL=$(git config submodule.src/app/editor.url)
  AUTH_URL=$(echo "$SUB_URL" | sed "s|https://github.com/|https://${TOKEN}@github.com/|")
  echo "Submodule URL (masked): $(echo "$AUTH_URL" | sed 's|://[^@]*@|://***@|')"
  git config submodule."src/app/editor".url "$AUTH_URL"
  git submodule update --recursive
else
  # Local dev: submodule data already in .git/modules/
  echo "Token: not found (using local .git/modules)"
  git submodule sync --recursive
  git submodule update --init --recursive
fi

# Remove .git dirs so PAT does not persist in any layer
rm -rf src/app/editor/.git .git

# Verify
if [ -f src/app/editor/package.json ]; then
  echo "=== Submodule resolved: OK ==="
else
  echo "=== Submodule resolved: FAILED ===" && exit 1
fi
