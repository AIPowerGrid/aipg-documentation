# engineering-standards — org-wide engineering rail (internal, unpublished)

## Purpose

The single source of truth for engineering standards across **all** AIPG repos. Every repo's
root `AGENTS.md` inherits this folder by reference and adds only local specializations — rules
are NOT duplicated into individual repos.

## Ownership

- `README.md` — the index + inheritance instructions + guiding principles. Start here.
- `00-core.md` — cross-cutting: config, errors, testing, security, observability, ADRs,
  Definition of Done.
- `git.md` — branching, commits (no AI attribution), PRs, releases, SPDX, secret scanning.
- `python.md` · `typescript.md` · `go.md` · `solidity.md` — per-language tooling + rules.

## Local Contracts

- **Internal only.** This folder lives outside `pages/`, so Nextra never publishes it. Do not
  move it under `pages/` and do not link it from public docs.
- **Canonical, not copied.** Improve a rule here; never fork it into a consumer repo. Consumer
  repos reference this path and list only their deltas.
- Keep `README.md`'s index in sync when adding/removing a standards file.

## Work Guidance

—

## Verification

—

## Child DOX Index

- None — leaf.
