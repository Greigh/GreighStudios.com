# Greigh Studios

The marketing website for **Greigh Studios LLC** — a development and design
studio building its own products and partnering on client work.

- **Live:** [greighstudios.com](https://greighstudios.com)
- **License:** Source available — see [License](#license) below
- **Built with:** Next.js 16 (App Router), Tailwind CSS v4, GSAP, and MDX

## Getting started

Requires Node 22+ and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | Check formatting (Prettier) |
| `npm run format` | Apply formatting (Prettier) |

## Structure

| Path | Contents |
| --- | --- |
| `src/app` | Routes (App Router) and API routes |
| `src/components` | UI components |
| `src/lib` | Site config, MDX, and SEO helpers |
| `content/work` | Case studies (MDX) |
| `public` | Static assets |

## Contact form

The `/api/contact` route sends email over SMTP via Nodemailer. Configure it with
environment variables — see [`.env.example`](.env.example):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_TO`, `CONTACT_FROM`

With no SMTP configured, the form returns a graceful "email us" message rather
than erroring.

## Content

Case studies live in `content/work/*.mdx` — front matter (title, summary,
category, year, status, tags, image) plus an MDX body.

## Deployment

Deploys run from a maintainer's machine and are gated by a local build:

```bash
npm run deploy
```

Deploy configuration and secrets live in `deploy/.env.deploy`, which is not
committed. First-time server, DNS, TLS, and mailbox setup is documented for
maintainers in [`deploy/PROVISION.md`](deploy/PROVISION.md).

## License

**Greigh Studios Source Available License v1.0** — see [LICENSE](LICENSE).

This project is source available, **not open source**. You may view and study
the code and run it locally, but you may not republish it as your own site or
reuse the Greigh Studios brand, copy, or case-study content. Project-specific
terms are in Schedule A of the license.

For commercial or reuse permission: **hello@greighstudios.com**.
