<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.
This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->
- No AI attribution anywhere: no `Co-Authored-By` trailers, session links,
  "Generated with ..." lines, or AI/model names in commit messages, PR titles
  or bodies, code comments, docs, or GitHub comments.
- Commits are authored as Daniel Hipskind <dghipskind@gmail.com>.
- Branch names never start with `claude/`. If a session assigns a
  `claude/<name>` branch, work on and push `cloud/<name>` instead.
- Keep the Dexio wiki updated. At the end of a work session, write a session
  page at `projects/greighstudios/<YYYY-MM-DD>-<slug>` and link it from the
  `index` page so it is not an orphan. Record what changed, the git reality
  (committed / pushed / untracked), and what is deliberately left open.