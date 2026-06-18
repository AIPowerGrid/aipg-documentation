# Git & GitHub Standards

## Branching

- `main` is always deployable and **branch-protected**: no direct pushes; PR required;
  required green CI; ≥1 review.
- Work on short-lived branches named `type/short-slug` (e.g. `feat/recipe-router`,
  `fix/redis-timeout`). Delete after merge.
- Rebase/update onto `main` before merge; keep branches small and focused.

## Commits

- **Conventional Commits**: `type(scope): summary`. Types: `feat`, `fix`, `chore`, `docs`,
  `refactor`, `test`, `perf`, `ci`, `build`. Imperative mood, ≤72-char subject.
- Body explains *why*, not *what* the diff already shows. Reference issues (`#NN`).
- **No AI / co-author attribution.** Do NOT add `Co-Authored-By: Claude`, `🤖 Generated
  with …`, or any tool/assistant trailer to commits or PR bodies. (Existing ones have been
  scrubbed from history; keep it that way.)
- Never commit secrets. Pre-commit secret scanning (gitleaks) must pass.

## Pull Requests

- Small and focused; one logical change per PR.
- PR description: **what / why / how tested / risk**.
- **Squash-merge** to keep `main` linear. The squash subject follows Conventional Commits.
- CI (format, lint, type-check, tests, secret scan) must be green to merge.
- `CODEOWNERS` routes review for sensitive areas (contracts, settlement, auth).

## Releases

- **SemVer** tags (`vMAJOR.MINOR.PATCH`).
- `CHANGELOG.md` in keep-a-changelog style, derivable from Conventional Commits.

## Licensing

- **SPDX headers on every source file**:
  `# SPDX-License-Identifier: AGPL-3.0-or-later` (+ `SPDX-FileCopyrightText`). CI checks presence.

## Repo hygiene

- Standard files in every repo: `README.md`, `AGENTS.md` (dox root), `LICENSE`,
  `.env.template`, `.gitignore`, CI workflow.
- `.gitignore` covers build/deps/secrets (`node_modules`, `.venv`, `dist`, `out`, `.env`).
