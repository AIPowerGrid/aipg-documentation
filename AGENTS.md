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
docs site (Next.js 15, Pages router) that publishes `.mdx` from `pages/`. This repo ALSO
hosts the org-wide **engineering-standards/** — the internal rail every AIPG repo inherits,
which is intentionally NOT published.

## Ownership

- **`pages/`** — the published docs: `.mdx` content + `_meta.tsx` navigation.
  Governed directly by this root file because Nextra turns any nested
  `AGENTS.md` into a public page. Everything routable lives here.
- **`engineering-standards/`** — internal org engineering standards (core + per-language +
  git). Outside `pages/`, so unpublished. Owned in its own AGENTS.md.
- **`product-proposals/`** — internal, unpublished product and architecture
  proposals. These documents may describe planned surfaces but must label live
  and future behavior distinctly.
- **`theme.config.tsx`** — Nextra theme: logo, navbar links, SEO/OG `head`, footer, forced
  dark mode, edit-on-GitHub link.
- **`next.config.mjs`** — Nextra wiring; `basePath: '/docs'`. All asset/links are served
  under `/docs` (e.g. logo at `/docs/logo.png`).
- **`components/`** — small shared React/MDX components (e.g. `counters.tsx`). `styles/` —
  `globals.css`. `public/` — static assets plus the curated agent index at `/docs/llms.txt`.
  `pages/_app.tsx` loads global CSS.
- **`archive/`** — old, unpublished `DAPI-*` research markdown. Not routed, not maintained;
  do not link from published pages.
- **`.github/workflows/secret-scan.yml`, `.gitleaks.toml`, and `.gitleaksignore`** —
  pinned, checksum-verified complete-history scanning with exact historical fingerprints only.
- **`.github/workflows/docs-ci.yml`** - clean-install claim, build, and dependency-audit gate.
- **`scripts/check-current-claims.mjs`** - rejects a small set of retired
  current-product claims from routed pages and global SEO/OG metadata while
  intentionally excluding the clearly labeled legacy whitepaper.

## Local Contracts

- **Inherit org engineering standards:** `engineering-standards/`
  (core + `git.md` + the matching language file). The rules below are docs-repo specializations.
- **Only `pages/` is published.** Anything that must NOT ship to the public site (standards,
  research, internal notes) lives outside `pages/`. Adding a routable page = adding to `pages/`.
- **`basePath` is `/docs`.** Internal links and asset paths must account for it; absolute
  asset refs use `/docs/...`.
- `/docs/llms.txt` is a concise discovery index, not a duplicate API reference. It points
  agents to the canonical `grid-skill` instructions and selected current docs; keep those links
  valid when pages move.
- `/docs/integrations` is the canonical 60-second first-run path. Its initial
  key must carry `inference.submit` plus `account.read`, it must surface the
  canonical funding check before framework setup, and its bounded raw API smoke
  test must remain valid independently of any third-party client.
- `/docs/pricing` is the public discovery surface for Core's versioned
  `aipg.pricing.v1` catalog. It may publish only exact configured Grid rates and
  fresh, same-model comparison workloads from `comparison_evidence`; it must
  preserve evidence dates, source links, expiry behavior, availability/quality
  caveats, and the distinction between a non-mutating quote and authoritative
  request-time charging.
- `/docs/builder-credits` documents the manually reviewed `$5-$20` public
  builder pilot. It must preserve the 60-day expiry, one-grant-per-account and
  campaign limit, finite budget, service-only value, and private post-selection
  account handoff. Public copy must separate application review from issuance,
  which is allowed only while the promotional-credit spend rail is active. The
  application must never request credentials or a Grid account ID and must
  require non-sensitive test data because community workers may inspect
  plaintext prompts and outputs.
- `/docs/web3-starters` is the discovery surface for the five runnable Web3
  examples in `grid-provider-integrations/starters`. It must keep Grid keys
  server-side, quote before dispatch, describe the non-mutating quote as a
  client preflight guard rather than a server allowance, reject
  wallet-private-key custody, and distinguish application receipt IDs from
  verified on-chain JobAnchors.
- `/docs/connect-existing-stack` is the canonical sidecar-first worker
  explanation. It distinguishes the open text-worker path from advanced and
  qualification-gated media paths, documents actual operator controls, and
  states the plaintext community-worker boundary before setup instructions.
- Worker quickstarts must route ordinary operators through the verified `/run`
  release gate, never expose credentials in command arguments, and never claim
  concurrency, schedules, model support, or managed-media availability that the
  released runtime does not enforce.
- Deploy target is Vercel (`vercel.json`), which builds with **npm** (`npm install` /
  `npm run build`); `package-lock.json` is the committed lockfile.

## Work Guidance

- New doc page → add the `.mdx` under `pages/` AND register it in the nearest
  `_meta.tsx` (otherwise it is unlisted in the sidebar).
- Published current-state claims must be checked against owning sources:
  `grid-core` for API/charging/worker/validator/payout behavior;
  `aipg-smart-contracts/docs/ADDRESSES.md` plus Base for deployed contracts;
  and released worker repos for install commands. A deployed contract is not
  proof that its operational publisher, claim, or reward workflow is live.
- Keep customer account credits (USD-denominated usage balance) separate from
  worker den (non-transferable completed-work units). The current worker rail
  pays an hourly AIPG budget pro-rata to den; multi-asset preferences are stored
  but are not active payout routing.
- Label roadmap concepts and default-off prototypes explicitly. Do not publish
  exact economics, stake sizes, deterministic guarantees, model availability,
  or security authority as current without runtime/on-chain evidence.
- Do not promise a permanent or universally spendable free tier. Funding,
  promotions, daily allowances, and charging are independent runtime policies;
  public copy must defer to the Console/API unless live production evidence
  proves a narrower claim.
- Validator onboarding targets the published preview.13 local operator app,
  dedicated-account enrollment, and persistent Windows menu. It must not request a personal
  private key or imply existing-account pairing, validator rewards, or media
  assignments are available. Preserve existing operator identities on upgrades.
  The Linux 72-hour cohort path uses systemd and must pin the service helper to
  a reviewed immutable commit with an explicit SHA-256 check, separately from
  the frozen preview.13 binary. Never publish a mutable branch download,
  pipe-to-shell command, or credential-bearing command line.
- Do not place `AGENTS.md` anywhere under `pages/`: Nextra compiles Markdown in
  that tree into public routes. Keep the page-content contract here.
- Changing nav order/labels/separators → edit `_meta.tsx`, not the page frontmatter.
- Do not edit generated/vendored dirs: `.next/`, `node_modules/`, `.vercel/`, `.fallow/`.

## Verification

- `npm install` then `npm run dev` → http://localhost:3000/docs to preview.
- `npm run check:claims` rejects known retired promises from current pages.
- `npm run build` must succeed (Nextra/Next build is the gate before deploy).
- `npm audit` must report zero known vulnerabilities before deploy.
- `gitleaks git . --log-opts=HEAD --config .gitleaks.toml --redact --verbose`
  scans the complete history reachable from the candidate commit.

## Child DOX Index

- [engineering-standards/AGENTS.md](engineering-standards/AGENTS.md) — internal org standards (unpublished).
