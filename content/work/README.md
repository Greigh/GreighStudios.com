# Work entries

One `.mdx` file per project in this folder. The filename **is** the slug —
`voteaxis.mdx` → `/work/voteaxis`. Files are picked up automatically by
`src/lib/mdx.ts`; nothing needs registering. Only `.mdx` files are read, which
is why this reference is a `.md` and never appears on the site.

## Full frontmatter example

Every field the site reads, with the two optional ones included:

```mdx
---
title: Voteaxis
summary: One sentence, ~110–160 chars. Used on the card, the detail lede, <meta description>, and the OG description.
category: product
year: "2026"
status: in-progress
url: https://voteaxis.org
image: /work/voteaxis.webp
tags: [Product, Civic Tech, Mobile, iOS, Android, Flutter]
featured: true
---
```

## Fields

| Field      | Required | Type                                    | Notes |
|------------|----------|-----------------------------------------|-------|
| `title`    | yes      | string                                  | Falls back to the slug. Drives the `h1`, the card heading, and the page title. |
| `summary`  | yes      | string                                  | Defaults to `""`. Card body copy, detail-page lede, meta description, JSON-LD `description`. Keep it to one sentence — it wraps badly past ~160 chars. |
| `category` | yes      | `product` \| `client`                   | Defaults to `product`. Rendered lowercase in the card eyebrow and capitalised in the "Type" cell. |
| `year`     | yes      | string, quoted                          | **Quote it** — YAML would otherwise parse it as a number. Sorting is `Number(b.year) - Number(a.year)`, so it must stay numeric-looking. Also drawn as the giant watermark on image-less cards. |
| `status`   | yes      | `live` \| `in-progress` \| `archived`   | Defaults to `live`. Only `live` gets the cyan status dot; the other two render grey. |
| `url`      | no       | absolute URL                            | Omit and the "Visit live site" button is not rendered. Include the scheme. |
| `image`    | no       | path under `public/`                    | Omit and the card falls back to the `DissolveField` motif with the year watermark — a deliberate, finished-looking state, not a gap. Supply one and it renders both as the card plate (`object-cover object-top`) and as the full-width hero, so use a ~1600×900 `.webp` in `public/work/`. |
| `tags`     | yes      | string array                            | All of them render as chips on the card. **The last tag is reused on its own as the "Stack" cell** of the detail-page fact row — so end the list with the primary technology, not an incidental one. |
| `featured` | no       | boolean                                 | Controls the home page. If no entry is featured, the two most recent are used instead. |

## Body conventions

The body is MDX rendered through `MdxContent` into `.prose-gs`, capped at
`68ch`. No custom components are wired in yet, so plain markdown is the whole
vocabulary — and `globals.css` only styles `h2`, `h3`, `p`, `ul`/`li`, `a`, and
`strong`. Ordered lists, blockquotes, tables, images, and code blocks will
render unstyled; avoid them until they're designed.

Start at `h2` — the `h1` is the project title, supplied by the page. The
existing entries all follow the same four beats:

```mdx
## Overview

What the project is, and what the studio's role in it was.

## Problem

The constraint or the failure mode in the category that the work answers.

## Approach

- Decisions, not features
- Kept short enough that each line lands

## Outcome

Where it stands now, stated honestly — including what hasn't shipped yet.
```

Deviate when a project needs it, but keep `Overview` first: the section
directly follows the lede and the fact row.
