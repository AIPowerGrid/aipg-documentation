# Core Standards (cross-cutting)

Applies to every repo regardless of language.

## Configuration

- **Typed, centralized, fail-fast.** One config module per service that reads all env once,
  validates on boot, and crashes loudly on missing/invalid values. No ad-hoc `getenv`
  scattered through the code.
- Every env var is documented in `.env.template` (or equivalent). Defaults are safe for dev.
- Secrets come from the environment / a secret store — never literals, never committed.

## Errors

- No silent swallowing. No bare `except:` / empty `catch`. Catch narrowly; if you catch
  broadly, log with context and re-raise or convert to a typed error.
- Services expose a **single structured error envelope** (consistent shape + error codes),
  not ad-hoc strings.
- Fail closed on the security/safety path; degrade gracefully elsewhere.

## Testing

- **Required coverage** (CI-enforced) on: value-handling (money/settlement/credits), auth,
  on-chain contracts, and public API surface (contract tests).
- Best-effort elsewhere; don't chase a global % — chase the risky paths.
- Tests are deterministic and hermetic (no live network/chain in unit tests; mock or fixture).
- Pre-commit runs the fast subset; CI runs the full suite.

## Security

- Secrets never in code, logs, error messages, or chat. Rotate anything exposed.
- Dependencies pinned; automated vulnerability audit in CI (`pip-audit` / `npm audit` /
  `govulncheck` / Renovate).
- Least privilege: short-lived, scoped, presigned credentials. Workers never hold standing
  cloud/bucket creds.
- Validate and clamp all input at trust boundaries (API, worker jobs, on-chain calls).
- On-chain: nothing deployed unaudited; deploys gated behind multisig/Ledger.

## Observability

- Structured logging (key/value, not f-string prose) at module-scoped loggers.
- Metrics for the hot paths (request rate/latency/errors, queue depth, worker health).
- Never log secrets or full user prompts at info level.

## Decisions & docs

- **ADRs** for load-bearing, expensive-to-reverse decisions (one file per decision).
- **dox**: keep `AGENTS.md` current on every meaningful change (the doc pass is part of done).

## Definition of Done

A change is done only when: tests pass · lint/format/type-check green · security checks pass ·
`AGENTS.md`/docs updated (dox pass) · PR reviewed and CI green.
