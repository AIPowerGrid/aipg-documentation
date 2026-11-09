# AI Power Grid Documentation

This is the documentation for the AI Power Grid project.

## Local Development

Use Node 22 and run `npm ci` to install the exact dependencies. The committed
`package-lock.json` and Vercel build both use npm.

Then, run `npm run dev` and visit `http://localhost:3000/docs`.

The site uses Nextra 4 with a thin App Router shell. Documents and navigation
live in `content/`; their public URLs retain the `/docs` base path. Internal
standards, proposals and decisions are not published.

## Release Checks

Run `npm run build` and `npm audit --audit-level=low`. The build checks current
claims and regression tests, type-checks the app, renders the documents and
generates the Pagefind search index. Test search using `npm start`, since its
index is generated from production HTML. Do not commit `public/_pagefind`.

Install the browser once with `npx playwright install chromium`, then run
`npm run test:e2e` after building. The runner owns a loopback production server
and checks every document, navigation/search, Mermaid, private-path 404s and
responsive headers. `DOCS_TEST_URL` can target a reviewed preview or live site
without submitting any inference or account mutations.

Dependency compatibility and the migration rationale are recorded in
`decisions/0001-supported-docs-runtime.md`. No audit exemptions or forced
dependency downgrades are part of the release path.
