# DOX framework

- DOX is a hierarchy of AGENTS.md files that carry the durable contracts for this repo.
- Agents must follow the DOX chain on every edit.

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees.
- Any work product must stay understandable from the nearest AGENTS.md plus every parent above it.

## Read Before Editing

1. Read this root AGENTS.md.
2. Identify every path you expect to touch.
3. Walk from repo root to each target, reading every AGENTS.md on the way.
4. The nearest AGENTS.md is the local contract; parents hold repo-wide rules.
5. If docs conflict, the closer doc controls local detail, but no child may weaken DOX.

Do not rely on memory — re-read the applicable chain in-session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done. Update the closest
owning AGENTS.md when a change affects: purpose/scope/ownership; durable structure,
contracts, or workflows; inputs/outputs/permissions/side-effects; or the Child DOX Index.
Remove stale text immediately. Refresh affected parent and child indexes.

## Style

Concise, current, operational. Stable contracts, not diary entries. Broad rules in parents,
concrete detail in children. Delete stale notes instead of explaining history.

---

# aipg-documentation — the public docs site (Next.js + Nextra)

## Purpose

The user-facing documentation for AI Power Grid, served at `aipowergrid.io/docs`. A Nextra
docs site (Next.js 14, Pages router) that publishes `.mdx` from `pages/`. This repo ALSO
hosts the org-wide **engineering-standards/** — the internal rail every AIPG repo inherits,
which is intentionally NOT published.

## Ownership

- **`pages/`** — the published docs: `.mdx` content + `_meta.tsx` navigation. Owned in its
  own AGENTS.md. Everything routable lives here (Nextra only routes `pages/`).
- **`engineering-standards/`** — internal org engineering standards (core + per-language +
  git). Outside `pages/`, so unpublished. Owned in its own AGENTS.md.
- **`theme.config.tsx`** — Nextra theme: logo, navbar links, SEO/OG `head`, footer, forced
  dark mode, edit-on-GitHub link.
- **`next.config.mjs`** — Nextra wiring; `basePath: '/docs'`. All asset/links are served
  under `/docs` (e.g. logo at `/docs/logo.png`).
- **`components/`** — small shared React/MDX components (e.g. `counters.tsx`). `styles/` —
  `globals.css`. `public/` — static assets (served under `/docs`). `pages/_app.tsx` loads
  global CSS.
- **`archive/`** — old, unpublished `DAPI-*` research markdown. Not routed, not maintained;
  do not link from published pages.

## Local Contracts

- **Inherit org engineering standards:** `/Users/j/fix-axios-vuln/aipg-documentation/engineering-standards/`
  (core + `git.md` + the matching language file). The rules below are docs-repo specializations.
- **Only `pages/` is published.** Anything that must NOT ship to the public site (standards,
  research, internal notes) lives outside `pages/`. Adding a routable page = adding to `pages/`.
- **`basePath` is `/docs`.** Internal links and asset paths must account for it; absolute
  asset refs use `/docs/...`.
- Deploy target is Vercel (`vercel.json`), which builds with **npm** (`npm install` /
  `npm run build`); `package-lock.json` is the committed lockfile. The README's `pnpm`
  note is stale — use npm to match CI/deploy.

## Work Guidance

- New doc page → add the `.mdx` under `pages/` AND register it in the nearest `_meta.tsx`
  (otherwise it is unlisted in the sidebar). See `pages/AGENTS.md`.
- Changing nav order/labels/separators → edit `_meta.tsx`, not the page frontmatter.
- Do not edit generated/vendored dirs: `.next/`, `node_modules/`, `.vercel/`, `.fallow/`.

## Verification

- `npm install` then `npm run dev` → http://localhost:3000/docs to preview.
- `npm run build` must succeed (Nextra/Next build is the gate before deploy).

## Child DOX Index

- [pages/AGENTS.md](pages/AGENTS.md) — published Nextra `.mdx` content + `_meta.tsx` nav.
- [engineering-standards/AGENTS.md](engineering-standards/AGENTS.md) — internal org standards (unpublished).
