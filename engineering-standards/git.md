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

## Secret-history control

- Current-tree scanning is necessary but not sufficient. Before a repository is made public,
  before its first production-capable release, and during the scheduled security audit, scan
  the full reachable history of every protected default branch and release tag.
- Treat a committed credential as burned. Revoke or rotate it before deleting the file,
  rewriting history, or publishing a cleanup commit. Removing it from `HEAD` is not remediation.
- Classify findings without copying secret values into issues, logs, PRs, or chat. Record only
  the rule, affected repository/ref, exposure window, revocation evidence, and cleanup decision.
- Known public test vectors, deterministic local-only fixture credentials, and scanner false
  positives may be ignored only by exact fingerprint with a written rationale and review date.
  Never add a broad path or rule exclusion merely to make the scanner green.
- Rewriting published history is an owner-approved incident operation: preserve an immutable
  evidence bundle, coordinate clone/fork invalidation, force-update every affected ref and tag,
  and run the full-history scan again. Prefer a fresh-history public import when a private repo's
  accumulated history is not part of the public protocol contract.

## Pull Requests

- Small and focused; one logical change per PR.
- PR description: **what / why / how tested / risk**.
- **Squash-merge** to keep `main` linear. The squash subject follows Conventional Commits.
- CI (format, lint, type-check, tests, secret scan) must be green to merge.
- `CODEOWNERS` routes review for sensitive areas (contracts, settlement, auth).

## Releases

- **SemVer** tags (`vMAJOR.MINOR.PATCH`).
- `CHANGELOG.md` in keep-a-changelog style, derivable from Conventional Commits.
- Production-capable binaries and containers are built from a clean protected commit in CI,
  never from an operator workstation or an uncommitted tree.
- Every release publishes a machine-readable manifest binding the version and exact Git SHA to
  each artifact's platform, architecture, byte size, and SHA-256 digest. Publish an SBOM and a
  verifiable workflow signature/attestation alongside it.
- Installers and updaters fail closed unless the artifact, manifest, and signature verify. A
  checksum shown only on the same mutable download page is not independent provenance.

## Deployment records

- Record every deployment's exact Git SHA, immutable image/artifact digest, database migration
  revision, config-schema version, target environment, approving operator, start/end time,
  verification result, and rollback target.
- Production reports its deployed SHA through an authenticated operator endpoint and a
  non-sensitive public status surface. The recorded SHA must match the immutable artifact that
  actually started, not merely the branch head at deployment time.
- Do not deploy from a dirty worktree, moving branch reference, mutable container tag, or an
  artifact whose provenance cannot be verified. Rollbacks create a new deployment record rather
  than editing the failed record.

## Licensing

- **SPDX headers on every source file**:
  `# SPDX-License-Identifier: AGPL-3.0-or-later` (+ `SPDX-FileCopyrightText`). CI checks presence.

## Repository naming

One rule, applied to every first-party repo — no bare names, no `Mixed_Case`.

- **`grid-`** = the platform / protocol / infrastructure: the network, workers, SDKs,
  bridges, validator, core. Examples: `grid-core`, `grid-text-worker`,
  `grid-media-worker`, `grid-validator`, `grid-sdk-python`, `grid-sdk-js`,
  `grid-frontend`, `grid-erc20-bridge`.
- **`aipg-`** = org / brand / public surfaces: `aipg-website`, `aipg-documentation`,
  `aipg-smart-contracts`, `aipg-art-gallery`, `aipg-chat`.
- **Named products/personas keep their proper name** (no prefix) — e.g. `aigarth`.
  This is the only sanctioned exception; use it sparingly.
- All lowercase, hyphen-separated. No `_`, no caps.
- Renames are cheap (GitHub redirects the old path), but after one: update each
  clone's `git remote set-url`, any CI/deploy scripts that hardcode the name, and
  `AGENTS.md` cross-references.

## Repo hygiene

- Standard files in every repo: `README.md`, `AGENTS.md` (dox root), `LICENSE`,
  `.env.template`, `.gitignore`, CI workflow.
- `.gitignore` covers build/deps/secrets (`node_modules`, `.venv`, `dist`, `out`, `.env`).
