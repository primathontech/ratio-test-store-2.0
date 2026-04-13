#!/bin/sh
set -e

echo "=== Resolving git submodules ==="

# Copy .git from read-only bind mount to writable location
cp -r /tmp/.git /app/.git

# Extract PAT from origin URL if present
# Jenkins sets: https://TOKEN@GitHub.com/org/repo.git
# Local has:    https://github.com/org/repo.git (no token)
ORIGIN_URL=$(git config remote.origin.url)
echo "Origin URL (masked): $(echo "$ORIGIN_URL" | sed 's|://[^@]*@|://***@|')"

# Extract token using cut (no regex, no escaping issues)
# https://TOKEN@github.com/... -> split by / take 3rd part -> TOKEN@github.com -> split by @ take 1st part -> TOKEN
TOKEN=""
if echo "$ORIGIN_URL" | grep -q '@'; then
  TOKEN=$(echo "$ORIGIN_URL" | cut -d'/' -f3 | cut -d'@' -f1)
fi

if [ -n "$TOKEN" ]; then
  echo "Token found: yes (length: ${#TOKEN})"

  # Get submodule URL from .gitmodules and inject token
  git submodule init
  SUB_URL=$(git config submodule.src/app/editor.url)
  AUTH_URL=$(echo "$SUB_URL" | sed "s|https://github.com/|https://${TOKEN}@github.com/|")
  echo "Submodule URL (masked): $(echo "$AUTH_URL" | sed 's|://[^@]*@|://***@|')"

  # Set authenticated URL directly in git config
  git config submodule."src/app/editor".url "$AUTH_URL"

  # Clone and checkout the submodule
  git submodule update --recursive
else
  echo "Token found: no (using existing credentials)"
  # Locally, submodule data exists in .git/modules/
  git submodule sync --recursive
  git submodule update --init --recursive
fi

# Clean up - remove .git dirs (PAT must not persist in any layer)
rm -rf src/app/editor/.git .git

echo "=== Submodule resolved: $(ls src/app/editor/package.json && echo 'OK') ==="
