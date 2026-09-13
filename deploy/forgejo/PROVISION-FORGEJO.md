# Forgejo Provisioning & Maintenance Runbook — git.greighstudios.com

This runbook describes the architecture, initial provisioning, administrative setup, maintenance, and backup procedures for **[Forgejo](https://forgejo.org/)** on the Greigh Studios VPS (`82.25.91.225`).

---

## 1. Architecture Overview

- **Service**: Forgejo standalone Go binary (`/usr/local/bin/forgejo`)
- **Systemd Unit**: `forgejo.service`
- **System User**: `git` (Home / working directory: `/var/lib/forgejo`)
- **Configuration**: `/etc/forgejo/app.ini` (Permissions: `0640`, owner: `root:git`)
- **Database**: SQLite3 at `/var/lib/forgejo/data/forgejo.db`
- **Git Repositories**: `/var/lib/forgejo/repositories`
- **LFS Storage**: `/var/lib/forgejo/data/lfs`
- **Internal Web Port**: `127.0.0.1:3030`
- **Reverse Proxy**: Nginx site `git.greighstudios.com` (`/etc/nginx/sites-available/git.greighstudios.com`)
- **TLS**: Let's Encrypt managed by Certbot
- **Public Domain**: `https://git.greighstudios.com`
- **Email Delivery**: Relayed through local Postfix MTA (`127.0.0.1:25`), sender `Greigh Studios Git <hello@greighstudios.com>`

---

## 2. Automated Installation & Upgrades

To install Forgejo or upgrade it to the latest version, run from your local repository:

```bash
./deploy/forgejo/install-forgejo.sh
```

To specify a specific release version:

```bash
FORGEJO_VERSION="16.0.4" ./deploy/forgejo/install-forgejo.sh
```

---

## 3. User Management & Restricting Registration (Admin-Only)

By default on this instance, **public registration is disabled** so only administrators can create new user accounts.

### A. How Registration is Disabled

In `/etc/forgejo/app.ini`, under `[service]`:

```ini
[service]
DISABLE_REGISTRATION = true
SHOW_REGISTRATION_BUTTON = false
```

When disabled:
- Visiting `/user/sign_up` displays: *"Registration is disabled. Please contact your site administrator."*
- Direct POST requests to `/user/sign_up` return HTTP `403 Forbidden`.
- The "Register" button is removed from the login page and navigation.

To apply configuration changes:
```bash
systemctl restart forgejo
```

---

### B. How Administrators Create New Accounts

#### Method 1: Forgejo Web UI (Recommended)
1. Sign in to [https://git.greighstudios.com](https://git.greighstudios.com) with an administrator account (`danielhipskind`).
2. Click the **Wrench icon** in the top navigation bar (or visit [https://git.greighstudios.com/admin](https://git.greighstudios.com/admin)).
3. In the left navigation, click **User Accounts** ([https://git.greighstudios.com/admin/users](https://git.greighstudios.com/admin/users)).
4. Click the blue **Create User Account** button in the upper right corner.
5. Fill in the user's details:
   - **Authentication Source**: Local
   - **Username**
   - **Email Address**
   - **Password** (or check *Send user email with credentials* / *Prompt user to change password on first login*)
6. Click **Create User Account**.

#### Method 2: Command Line (Forgejo CLI on VPS)
SSH into the server and run the CLI as the `git` user:

```bash
# Standard user
su - git -c "forgejo admin user create --username <username> --email <email> --password '<temporary_password>'"

# Administrator user
su - git -c "forgejo admin user create --admin --username <username> --email <email> --password '<temporary_password>'"
```

---

## 4. SSH Git Access

Forgejo uses OpenSSH passthrough on standard port `22`.
- When users add their public SSH keys in Forgejo's web UI (Settings -> SSH / GPG Keys), Forgejo writes the key into `/var/lib/forgejo/.ssh/authorized_keys` with a restricted command wrapper (`forgejo serv`).
- Clone URLs will be:
  ```bash
  git clone git@git.greighstudios.com:username/reponame.git
  ```
- To test your SSH connection:
  ```bash
  ssh -T git@git.greighstudios.com
  # Output: Hi there, <username>! You've successfully authenticated with the key...
  ```

---

## 5. Custom Branding (Greigh Studios Logo & Favicons)

Forgejo serves custom static assets from `/var/lib/forgejo/custom/public/`:
- **Navbar Logo:** `/var/lib/forgejo/custom/public/assets/img/logo.svg`
- **Fallback / App Logo:** `/var/lib/forgejo/custom/public/assets/img/logo.png`
- **Browser Favicon:** `/var/lib/forgejo/custom/public/assets/img/favicon.svg` and `favicon.png`
- **Apple Touch Icon:** `/var/lib/forgejo/custom/public/assets/img/apple-touch-icon.png`

These files are committed locally in `deploy/forgejo/custom/public/assets/img/` and automatically deployed by `install-forgejo.sh`.

If you change any of the branding images:
1. Upload to the VPS:
   ```bash
   scp -r deploy/forgejo/custom root@<VPS_IP>:/var/lib/forgejo/
   ssh root@<VPS_IP> "chown -R git:git /var/lib/forgejo/custom"
   ```
2. Clear the Nginx asset cache so browsers receive the new artwork immediately:
   ```bash
   ssh root@<VPS_IP> "rm -rf /var/cache/nginx/forgejo/* && systemctl reload nginx"
   ```

---

## 6. Backups and Restores

### Creating a Backup
Forgejo includes a built-in dump utility that bundles the database, repositories, configuration, and LFS objects into a single compressed archive:

```bash
# On the VPS
su - git -c "forgejo dump -c /etc/forgejo/app.ini -f /var/lib/forgejo/forgejo-backup-$(date +%Y%m%d).zip"
```

You can download this archive to your local machine via `scp`:

```bash
scp root@<VPS_IP>:/var/lib/forgejo/forgejo-backup-*.zip ~/Backups/
```

### Restoring a Backup
```bash
systemctl stop forgejo
unzip -q forgejo-backup-<date>.zip -d /tmp/forgejo-restore
# Restore files and database as needed, then restart:
systemctl start forgejo
```

---

## 6. Service Management & Troubleshooting

| Action | Command |
|---|---|
| View service status | `systemctl status forgejo` |
| View live logs | `journalctl -u forgejo -f` |
| Restart service | `systemctl restart forgejo` |
| Test Nginx configuration | `nginx -t` |
| Reload Nginx | `systemctl reload nginx` |
| Certbot certificate renewal test | `certbot renew --dry-run` |
