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
| 0 | Make worker payouts work again (last payout 2026-09-10) | Claude (fix), Justin (decisions) | doing | The hourly job runs clean for 48 hours and an outside operator receives a payout. Crash fixed 2026-11-10; payouts are still near zero until customers pay or a subsidy pool exists |
| 1 | Fix the text worker's result signature so Core accepts it | Claude | doing | Core verifies a real worker signature and stores it. v0.3.13 published and running on Titan; Core now recovers the worker's signer, but rejects it because advanced-key workers have no signer bound to the account. Needs a Console-enrolled worker to prove, and a way to bind a signer for multi-connection workers |
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

- Goal 0: nothing right now. Uptime pool deferred until there is paying demand.
- Goal 2: which machines can run second copies of which models.
- Goal 3: approval and a small budget for a mainnet x402 test.
- Goal 6 and 8: accounts for upstream PRs and the provider applications.
- Review `CONTENT_POLICY_DRAFT.md`, answer its open questions, and have a
  lawyer read it before the uncensored model is marketed.

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
- 2026-11-09: Payout cause found by read-only inspection of production
  (release `grid-core-0d2ee0b7`). Two layers. (1) `aipg-payout.service` has
  failed every hour since 2026-09-14T02:00Z with "payout window lacks a
  reviewed demand reward policy": `WORKER_REWARD_DEMAND_POLICIES` holds one
  window (09-13T02:00Z to 09-14T02:00Z) and nothing was appended. (2) From
  09-10T18:00Z until then the job ran and sent 0, because only work bought
  with purchased credits earns since the 09-09 paid-only cutoff. Nothing was
  changed on production.
- 2026-11-09: Justin: supply for goal 2 is this Mac (M3 Max, 128 GB RAM, 27 GB
  disk free) and Titan (2x RTX PRO 6000). GitHub account `halfaipg` is correct
  for upstream PRs. Funded wallet for goal 3 to follow. Content policy: adults
  only, legal content allowed, with a disclaimer; Claude to draft.
- 2026-11-10: Payout sender restored. Fourteen reward-policy windows appended
  on production through 2026-12-15T05:00Z (held period at $0.002 per AIPG, new
  windows at $0.0012, near the $0.001189 spot). The 04:00Z scheduled run
  completed cleanly, the first since 09-14. No transfer sent. Record:
  grid-core PR #241. **Extend the windows before 2026-12-15 or payouts stop
  again.** Still open: catch-up for held hours, monitoring for the payout
  unit, and the uptime pool decision.
- 2026-11-10: Mistake: the record PR was first opened against the upstream
  Haidra-Org/AI-Horde repository (#588) because `gh` defaults to the fork
  parent. Closed within a minute. It showed only content that is already
  public in our fork.
- 2026-11-10: Worker v0.3.13 staged (grid-text-worker PR #52). Content policy
  drafted in `CONTENT_POLICY_DRAFT.md` (not published).
- 2026-11-10: Backlog paid with Justin's approval: 57 transfers, 1,335.63 AIPG
  over 40 held hours (99% to `0xa218db26…`). Public totals now 1,786 payouts /
  102,181.83 AIPG / 11 workers paid. The earlier 178 AIPG estimate was wrong.
  Uptime pool: Justin agreed to wait.
- 2026-11-10: Worker v0.3.13 published at Justin's direction and installed on
  Titan. Four test chats (25 cents of operator test credit granted to the local
  key's account) reached both Titan workers. Core logged the same recovered
  signer for all four, so the hash and message now match. They were still
  stored unsigned: neither Titan worker has a signer registered (advanced key,
  no delegation), so Core only accepts the payout wallet. Before the update,
  0 of 126,842 text rows had a verified signature.
- 2026-11-10: Titan runs two Qwen Flash Next workers; first model with two.
