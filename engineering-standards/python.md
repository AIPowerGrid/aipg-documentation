# Python Standards

Used by: system-core, comfy-bridge, grid-inference-worker, aipg-sdk-python, validator-node, etc.

## Toolchain (CI + pre-commit gates)

- **ruff** — lint *and* format (replaces black/isort/flake8). `ruff check` + `ruff format --check`.
- **mypy** (or pyright) in strict mode on first-party code. New code is fully typed.
- **pytest** for tests; `pytest-asyncio` for async services.
- Target Python 3.12 unless a repo states otherwise. Use a `.venv`; pin deps.

## Conventions

- Config via **pydantic-settings** (typed, validated, fail-fast) — not scattered `os.getenv`.
- Type hints on all public functions; prefer dataclasses/pydantic models over loose dicts.
- No bare `except:`. Catch specific exceptions; log with context.
- Module-scoped `logging.getLogger(__name__)`; structured key/value logs.
- `async def` for I/O-bound service code; never block the event loop.
- Public packages expose a clean `__init__`; keep internal modules private.

## Layout

- `pyproject.toml` is the single project config (deps, ruff, mypy, pytest).
- Tests beside the code they cover (`services/tests/`, `module/tests/`) or a top-level `tests/`.
