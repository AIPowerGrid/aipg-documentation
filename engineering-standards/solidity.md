# Solidity / Smart-Contract Standards

Used by: aipg-smart-contracts (EIP-2535 Diamond on Base — RecipeVault, ModelVault,
WorkerRegistry, RewardPool/DenReporter/PaymentRouter facets).

This is value-handling code. The bar is higher than anywhere else in the org.

## Toolchain (CI gates)

- **forge fmt --check** — formatting.
- **forge test** — full suite; **gas snapshots** tracked.
- **slither** (static analysis) clean or every finding triaged with justification.
- Solidity version pinned in `foundry.toml`; warnings treated as errors.

## Testing & coverage

- **High coverage on all value-handling and access-control paths** — no untested branch that
  moves funds, mints, sets roles, or upgrades facets.
- Test the adversarial cases: reentrancy, overflow/underflow edges, access-control bypass,
  replay, and upgrade/storage-collision scenarios.
- Known-vector tests for Merkle/settlement formats (must match the off-chain builder).

## Conventions

- **Checks-Effects-Interactions**; reentrancy guards on external-call paths.
- Explicit access control (roles); least privilege; events on every state change.
- Diamond (EIP-2535): no storage-slot collisions across facets; document each facet's storage.
- Custom errors over string reverts; validate all inputs.

## Deployment (hard rules)

- **Nothing deployed unaudited.** No undocumented/untracked facets on-chain — every deployed
  facet's source lives in this repo and is reviewed.
- Deploys and `diamondCut` upgrades gated behind **multisig / Ledger**; never an EOA hot key.
- Record every deployment (address, facet, commit, tx) in the repo. Reconcile on-chain state
  vs repo before and after.
- Pre-money changes pass the pre-cut hardening review before mainnet value flows.
