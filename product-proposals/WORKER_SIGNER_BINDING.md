# Signed results for workers with parallel connections

Status: proposal, 2026-11-10. Not built. Nothing here is live.

## Problem

Grid Core stores a worker's result signature only when the signing key is
bound to the worker's account. The only binding today is the Console
approval, which produces a wallet-signed delegation for one exact worker
name, and so for one connection.

Any worker that needs more than one connection (several parallel slots, or
several models) has to use an ordinary account API key instead. Those workers
register with no signer at all, so every job they serve is stored unsigned,
even when the worker signs correctly.

Measured on production on 2026-11-10:

- Before worker v0.3.13, 0 of 126,842 text jobs had a verified signature.
- After v0.3.13, Core recovers a consistent signer from Titan's jobs, then
  rejects it as "not in allowed set", because neither Titan worker has a
  registered signer.
- One recently seen worker in the whole network has a delegation.

This is the same limit operators hit in setup: Console approval is the secure
path, and it cannot be used by anyone with more than one slot.

## Option A: one approval covers a named set of connections (recommended)

Extend the delegation the wallet signs in the Console so it names a base
worker name and a maximum number of connections. Core accepts a registration
whose connection name is the base name or the base name plus a numbered
suffix within that limit. Everything else in the proof stays as it is.

- **Trust:** unchanged. The payout wallet still signs the binding.
- **Operator effect:** an 8-slot machine can use the Console approval. The
  advanced-key path stops being necessary for parallel slots.
- **Work:** a new delegation version in Core (`worker_identity.py`, the
  enrollment API and key scoping), the Console approval screen in
  `grid-frontend`, and enrollment and setup in both workers. Multi-model
  rosters need the set to cover several base names or one approval per model.
- **Risk:** this is the worker authentication path. It needs the same review
  and staged rollout as the original enrollment work.

## Option B: bind a signer to the API key

Let a worker using an account API key send a registration proof signed by its
local key, with no wallet delegation. Core records that signer for the account
and worker name on first use and accepts result signatures from it.

- **Trust:** weaker. Anyone holding the API key can register a signer. A third
  party checking a signature has only Core's word for whose key it is.
- **Work:** Core registration plus a small worker change.
- **Use:** attribution and later dispute evidence inside the Grid. It is not a
  basis for public "verifiable receipts" claims.

## Recommendation

Build Option A, but not during the 30-day traction test. It improves operator
setup and makes signed results the norm, and neither brings a paying user.
Until then, describe signed results accurately: available to Console-approved
single-connection workers on v0.3.13 or later.

## Related gap

Jobs sent in Anthropic Messages or OpenAI Responses format are relayed as raw
passthrough and are not signed by any worker version.
