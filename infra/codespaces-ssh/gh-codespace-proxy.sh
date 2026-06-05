#!/usr/bin/env bash
set -euo pipefail

CODESPACE_NAME="${CODESPACE_NAME:-psychic-yodel-7v7pwxpj7gx93pj9w}"

if command -v gh >/dev/null 2>&1; then
  exec gh codespace ssh -c "$CODESPACE_NAME" --stdio
fi

exec "/mnt/c/Program Files/GitHub CLI/gh.exe" codespace ssh -c "$CODESPACE_NAME" --stdio

