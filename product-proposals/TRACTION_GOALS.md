# Traction goals tracker

Started 2026-11-09. Decision checkpoint: **2026-12-09**. Internal and
unpublished. This is the single list of what we are doing to get outside,
paying usage, who owns each item, and where it stands. Update the status
column and the log whenever something changes; do not track this work anywhere
else.

Background and evidence: [CHUTES_RESEARCH_BRIEF.md](CHUTES_RESEARCH_BRIEF.md).
Nothing here authorizes production restarts, spending, payout changes or
mainnet transactions; those need the owner's explicit go-ahead each time.

## The test

By 2026-12-09: at least 10 outside accounts making paid calls. If not, plan
the wind-down (settle what workers are owed, tell token holders, open-source
the stack).

Positioning: cheap image and video generation plus open text models through
one API, payable per request with no account. Media leads, because competitors
such as Chutes barely offer it. Text supports.

## Goals

Status values: `todo`, `doing`, `blocked`, `review` (done, waiting on the
owner), `done`.

| # | Goal | Owner | Status | Done when |
| --- | --- | --- | --- | --- |
| 0 | Restart worker payouts (last payout 2026-09-10) | Justin | todo | A payout lands |
| 1 | Fix the text worker's result signature so Core accepts it | Claude | doing | Core verifies a real worker signature and stores it. Fix merged (grid-text-worker PR #51); still needs a worker release and one live job checked in the ledger |
| 2 | Stable catalog: two text, two image, one video model, two workers each | Justin (machines), Claude (config) | todo | 7 days with nothing offline |
| 3 | x402 pay-per-request on mainnet, then extended to images and video | Claude; Justin approves test spend | todo | An image and a clip are each paid for with no account |
| 4 | ComfyUI node and SillyTavern image support | Claude | todo | Both published |
| 5 | One-line Claude Code and Codex installer | Claude | todo | A fresh machine makes a paid call in under 2 minutes |
| 6 | Provider integrations upstream: SillyTavern, Kilo, Roo-Code, Cline, OpenClaw | Claude (code), Justin (accounts, follow-up) | todo | Two merged or in a plugin catalog |
| 7 | Demo film made on the Grid, with its cost shown | Justin directs, Claude runs tooling | todo | Posted publicly |
| 8 | OpenRouter and NanoGPT provider applications (text) | Justin; Claude drafts | todo | Both submitted |
| 9 | `llms.txt` and media prices in `/v1/models` | Claude | todo | Live |
| 10 | Decision checkpoint | Justin | todo | 2026-12-09: 10 outside paying accounts, or wind-down plan |

## Needed from Justin

- Goal 0: what is blocking payouts, and a go-ahead to resume.
- Goal 2: which machines can run second copies of which models.
- Goal 3: approval and a small budget for a mainnet x402 test.
- Goal 6 and 8: accounts for upstream PRs and the provider applications.
- A written content policy before the uncensored model is marketed.

## Backlog (not started, not scheduled)

Demand:

- Market the uncensored text model to roleplay users (needs content policy).
- Media examples up front in the Discord bots and the n8n node.
- List the x402 endpoint in agent-payment directories once it settles on mainnet.
- Pricing page with workload presets ("100 images", "a 30-second clip").

Trust and correctness:

- Public fidelity limits report from the existing validator experiments.
- Return prompt-template and prompt hashes in responses.
- Managed text profile that checks weight files against the upstream manifest.
- Klein recipes: standardise on the FP8 weights registered on chain.
- ModelVault as the on-chain authority for image and video models: Core sync
  in watch-only mode first, chain cleanup, then enforce.
- Governed RecipeVault upgrade; the live one is open to anyone.

Operators:

- Media worker setup wizard (generalise the audio manager flow).
- Windows auto-start for the media worker.
- Console sign-in limited to one connection per worker.
- Payout wallet set for the account behind the 2× RTX 6000 worker.

Housekeeping:

- `grid-audit-findings.md`: tick off the findings already fixed.
- Workspace `AGENTS.md`: duplicate `grid-provider-integrations` entries.
- Publish or commit the Chutes brief (currently uncommitted on
  `docs/chutes-research-brief`).

Decided against for now: a TEE fleet, per-token verification, an OAuth
identity provider with balances, more validator authority, new side apps.

## Log

- 2026-11-09: Tracker created. Chutes audit finished and brief rewritten
  (uncommitted). Goal 1 started.
- 2026-11-09: Goal 1 fix opened as grid-text-worker PR #51. Only the text
  worker was wrong; the media worker already signs in Core's format. No Core
  change needed. Signatures from the fixed worker code were accepted by Core's
  real verifier in a local cross-check.
- 2026-11-09: Justin approved Claude to proceed on all goals. PR #51 merged.
  Brief and tracker committed and opened for review.
