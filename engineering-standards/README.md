# AI Power Grid — Engineering Standards

The canonical engineering rail for **all** AIPG repos. This is the single source of
truth; every repo's root `AGENTS.md` *inherits* these by reference and adds only its
local specializations. Don't duplicate these rules into repos.

> **Internal.** This folder lives outside `pages/`, so it is **not** published to the
> docs site (Nextra only routes `pages/`). It's for contributors, not end users.

## How a repo inherits

In each repo's root `AGENTS.md`:

```
## Local Contracts
- Inherit org engineering standards: aipg-documentation/engineering-standards/
- <repo-specific rules that differ from or extend the org standard>
```

## Index

- [00-core.md](00-core.md) — cross-cutting: config, errors, testing, security, observability, ADRs, Definition of Done.
- [git.md](git.md) — branching, commits (no AI attribution), PRs, releases, SPDX, secret scanning.
- [python.md](python.md) · [typescript.md](typescript.md) · [go.md](go.md) · [solidity.md](solidity.md) — per-language tooling + rules.

## Principles

1. **Gates, not suggestions.** Format/lint/type/test run in CI and pre-commit; red = blocked.
2. **The money and security paths get the most rigor.** Contracts, settlement, auth, metering.
3. **Write decisions down.** ADRs for load-bearing choices; dox (`AGENTS.md`) for durable contracts.
4. **Least privilege everywhere.** Short-lived/presigned creds; secrets never in code, logs, or chat.
5. **Public-utility bar.** This network handles real value — review and verify like it.
