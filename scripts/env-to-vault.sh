#!/usr/bin/env bash
set -euo pipefail

# Convert .env file to vault-compatible flat JSON { "KEY": "value", ... }
# Usage: ./scripts/env-to-vault.sh [env-file] [output-file]
#   env-file    Path to .env file (default: .env.local)
#   output-file Path to output JSON file (default: stdout)

ENV_FILE="${1:-.env.local}"
OUTPUT_FILE="${2:-}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: File '$ENV_FILE' not found." >&2
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "Error: 'jq' is required but not installed." >&2
  exit 1
fi

json="{}"

while IFS= read -r line || [ -n "$line" ]; do
  # Trim leading/trailing whitespace
  line="$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

  # Skip empty lines and comments
  [[ -z "$line" || "$line" == \#* ]] && continue

  # Extract key and value from KEY=VALUE
  key="${line%%=*}"
  value="${line#*=}"

  # Skip lines without =
  [[ "$key" == "$line" ]] && continue

  # Skip keys that are empty or contain spaces (malformed)
  [[ -z "$key" || "$key" =~ [[:space:]] ]] && continue

  # Strip surrounding double or single quotes from value
  value="$(echo "$value" | sed "s/^['\"]//;s/['\"]$//")"

  # Build JSON using jq for proper escaping
  json="$(echo "$json" | jq --arg k "$key" --arg v "$value" '. + {($k): $v}')"

done <"$ENV_FILE"

if [ -n "$OUTPUT_FILE" ]; then
  echo "$json" | jq '.' >"$OUTPUT_FILE"
  echo "Vault JSON written to $OUTPUT_FILE" >&2
else
  echo "$json" | jq '.'
fi
