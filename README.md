# Greigh Studios

The official web application and portfolio showcase for **Greigh Studios LLC** — an independent product development and design studio building proprietary applications and engineering solutions.

- **Live Site:** [greighstudios.com](https://greighstudios.com)
- **Studio Git Forge:** [git.greighstudios.com](https://git.greighstudios.com)
- **License:** Source Available — see [License](#license)
- **Stack:** Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS v4, GSAP, TypeScript, and MDX

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) 16.3 (App Router, Turbopack, Server Components) |
| **Runtime & UI** | [React](https://react.dev/) 19.2, [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4 (`@tailwindcss/postcss`) |
| **Motion & Animation** | [GSAP](https://gsap.com/) 3.15 + `@gsap/react` |
| **Content Pipeline** | [MDX](https://mdxjs.com/) via `next-mdx-remote` & `gray-matter` |
| **Email Delivery** | [Nodemailer](https://nodemailer.com/) over local/remote Postfix SMTP |
| **Process Management** | [PM2](https://pm2.keymetrics.io/) (Cluster / Fork mode on production VPS) |
| **Edge & Proxy** | [Nginx](https://nginx.org/) with disk-backed asset caching & HTTP/2 TLS |
| **Source Control** | Dual-homed: [GitHub](https://github.com/Greigh/GreighStudios.com) & Self-Hosted [Forgejo](https://git.greighstudios.com) |

---

## Getting Started

### Prerequisites
- **Node.js:** `22.x` or higher
- **npm:** `10.x` or higher

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone git@git.greighstudios.com:greighstudios/GreighStudios.com.git
   cd GreighStudios.com
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack at `localhost:3000` |
| `npm run build` | Compile optimized production build (`next build`) |
| `npm run start` | Serve the production build locally (`next start`) |
| `npm run typecheck` | Validate TypeScript types without emitting files (`tsc --noEmit`) |
| `npm run lint` | Check formatting and styling with Prettier |
| `npm run format` | Automatically fix and apply Prettier formatting |
| `npm run deploy` | Run local production build check and deploy to production VPS (`deploy.sh`) |

---

## Project Structure

```text
├── content/
│   └── work/                      # Studio case studies in MDX
│       ├── fihaven.mdx            # FiHaven (personal finance & wealth planning)
│       ├── lgenia.mdx             # Lgenia (creative technology & web app)
│       ├── sensecast.mdx          # Sensecast (atmospheric intelligence & radar)
│       └── voteaxis.mdx           # Voteaxis (civic alignment & legislative tracking)
├── deploy/                        # Production deployment definitions & scripts
│   ├── ecosystem.config.cjs       # PM2 process manager configuration
│   ├── nginx.greighstudios.com.conf # Nginx reverse proxy configuration for main site
│   ├── origin-hardening.sh        # UFW & Cloudflare origin isolation script
│   └── forgejo/                   # Self-hosted Forgejo Git service stack
│       ├── app.ini.template       # Production Forgejo config template
│       ├── forgejo.service        # Systemd daemon definition (git:git)
│       ├── install-forgejo.sh     # Automated installer and upgrade script
│       ├── nginx.git.greighstudios.com.conf # Nginx reverse proxy & cache zone
│       ├── PROVISION-FORGEJO.md   # Operations & administration runbook
│       └── custom/                # Studio custom branding (logos, icons, portal templates)
├── public/                        # Static assets (brand marks, icons, fonts)
│   └── brand/                     # Official brand artwork (mark, favicons, touch icons)
│       ├── icons/                 # Opaque icon family, source artwork, and download bundle
│       └── transparent-icons/     # Original transparent mark in matching export sizes
├── scripts/
│   ├── export-brand-icons.mjs     # Rebuild background icon sizes and platform formats
│   └── export-transparent-icons.mjs # Rebuild transparent icon sizes and platform formats
├── src/
│   ├── app/                       # Next.js App Router pages and layouts
│   │   ├── api/contact/           # Contact form SMTP endpoint
│   │   ├── work/                  # Case study detail and index routes
│   │   ├── layout.tsx             # Root layout, metadata, and JSON-LD schemas
│   │   └── page.tsx               # Studio homepage
│   ├── components/                # Reusable React components
│   └── lib/                       # Site configuration, MDX loaders, and SEO utilities
└── deploy.sh                      # One-command production deployment script
```

---

## Brand Icons

The background icon uses the studio's silver and cyan mark over a navy surface with cyan and violet light. The full export family, including PNG sizes from 16 to 2048 pixels, JPEG, WebP, a multi-resolution ICO, and a macOS ICNS, lives in [`public/brand/icons/`](public/brand/icons/README.md). Download all files in [`greigh-studios-icons.zip`](public/brand/icons/greigh-studios-icons.zip).

The original transparent mark has 34 square PNG sizes from 16 to 4096 pixels in [`public/brand/transparent-icons/`](public/brand/transparent-icons/README.md), with transparent WebP, ICO, and ICNS versions. Download [`greigh-studios-transparent-icons.zip`](public/brand/transparent-icons/greigh-studios-transparent-icons.zip). These exports preserve the original mark's proportions and use transparent padding to fit square canvases. A saved 4096-pixel master derived from the larger original artwork allows every included size to be exported without upscaling.

The website uses Next.js file metadata (`src/app/icon.png`, `src/app/favicon.ico`, and `src/app/apple-icon.png`). Matching assets are included in the Forgejo customization directory. The transparent artwork in `public/brand/mark.png` remains the source for inline brand marks and organization structured data.

To regenerate the exports from the saved artwork:

```bash
node scripts/export-brand-icons.mjs
node scripts/export-transparent-icons.mjs
```

The built-in image generator produced the 1254×1254 background artwork. Its 1536 and 2048 pixel exports are resampled from that source; all smaller background exports are resized directly from it.

The text-free atmospheric [Google Play developer header](public/brand/google-play-header/README.md) is available as a [4096×2304 JPEG](public/brand/google-play-header/greigh-studios-google-play-header-4096x2304.jpg) below 1 MB. Its folder also contains the selected source artwork, generation brief, and exact export details. Regenerate the upload file with `node scripts/export-google-play-header.mjs`.

---

## Contact Form & Mail System

The `/api/contact` route validates submissions and dispatches notifications via SMTP using Nodemailer.

Configure email settings in `.env.local` (or production `.env`):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS`
- `CONTACT_TO`, `CONTACT_FROM`

> When running locally without SMTP credentials configured, the contact form fails gracefully with an informative message rather than crashing.

---

## Production Deployment & Infrastructure

The site and studio infrastructure run on a dedicated Ubuntu VPS (`82.25.91.225`):

### 1. Main Website Deployment
Deployments are initiated from a maintainer's machine and gated by an automated production build:

```bash
npm run deploy
```

* Secrets and deployment credentials live exclusively in `deploy/.env.deploy` (gitignored).
* Managed as a Node system service via **PM2** on internal port `3010`.
* Proxied through **Nginx** with Let's Encrypt TLS.

### 2. Self-Hosted Forgejo Git ([git.greighstudios.com](https://git.greighstudios.com))
The studio runs an internal, hardened **Forgejo** forge instance for version control, CI/CD, and client deliverables:

- **Runbook:** [`deploy/forgejo/PROVISION-FORGEJO.md`](deploy/forgejo/PROVISION-FORGEJO.md)
- **Installer / Upgrade:** `./deploy/forgejo/install-forgejo.sh`
- **Security:** Public self-registration is permanently disabled (`DISABLE_REGISTRATION = true`); all contributor accounts are provisioned exclusively by studio administrators.
- **Branding:** Custom studio portal home page, multi-resolution background icons, and transparent brand marks in `deploy/forgejo/custom/`.
- **SSH Git Access:** Passthrough on port `22` (`git@git.greighstudios.com:...`).

### 3. Studio Repositories Hosted on Forgejo
The following studio projects are hosted under the `@greighstudios` organization:

| Repository | Scope | Access |
|---|---|:---:|
| **GreighStudios.com** | Studio flagship web platform | Public |
| **danielhipskind.com** | Founder portfolio and engineering showcase | Public |
| **FiHaven** | Personal finance and wealth planning platform | Public |
| **Sensecast** | Atmospheric intelligence and hyper-local radar engine | **Private** |
| **Voteaxis** | Civic alignment and representative scoring system | **Private** |
| **lgenia.com** | Creative technology platform | **Private** |
| **Blockingmachine** | Filter list optimization and ad-blocking manager | **Private** |

---

## Git Remotes & Branch Management

This repository is dual-homed. Changes can be pushed to both the studio's self-hosted forge and GitHub:

```bash
# Push to Self-Hosted Forgejo:
git push forgejo main

# Push to GitHub:
git push origin main
```

---

## License

**Greigh Studios Source Available License v1.0** — see [LICENSE](LICENSE).

This project is source available, **not open source**. You may view and study the code and run it locally for evaluation, but you may not republish it as your own site or reuse the Greigh Studios brand, logo, trademark artwork, copy, or case-study materials.

For commercial licensing or partnership inquiries: **hello@greighstudios.com**.
