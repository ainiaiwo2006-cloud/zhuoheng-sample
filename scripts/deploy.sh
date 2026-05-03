#!/usr/bin/env bash
# JUYUFANG one-shot deploy script.
#
# Run on the server inside the project directory:
#   ./scripts/deploy.sh
#
# What it does:
#   1. Pulls latest code from git
#   2. Verifies .env is present
#   3. Rebuilds the Docker image
#   4. Brings the stack up with zero-downtime swap
#   5. Tail logs for ~10 lines so you can see it healthy
#
# Idempotent — safe to re-run any time.

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "▶ Deploying JUYUFANG from $ROOT"

# ── 1. Pull latest ────────────────────────────────────────
if [ -d .git ]; then
  echo "→ git pull"
  git pull --ff-only
else
  echo "⚠ Not a git repo; skipping pull. Make sure you uploaded the latest code."
fi

# ── 2. Check .env ─────────────────────────────────────────
if [ ! -f .env ]; then
  echo "✗ .env is missing. Copy .env.example → .env and fill in SMTP_* values."
  exit 1
fi

# Sanity check the critical variables
required=(SMTP_HOST SMTP_USER SMTP_PASS SALES_NOTIFY_EMAIL NEXT_PUBLIC_SITE_URL)
missing=()
for v in "${required[@]}"; do
  if ! grep -q "^${v}=" .env || [ -z "$(grep "^${v}=" .env | cut -d= -f2-)" ]; then
    missing+=("$v")
  fi
done
if [ ${#missing[@]} -gt 0 ]; then
  echo "⚠ The following .env values are empty (mail / SEO won't work):"
  for v in "${missing[@]}"; do echo "    - $v"; done
  read -p "Continue anyway? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || exit 1
fi

# ── 3. Build & swap ───────────────────────────────────────
echo "→ docker compose build"
docker compose build

echo "→ docker compose up -d"
docker compose up -d --remove-orphans

# ── 4. Wait for health ────────────────────────────────────
echo "→ Waiting for web container to come up…"
for i in $(seq 1 30); do
  if docker compose ps web --format json 2>/dev/null | grep -q '"State":"running"'; then
    echo "  ✓ web is running"
    break
  fi
  sleep 1
done

# ── 5. Smoke check ────────────────────────────────────────
sleep 2
if curl -sf -o /dev/null http://127.0.0.1:3000; then
  echo "  ✓ Smoke test passed (HTTP 200 on /)"
else
  echo "  ✗ Smoke test failed — check 'docker compose logs web'"
  docker compose logs --tail=30 web
  exit 1
fi

# ── 6. Tail recent logs ───────────────────────────────────
echo ""
echo "▶ Recent logs (last 15 lines):"
docker compose logs --tail=15 web

echo ""
echo "✓ Deploy complete."
echo "  Site is live behind nginx at \$NEXT_PUBLIC_SITE_URL"
echo "  Sitemap: \$NEXT_PUBLIC_SITE_URL/sitemap.xml"
echo "  Robots:  \$NEXT_PUBLIC_SITE_URL/robots.txt"
