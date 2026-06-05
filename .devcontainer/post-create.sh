#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update
sudo apt-get install -y ansible rsync

corepack enable
corepack prepare pnpm@10.24.0 --activate

pnpm install --frozen-lockfile

(
  cd playwright-tests
  npm ci
  npx playwright install --with-deps chromium
)

echo "Codespace listo. Ejecuta infra/codespaces/README.md para preparar env, seed y pruebas."
