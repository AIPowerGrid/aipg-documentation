# pages — published docs content + navigation (Nextra)

## Purpose

The published documentation. Every `.mdx` here becomes a route under `aipowergrid.io/docs`.
Navigation (sidebar order, labels, separators, external links) is data-driven by `_meta.tsx`.

## Ownership

- **Top-level `.mdx`** — the docs pages: `index`, `quick-start`, `generate`, `streaming-api`
  (OpenAI/Anthropic-compatible API), `developers`, `run-a-node`, `worker-llm`, `worker-media`,
  `validator-node`, `grid-overview`, `autonomous-network`, `confidential-computing`,
  `tokenomics`, `staking`, `arc20_token_network`, `whitepaper`, `about`.
- **`_meta.tsx`** — top-level sidebar: ordered keys, section separators (Use the Grid / Run a
  Node / The Grid / Economy / Reference), external `page`-type links (Discord, GitHub), and
  hidden sections (`ai-workers` is `display: hidden`).
- **`p2p/`** — P2P mode (beta) docs subsection with its own `_meta.tsx`.
- **`ai-workers/`** — legacy worker docs; hidden from main nav (kept reachable, not promoted).
- **`_app.tsx`** — Next app wrapper; imports `../styles/globals.css`.

## Local Contracts

- **A page is invisible until it is in `_meta.tsx`.** Adding `foo.mdx` requires a `"foo"` key
  in the same directory's `_meta.tsx` to appear in the sidebar with the right label/position.
- Sidebar order follows `_meta.tsx` key order, not the filesystem.
- `.mdx` may use Nextra components (`Callout`, `Cards`) and frontmatter (`title`,
  `description` for SEO). Keep frontmatter `description` set on user-facing pages.
- Internal links account for `basePath: /docs`; static assets referenced as `/docs/...`.
- Subdirectories get their own `_meta.tsx` for their local sidebar (see `p2p/`, `ai-workers/`).

## Work Guidance

- New page: create `pages/<name>.mdx` (with frontmatter) + register in `pages/_meta.tsx`.
- New subsection: create `pages/<dir>/` with `index.mdx` + a `_meta.tsx`, then add the dir
  key to `pages/_meta.tsx`.
- Hiding a page from nav: `display: "hidden"` in `_meta.tsx`. External link: `type: "page"`
  with `href` + `newWindow`.

## Verification

- `npm run dev` and confirm the page renders and appears in the sidebar at the intended spot.

## Child DOX Index

- None — `p2p/` and `ai-workers/` are content subsections governed by this doc + their own
  `_meta.tsx`; no separate contracts.
