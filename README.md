# Greigh Studios

Marketing site for **Greigh Studios LLC** — product studio and client partner for development and design.

- Domain: [greighstudios.com](https://greighstudios.com)
- Stack: Next.js 16, Tailwind CSS v4, GSAP, MDX, Nodemailer (VPS SMTP)

## Develop

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run format     # Prettier write
npm run lint       # Prettier check
npm run typecheck  # TypeScript 6 (`tsc --noEmit`)
```

## Contact form

The `/api/contact` route sends over SMTP through the VPS mail server
(`hello@greighstudios.com`). Configure in `.env.local` (dev) or
`.env.production` (server):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_TO`, `CONTACT_FROM`

See `.env.example`. With no SMTP config the form returns a graceful "email us"
message instead of throwing.

## Content

- Case studies: `content/work/*.mdx`

## Deploy

Repeatable app deploy from your machine (build gate → rsync → server build →
PM2 reload):

```bash
npm run deploy          # runs ./deploy.sh, reads deploy/.env.deploy
```

First-time server + DNS + mailbox setup is a one-time runbook:
[`deploy/PROVISION.md`](deploy/PROVISION.md).

- Host: Hostinger VPS `ORIGIN_IP_REDACTED`, shared with danielhipskind.com / fihaven.app
- PM2 app: `greigh-studios` on port `3010`
- Nginx: `deploy/nginx.greighstudios.com.conf`
- Mail: `hello@greighstudios.com` on the shared Postfix/Dovecot stack
