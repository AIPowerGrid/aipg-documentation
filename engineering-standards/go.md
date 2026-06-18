# Go Standards

Used by: aipg-art-gallery (and other Go services).

## Toolchain (CI + pre-commit gates)

- **gofmt** / `gofumpt` — formatting is non-negotiable.
- **golangci-lint** with a shared config; **`go vet`** clean.
- **`go test ./...`**; **`govulncheck`** in CI for dependency CVEs.
- Pin via `go.mod`/`go.sum`; commit both.

## Conventions

- Wrap errors with context (`fmt.Errorf("...: %w", err)`); never discard with `_` unless
  intentional and commented. Check every returned error.
- Accept interfaces, return structs. Keep packages small and cohesive.
- Use `context.Context` for cancellation/timeouts on all I/O and request paths.
- Config via a typed struct loaded once at startup (env/flags), validated, fail-fast.
- Concurrency: guard shared state; prefer channels/`sync` correctly; run `-race` in CI.
- No secrets in code; read from env/secret store.

## Layout

- Standard Go layout: `cmd/`, `internal/` (private), `pkg/` (exported). Tests beside code (`_test.go`).
