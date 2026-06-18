# TypeScript / JavaScript Standards

Used by: aigarth-agent, grid-frontend, grid-chat-new, grid-sdk, aipg-sdk-js, aipg-documentation, etc.

## Toolchain (CI + pre-commit gates)

- **ESLint** + **Prettier** (`eslint .` + `prettier --check`).
- **tsc** strict mode (`strict: true`, `noUncheckedIndexedAccess`). Build must type-check.
- Tests: **vitest** (or jest where established). Node services: a smoke test that exercises
  the real path.
- Pin deps; commit the lockfile. Use the repo's package manager consistently (npm/pnpm).

## Conventions

- **No `any`** without an inline justification comment; prefer `unknown` + narrowing.
- `strict: true`; model data with types/interfaces, not loose objects.
- ESM (`"type": "module"`) for new packages; explicit `.js` import specifiers when required.
- Errors: typed/`Error` subclasses; never swallow in empty `catch`.
- No secrets in client bundles; frontend reads only public config.
- Async: always handle rejections; no floating promises (lint-enforced).

## Layout

- `tsconfig.json` strict; `src/` for source, build to `dist/` (gitignored).
- Frontends (Next.js): keep server-only secrets out of client components.
