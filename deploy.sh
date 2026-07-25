#!/usr/bin/env bash
set -euo pipefail

# Greigh Studios — repeatable deploy to the Hostinger VPS.
#
# Flow: local build gate -> backup -> rsync source -> server npm ci + build
#       -> write .env.production -> PM2 reload -> verify.
#
# One-time server/DNS/mail setup is NOT here — see deploy/PROVISION.md.
# Usage: ./deploy.sh   (or: npm run deploy)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/deploy/.env.deploy"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Missing $ENV_FILE"
  exit 1
fi

set -o allexport
# shellcheck disable=SC1090
source "$ENV_FILE"
set +o allexport

VPS_USER="${SSH_USER:-root}"
VPS_HOST="${SSH_HOST:?SSH_HOST not set}"
PROJECT_PATH="${PROJECT_PATH:-/var/www/greighstudios.com}"
APP_NAME="${APP_NAME:-greigh-studios}"
PORT="${PORT:-3010}"
TARGET="$VPS_USER@$VPS_HOST"

# --- SSH auth: build argv arrays (no secrets on the command line) -----------
if [ -n "${SSH_KEY:-}" ] && [ -f "${SSH_KEY:-}" ]; then
  SSH=(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
  RSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new"
elif [ -n "${SSH_PASSWORD:-}" ]; then
  command -v sshpass >/dev/null 2>&1 || {
    echo "❌ sshpass not found. Install: brew install hudochenkov/sshpass/sshpass"
    exit 1
  }
  export SSHPASS="$SSH_PASSWORD"
  # Force password auth so local agent keys don't exhaust MaxAuthTries first.
  PW_OPTS="-o PreferredAuthentications=password -o PubkeyAuthentication=no"
  SSH=(sshpass -e ssh $PW_OPTS -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
  RSH="sshpass -e ssh $PW_OPTS -o StrictHostKeyChecking=accept-new"
else
  echo "❌ No SSH auth configured (set SSH_PASSWORD or SSH_KEY in deploy/.env.deploy)"
  exit 1
fi
remote() { "${SSH[@]}" "$TARGET" "$@"; }

# --- 1. Local build gate — never touch prod on a broken build --------------
echo "→ [1/6] Local typecheck + build gate"
npm run typecheck
npm run build

# --- 2. Backup current release ---------------------------------------------
echo "→ [2/6] Backing up current release (keep 5 newest)"
remote "if [ -d '$PROJECT_PATH' ]; then \
  cp -a '$PROJECT_PATH' '${PROJECT_PATH}.backup_'\$(date +%Y%m%d_%H%M%S); \
  ls -dt ${PROJECT_PATH}.backup_* 2>/dev/null | tail -n +6 | xargs -r rm -rf; \
else mkdir -p '$PROJECT_PATH'; fi"

# --- 3. Sync source (server builds its own node_modules/.next) -------------
echo "→ [3/6] Syncing source to $TARGET:$PROJECT_PATH"
rsync -az --human-readable -e "$RSH" \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'logs' \
  --exclude '.env*' \
  --exclude '.DS_Store' \
  --exclude 'brand-assets' \
  --exclude '.claude' \
  --exclude '*.tsbuildinfo' \
  ./ "$TARGET:$PROJECT_PATH/"

# --- 4. Write runtime env (.env.production) via stdin — no remote parsing ---
echo "→ [4/6] Writing .env.production on server"
{
  echo "SMTP_HOST=${SMTP_HOST:-mail.greighstudios.com}"
  echo "SMTP_PORT=${SMTP_PORT:-465}"
  echo "SMTP_SECURE=${SMTP_SECURE:-true}"
  echo "SMTP_USER=${SMTP_USER:-hello@greighstudios.com}"
  echo "SMTP_PASS=${SMTP_PASS:-}"
  echo "CONTACT_TO=${CONTACT_TO:-hello@greighstudios.com}"
  echo "CONTACT_FROM=${CONTACT_FROM:-Greigh Studios <hello@greighstudios.com>}"
} | remote "mkdir -p '$PROJECT_PATH/logs' && cat > '$PROJECT_PATH/.env.production' && chmod 600 '$PROJECT_PATH/.env.production'"

# --- 5. Install, build, (re)start ------------------------------------------
echo "→ [5/6] Installing deps + building on server, then PM2 reload"
remote "cd '$PROJECT_PATH' && \
  npm ci && \
  npm run build && \
  ( pm2 reload deploy/ecosystem.config.cjs --only '$APP_NAME' --update-env \
    || pm2 start deploy/ecosystem.config.cjs --only '$APP_NAME' ) && \
  pm2 save"

# --- 6. Verify --------------------------------------------------------------
echo "→ [6/6] Verifying"
if remote "curl -sf -o /dev/null http://127.0.0.1:$PORT/"; then
  echo "✅ App responding on 127.0.0.1:$PORT"
else
  echo "⚠️  App did not respond locally yet — check: pm2 logs $APP_NAME"
fi
remote "pm2 status $APP_NAME" || true

echo ""
echo "✅ Deploy complete — https://greighstudios.com  ($(date '+%Y-%m-%d %H:%M:%S'))"
