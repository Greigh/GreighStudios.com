#!/usr/bin/env bash
set -euo pipefail

# Provision or update Forgejo on the Hostinger VPS.
# Run from the repository root: ./deploy/forgejo/install-forgejo.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$ROOT_DIR/deploy/.env.deploy"

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
TARGET="$VPS_USER@$VPS_HOST"

# Setup SSH command
if [ -n "${SSH_KEY:-}" ] && [ -f "${SSH_KEY:-}" ]; then
  SSH=(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
  SCP=(scp -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new)
elif [ -n "${SSH_PASSWORD:-}" ]; then
  command -v sshpass >/dev/null 2>&1 || {
    echo "❌ sshpass not found. Install: brew install hudochenkov/sshpass/sshpass"
    exit 1
  }
  export SSHPASS="$SSH_PASSWORD"
  PW_OPTS="-o PreferredAuthentications=password -o PubkeyAuthentication=no"
  SSH=(sshpass -e ssh $PW_OPTS -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
  SCP=(sshpass -e scp $PW_OPTS -o StrictHostKeyChecking=accept-new)
else
  echo "❌ No SSH auth configured"
  exit 1
fi

remote() { "${SSH[@]}" "$TARGET" "$@"; }

echo "=== [1/7] Preparing system prerequisites on VPS ==="
remote 'bash -s' << 'EOF'
set -euo pipefail

# Ensure git and git-lfs are installed
if ! command -v git-lfs >/dev/null 2>&1; then
  echo "Installing git-lfs..."
  apt-get update -qq && apt-get install -y -qq git-lfs
  git lfs install --system
fi

# Create git system user if it doesn't exist
if ! id git >/dev/null 2>&1; then
  echo "Creating system user 'git'..."
  useradd -r -m -d /var/lib/forgejo -s /bin/bash -c "Forgejo Git Service" git
fi

# Prepare directories
mkdir -p /var/lib/forgejo/data /var/lib/forgejo/data/lfs /var/lib/forgejo/repositories
mkdir -p /var/lib/forgejo/.ssh
mkdir -p /var/log/forgejo
mkdir -p /etc/forgejo
chown -R git:git /var/lib/forgejo /var/log/forgejo
chmod 750 /var/lib/forgejo /var/log/forgejo
chmod 700 /var/lib/forgejo/.ssh
EOF

echo "=== [2/7] Installing / Updating Forgejo Binary ==="
FORGEJO_VERSION="${FORGEJO_VERSION:-16.0.4}"
DOWNLOAD_URL="https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64"

remote "bash -s" << EOF
set -euo pipefail
CURRENT_VER=""
if [ -x /usr/local/bin/forgejo ]; then
  CURRENT_VER="\$(/usr/local/bin/forgejo --version 2>/dev/null || true)"
fi

echo "Current binary: \$CURRENT_VER"
if [[ "\$CURRENT_VER" != *"$FORGEJO_VERSION"* ]]; then
  echo "Downloading Forgejo v$FORGEJO_VERSION..."
  curl -fsSL -o /usr/local/bin/forgejo "$DOWNLOAD_URL"
  chmod +x /usr/local/bin/forgejo
  echo "Forgejo binary installed: \$(/usr/local/bin/forgejo --version)"
else
  echo "Forgejo v$FORGEJO_VERSION is already installed."
fi
EOF

echo "=== [3/7] Deploying Configuration (app.ini) ==="
# Generate secrets if not already configured on remote
remote 'bash -s' << 'EOF'
set -euo pipefail
if [ ! -f /etc/forgejo/app.ini ]; then
  echo "Generating secrets for new app.ini..."
  SECRET_KEY=$(/usr/local/bin/forgejo generate secret SECRET_KEY)
  INTERNAL_TOKEN=$(/usr/local/bin/forgejo generate secret INTERNAL_TOKEN)
  JWT_SECRET=$(/usr/local/bin/forgejo generate secret JWT_SECRET)
fi
EOF

# Copy app.ini template and substitute tokens if new
remote "bash -s" << 'EOF'
set -euo pipefail
if [ ! -f /etc/forgejo/app.ini ]; then
  SECRET_KEY=$(/usr/local/bin/forgejo generate secret SECRET_KEY)
  INTERNAL_TOKEN=$(/usr/local/bin/forgejo generate secret INTERNAL_TOKEN)
  JWT_SECRET=$(/usr/local/bin/forgejo generate secret JWT_SECRET)

  cat << INI > /etc/forgejo/app.ini
APP_NAME = Greigh Studios Git
RUN_USER = git
RUN_MODE = prod
WORK_PATH = /var/lib/forgejo

[repository]
ROOT = /var/lib/forgejo/repositories
DEFAULT_BRANCH = main
ENABLE_PUSH_CREATE_USER = true
ENABLE_PUSH_CREATE_ORG = true

[server]
PROTOCOL         = http
DOMAIN           = git.greighstudios.com
ROOT_URL         = https://git.greighstudios.com
HTTP_ADDR        = 127.0.0.1
HTTP_PORT        = 3030
SSH_DOMAIN       = git.greighstudios.com
SSH_PORT         = 22
DISABLE_SSH      = false
START_SSH_SERVER = false
OFFLINE_MODE     = false
LFS_START_SERVER = true
APP_DATA_PATH    = /var/lib/forgejo/data

[lfs]
PATH = /var/lib/forgejo/data/lfs

[database]
DB_TYPE  = sqlite3
PATH     = /var/lib/forgejo/data/forgejo.db

[session]
PROVIDER = memory

[log]
MODE      = file
LEVEL     = info
ROOT_PATH = /var/log/forgejo

[security]
REVERSE_PROXY_TRUSTED_PROXIES = *
INSTALL_LOCK   = true
SECRET_KEY     = ${SECRET_KEY}
INTERNAL_TOKEN = ${INTERNAL_TOKEN}

[cache]
ADAPTER  = twoqueue
HOST     = {"size":100, "recent_ratio":0.25, "ghost_ratio":0.5}
INTERVAL = 60

[oauth2]
JWT_SECRET     = ${JWT_SECRET}

[mailer]
ENABLED        = true
SMTP_ADDR      = 127.0.0.1
SMTP_PORT      = 25
FROM           = "Greigh Studios Git" <hello@greighstudios.com>

[service]
REGISTER_EMAIL_CONFIRM            = false
ENABLE_NOTIFY_MAIL               = true
DISABLE_REGISTRATION              = true
ALLOW_ONLY_EXTERNAL_REGISTRATION = false
ENABLE_CAPTCHA                    = true
REQUIRE_SIGNIN_VIEW               = false
DEFAULT_KEEP_EMAIL_PRIVATE        = true
DEFAULT_ALLOW_CREATE_ORGANIZATION = true
DEFAULT_ENABLE_TIMETRACKING       = true
NO_REPLY_ADDRESS                  = noreply.git.greighstudios.com

[ui]
DEFAULT_THEME = forgejo-auto
INI
  chown -R git:git /etc/forgejo
  chmod 750 /etc/forgejo
  chmod 640 /etc/forgejo/app.ini
  echo "Created /etc/forgejo/app.ini"
else
  echo "/etc/forgejo/app.ini already exists; keeping existing configuration."
fi
EOF

if [[ -d "$SCRIPT_DIR/custom" ]]; then
  echo "=== Uploading Custom Branding (Logo & Icons) ==="
  "${SCP[@]}" -r "$SCRIPT_DIR/custom" "$TARGET:/var/lib/forgejo/"
  remote "chown -R git:git /var/lib/forgejo/custom"
fi

echo "=== [4/7] Installing systemd service ==="
"${SCP[@]}" "$SCRIPT_DIR/forgejo.service" "$TARGET:/etc/systemd/system/forgejo.service"
remote "systemctl daemon-reload && systemctl enable forgejo && systemctl restart forgejo"

echo "=== [5/7] Configuring Nginx & Cache ==="
remote 'bash -s' << 'EOF'
set -euo pipefail
mkdir -p /var/cache/nginx/forgejo
chown -R www-data:www-data /var/cache/nginx/forgejo
chmod 700 /var/cache/nginx/forgejo

cat << 'CONF' > /etc/nginx/conf.d/forgejo-cache.conf
proxy_cache_path /var/cache/nginx/forgejo levels=1:2 keys_zone=forgejo_assets:10m max_size=500m inactive=30d use_temp_path=off;
CONF
EOF
"${SCP[@]}" "$SCRIPT_DIR/nginx.git.greighstudios.com.conf" "$TARGET:/etc/nginx/sites-available/git.greighstudios.com"
remote "ln -sf /etc/nginx/sites-available/git.greighstudios.com /etc/nginx/sites-enabled/git.greighstudios.com"
remote "nginx -t && systemctl reload nginx"

echo "=== [6/7] Requesting TLS Certificate via Certbot ==="
remote 'bash -s' << 'EOF'
set -euo pipefail
# Check if certificate for git.greighstudios.com already exists
if ! certbot certificates 2>/dev/null | grep -q "git.greighstudios.com"; then
  echo "Obtaining TLS certificate for git.greighstudios.com..."
  certbot --nginx -d git.greighstudios.com --non-interactive --agree-tos -m hello@greighstudios.com || {
    echo "⚠️ Certbot issuance failed. Check DNS resolution and try running certbot manually."
  }
else
  echo "TLS certificate for git.greighstudios.com already exists."
fi
nginx -t && systemctl reload nginx
EOF

echo "=== [7/7] Verifying Forgejo Status ==="
remote "systemctl is-active forgejo && curl -sI http://127.0.0.1:3030/ | head -n 5"

echo ""
echo "✅ Forgejo installation complete!"
echo "Web URL: https://git.greighstudios.com"
echo "Check status anytime: systemctl status forgejo"
