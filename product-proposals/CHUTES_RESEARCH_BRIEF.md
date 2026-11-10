# Chutes: independent audit and what AIPG should take from it

Research date: 2026-11-09. Revision 2. Status: research and recommendations,
not an adopted architecture. Nothing here authorizes production restarts,
spending, payout or reward changes, or new evidence authority.

Revision 1 studied the trust code in seven Chutes repositories. This revision
re-checked every source claim in it, audited the roughly forty public
repositories it did not open, measured Chutes' traction from its own public
endpoints, and mapped each proposal against what AIPG already has on
`origin/main`. Corrections to revision 1 are listed in
[What changed](#what-changed-from-revision-1).

## Bottom line

1. **Chutes' demand was bought, and most of it left when the subsidy stopped.**
   Token volume peaked at 159.5B/day (2025-06-20), held near 105B/day while
   inference was free, and is about 18B/day now. Requests fell from 24.6M/day
   to 1.2M/day. Metered usage is about $5–7k/day. Chutes ended its free tier in
   March 2026 and no longer sells subscriptions.
2. **Its trust story rests on Intel TDX attestation, not on "LLM
   verification".** The network is now TEE-only. The per-token check is a keyed
   MAC over response text computed by a closed binary, and the coordinator does
   not enforce it for TEE workloads. No public client verifies an attestation
   quote before encrypting to a worker.
3. **The distribution tactic that visibly works is being a built-in provider in
   other people's agents** (Kilo, Roo, Cline, OpenClaw, SillyTavern), followed
   by hosted protocol shims with one-line installers for Claude Code and Codex.
   Their own forks, routers, n8n node and OAuth kit show little or no uptake.
4. **AIPG has already built most of what revision 1 proposed.** The evidence
   classes, the adversarial fidelity lab, demand-aware onboarding and signed
   media profiles exist. Most of it is switched off or has no authority. The
   real gaps are a pinned text runtime, a fidelity method that works, x402 on
   mainnet, and accepted upstream integrations.
5. **Trust is not what AIPG is short of.** AIPG served about 600 jobs in the
   last month against Chutes' 1.2M requests a day. Chutes' own history shows
   that verification did not create its demand; free inference and
   distribution did.
6. **AIPG's text worker signs results in a format Core does not check**, so
   text ledger rows are recorded unsigned. The media worker is correct. See [AIPG findings](#aipg-findings-from-this-audit).

## What changed from revision 1

| Revision 1 said | Finding |
| --- | --- |
| Producing a TDX quote is different from verifying it (implying verification was not shown) | Too harsh. The archived coordinator verifies quotes in public code: nonce, certificate hash, DCAP signature, and an MRTD/RTMR allowlist, failing closed. [`api/server/util.py`](https://github.com/chutesai/chutes-api/blob/3b5609f42f84e29dea374382ef1fa95b0fda329c/api/server/util.py#L681) |
| Streaming verification checks the first few chunks plus 1% | Correct but too generous. A failed check only raises `if not chute.tee`; for TEE workloads it logs and continues. [`api/chute/util.py`](https://github.com/chutesai/chutes-api/blob/3b5609f42f84e29dea374382ef1fa95b0fda329c/api/chute/util.py#L1036) |
| GraVal GPU challenges are part of the design | Retired. The miner README states the network is "TEE-exclusive" and that GraVal "is no longer supported". [`README.md`](https://github.com/chutesai/chutes-miner/blob/44c6603ced87c5108359a30fa1e1e6c12f864557/README.md#L7) |
| The cache verifier can skip on proxy failure | Confirmed, and the caller also discards the result and swallows `not_found`. Same in the vLLM template. |
| Reward docs and source disagree | Confirmed in source (one day, lifetime × compute multiplier). The miner README gives a third version ("7 day sum of compute"). |
| An adversarial comparison lab is a possibility to explore | AIPG already ran one. See [AIPG status](#where-aipg-already-stands). |
| No mention of traction, pricing or distribution | Added below. This is the larger part of what AIPG can learn. |

All other revision 1 source claims were re-read at the pinned commits and
confirmed. None of the seven pinned repositories has new commits on its default
branch.

## Method and limits

- **Source review.** Static reading only. No Chutes code, installer or binary
  was executed (one historical `.so` was inspected with `strings`). Pinned
  commits are in [Sources](#sources).
- **Live data.** Unauthenticated GETs to Chutes' public endpoints and
  OpenRouter's public endpoints API on 2026-11-09. Aggregations are ours. The
  daily token, request and usage totals were recomputed independently from the
  raw responses.
- **Not done.** No account was created. No paid or authenticated call, quote
  verification against hardware, or attack was attempted.
- **Self-reported.** Chutes' stats endpoints are Chutes' own numbers.
  `/invocations/usage` may be list-price metering, not cash collected.
- **Archived coordinator.** `chutes-api` was archived on 2026-10-29 with 37
  unmerged remote branches. Its code is historical evidence. Where the
  coordinator now lives is not stated publicly; a private repository is our
  inference.
- **AIPG state.** Read from `origin/main` of each repository and dated deploy
  documents. Current production configuration was not inspected, except the
  public stats endpoints.

## Chutes as a business

### Traction

Daily averages by month, from
[`/invocations/stats/llm`](https://api.chutes.ai/invocations/stats/llm):

| Month | Tokens/day | Requests/day |
| --- | --- | --- |
| 2025-09 | 112.9B | 24.6M |
| 2026-01 | 107.8B | 15.4M |
| 2026-03 (free tier ends) | 67.1B | 8.7M |
| 2026-06 | 44.7B | 6.4M |
| 2026-09 | 29.6B | 2.7M |
| 2026-10 | 21.1B | 2.0M |
| 2026-11 (10 days) | 16.6B | 1.2M |

- **Metered usage:** $5.0k–7.3k/day over 2026-10-31 to 11-09
  ([`/invocations/usage`](https://api.chutes.ai/invocations/usage)), roughly
  $2.4M a year at list price.
- **Accounts:** 819,732 cumulative; 147k registered in April 2025 alone, about
  11–12k a month now ([`/users/growth`](https://api.chutes.ai/users/growth)).
- **OpenRouter:** about 3.5B tokens/day now, roughly 73rd of 97 providers, down
  from about 42B/day at the February 2026 peak (third-party estimates:
  [Vantage](https://routers.vantage.sh/data_quality),
  [ownyourmind](https://ownyourmind.pages.dev/tokenomics/chutes-bittensor-revenue-machine/)).
- **Supply:** 16 active miners; the top five hold 62.5% of compute
  ([`/miner/stats`](https://api.chutes.ai/miner/stats)). Qwen3.8-27B runs 64
  instances at about 3% utilization
  ([`/chutes/utilization`](https://api.chutes.ai/chutes/utilization)).

### Timeline

- **2024-12:** subnet registered and launched. About a year of free inference
  followed (200 requests/day, plus a sponsored free tier on OpenRouter).
- **2026-02-27:** free tier retired, fully ended 03-15. Subscriptions ($3, $10,
  $20) capped at five times their pay-as-you-go value. Chutes reported top
  accounts extracting 56–324 times their subscription price
  ([announcement](https://chutes.ai/news/community-announcement-february)).
- **2026-03-20:** Chutes cut about 20B tokens/day of free and loss-making
  traffic. It reported tokens down 45% and revenue down about 25%
  ([post](https://chutes.ai/news/from-volume-to-value-building-a-sustainable-ai-inference-platform-2)).
- **2026-05 to 06:** GPU inventory down about two-thirds since December, price
  rises, a model purge and the all-TEE migration
  ([TaoDaily](https://taodaily.io/jon-durbin-explains-chutes-next-phase-as-the-gpu-market-tightens/)).
- **2026-10-22:** repositioning as an "open AI lab" with decentralized training
  and "inference that doesn't use network emission"
  ([post](https://chutes.ai/news/democratizing-intelligence-building-an-open-source-ai-lab-on-a-decentralized-network)).
- **Today:** pay-as-you-go only, no free tier, no subscriptions
  ([pricing](https://chutes.ai/pricing)).

### Pricing

Chutes is no longer the price leader except on small models. Prices per 1M
tokens (input / output) from OpenRouter's public endpoints API, 2026-11-09:

| Model | Chutes | DeepInfra | AIPG list price |
| --- | --- | --- | --- |
| Qwen3.8-27B | $0.039 / $1.25 | $0.15 / $1.875 | not compared |
| Gemma-4-31B | $0.12 / $0.37 | $0.135 / $0.51 | not offered |
| DeepSeek V4 Flash | $0.44 / $1.32 | $0.06 / $0.18 | $0.07 / $0.14 |
| GLM-5.2 | $1.25 / $3.95 | $0.45 / $1.44 | not offered |
| Kimi K3 | $1.85 / $9.50 | $2.85 / $14.25 | not offered |

AIPG prices are from `grid-core` `grid_api/services/pricing.py` at `81305f89`
(gpt-oss-120b is $0.075 / $0.30). A list price is not availability: no
DeepSeek worker was online on AIPG when this was written.

In the archived coordinator, token prices derive from GPU cost: a per-million
multiplier × the GPU's hourly rate × GPU count
([`api/constants.py`](https://github.com/chutesai/chutes-api/blob/3b5609f42f84e29dea374382ef1fa95b0fda329c/api/constants.py#L139)).
Cached input tokens are discounted 90%.

### Catalog

- [`/v1/models`](https://llm.chutes.ai/v1/models) lists 19 models. Eleven are
  flagged `confidential_compute` (TEE) and carry prices. Eight are "Standard
  Models" with `execution_backend: external` and no price fields.
- 491 public chutes exist; 156 are disabled and only 20 have live instances.
- The [privacy policy](https://chutes.ai/privacy) (2026-11-01) says many
  Standard Models are served by third-party inference platforms that can access
  content and retain it "generally up to 30 days". Standard Models do not run
  in a TEE, and the [terms](https://chutes.ai/terms) bar sexually explicit
  content on them.
- The homepage still claims "Trillions of tokens per month". At 18B/day that
  is about 0.5T a month.

### Economics

- **Subsidy.** Bittensor emissions pay the miners. Pine Analytics estimated the
  subsidy at 22–40 times revenue in March 2026 and unsubsidized break-even at
  about $1.41 per 1M tokens (via ownyourmind). Our own rough estimate for
  today is about $44k/day to miners against about $6.5k/day of metered usage,
  roughly 7×. That estimate assumes 7,200 alpha/day with no burn and is
  unverified.
- **Emission share** fell from about 14.4% (March 2026) to 5.82% (2026-09-22),
  per the same secondary source.
- **Chutes' own account:** H200s were effectively $0.77/hour "through miner
  emissions". It has since raised prices and cut supply.
- **Reward multipliers in source:** TEE ×2.25, private instance ×2, integrated
  subnet ×3
  ([`api/constants.py`](https://github.com/chutesai/chutes-api/blob/3b5609f42f84e29dea374382ef1fa95b0fda329c/api/constants.py#L206)).
  Miners are paid for instance lifetime weighted by GPU class, not per request.
- **Penalties are eviction, not slashing.** A hard verification failure purges
  the instance; the blacklist-after-five rule is commented out.

### Customers

- **Roleplay** (SillyTavern, Janitor-style front ends). Probably the bulk of
  the free era; that is inference from community threads, not a measured split.
- **OpenRouter flow**, reported at 20–25% of volume in May 2026.
- **Coding and personal agents.** Almost every 2026 repository serves Claude
  Code, Codex, OpenClaw or Hermes. The pricing page's presets are "30-min
  roleplay", "Intense coding session" and "Powering Openclaw/Hermes Agent".
- **Enterprise:** a "Contact Sales" link and no named customers.

### Complaints

From archived r/SillyTavernAI threads (2026-03 and 2026-05): instability,
terms that change suddenly, staff conduct, and suspected censorship on one
model through OpenRouter. Users reported moving to NanoGPT or OpenRouter
pay-as-you-go. Live stats on 2026-11-09 showed GLM-5.2 averaging 24.5 seconds
to first token. There is no uptime guarantee, and flagship models run at
fp4/int4 quantization.

## How Chutes gets users

Ranked by evidence that the tactic works. Download figures were fetched on
2026-11-09.

| Tactic | Evidence | Verdict |
| --- | --- | --- |
| Built-in provider in other people's agents | Kilo merged 2025-10-06; SillyTavern 2025-11-30; Cline 2026-08-03; 36 Roo-Code PRs. The OpenClaw-maintained `@openclaw/chutes-provider` has 1,592 npm downloads/week, three times any Chutes-published package. | Working. Upstream maintainers now carry the maintenance. |
| Hosted protocol shims with one-line installers | [`claude-proxy`](https://github.com/chutesai/claude-proxy/tree/3686a107b4ecff1480bf34bde19e13636e485ea3) serves `claude.chutes.ai` and ships `install_claude_code.sh`; [`responses-proxy`](https://github.com/chutesai/responses-proxy/tree/5859e0c18546e37a6e1514ab1e94266fb9627143) does the same for Codex. | Probably working. Usage would not show on GitHub. |
| Pricing page with workload presets naming target agents | Live pricing page. | Plausible driver; not measurable from source. |
| Agent-readable surface (`llms.txt`, priced public `/v1/models`, skills, MCP) | [`chutes-agent-toolkit`](https://github.com/chutesai/chutes-agent-toolkit/tree/0586bc672ce70cd186eb590a83e50001222b5765), a fork of a community repository with 7 stars. | Cheap; impact unknown. |
| "Sign in with Chutes" OAuth, where the end user's balance pays | [`Sign-in-with-Chutes`](https://github.com/chutesai/Sign-in-with-Chutes/tree/b4d8b904a562aac024d415bd78f895410eccedf4): one day of commits, 1 star. Used by Chutes' own apps. | Negligible third-party uptake. |
| Vercel AI SDK provider | 475 npm downloads/week; no release in 11 months. | Modest. |
| Owning a forked coding agent | `chutescode` has 0 stars; its explainer records a benchmark retracted twice. | Not working. |
| n8n node and self-host bundles | `n8n-nodes-chutes`: 13 downloads/week. | Not working. |
| Standalone model routers | `chutes-autopilot` superseded by API aliases; `model-router` idle since June. | Abandoned. |

Upstream submissions also fail often. Hermes closed six first-class-provider
PRs unmerged, and prime-agent closed three on the day they were opened. A
third party later got Chutes into Hermes' plugin catalog.

For scale, the main `chutes` PyPI package has 1,253 downloads a week and the
flagship repository has 91 stars. Chutes' reach did not come from its own
repositories.

## Chutes' trust architecture

### What an outsider can verify

| Question | Answer from public code |
| --- | --- |
| Which model produced this output? | Not independently. The per-token value validates only with a Chutes-held X25519 key inside a closed library. |
| Could the host read my prompt? | Partly. The client encryption code is auditable and sound. The worker's public key comes from `api.chutes.ai` over HTTPS and is not checked against an attestation quote by any public client. |
| Is the hardware a genuine TDX machine running the approved image? | The coordinator verified this in public code (archived). Chutes documents third-party evidence endpoints. No public reference measurements were found, so an outsider cannot reproduce the allowlist. |

### Component findings

- **`cllmv` is a shim over a closed binary.** It loads
  `/usr/local/lib/chutes-aegis.so`, which is not in the repository. The miner
  side fails open: with the library missing it returns an empty token.
  [`base.py`](https://github.com/chutesai/cllmv/blob/e7c14d3e67028f2e89f65f6b68989a87668c6be7/src/cllmv/base.py#L10)
- **The token covers chunk id, timestamp and text.** Chutes' SGLang fork
  attaches it at the HTTP serialization layer. Logits, logprobs and weights are
  not inputs. It can show that a process holding the session key emitted the
  text; it cannot show which weights produced it (our inference from the call
  sites).
  [`serving_chat.py`](https://github.com/chutesai/sglang/blob/6f9fc27ffe6fb52313b9249d41039ca18135e936/python/sglang/srt/entrypoints/openai/serving_chat.py#L1032)
- **Enforcement is advisory on TEE workloads** (see What changed). With the
  network TEE-only, attestation carries the trust.
- **Coordinator attestation is real.** It checks the DCAP signature via
  `dcap_qvl`, matches full MRTD and all RTMRs against an allowlist, and gates
  release-candidate measurements by hotkey. Collateral comes from Phala's PCCS.
- **`sek8s`** binds quote report data to a caller nonce and the service
  certificate's public key hash, and pins container images to verified digests.
- **`tdx-measure`** computes expected MRTD and RTMR0–2 from firmware, kernel,
  initrd and command line. It has no quote parsing, no RTMR3 and no published
  Chutes reference values.
  [`main.rs`](https://github.com/chutesai/tdx-measure/blob/494f18deba4c8c85b626b3fb11b612c7721b156b/cli/src/main.rs#L261)
- **Client-side encryption** uses ML-KEM-768, HKDF-SHA256 and
  ChaCha20-Poly1305 with a fresh response key per request. The AEAD uses no
  associated data and stream chunks carry no sequence number. Usage events and
  routing headers are plaintext.
  [`crypto.py`](https://github.com/chutesai/chutes-e2ee-transport/blob/874061f0089b0024b0bd8e3baaeeebec215c1415/src/chutes_e2ee/crypto.py#L16)
- **`e2ee-proxy`** takes confidentiality flags and keys from HTTPS discovery,
  and its UUID-model branch returns before the confidentiality check.
- **Model-file checks.** Watchtower compares 100–500 random bytes of one weight
  shard with Hugging Face. The SGLang fork's cache verifier compares the local
  cache with the upstream manifest; by default it trusts the symlink name
  rather than re-hashing.
- **Prompt-template disclosure.** The SGLang fork returns `template_sha256` and
  `prompt_sha256` in responses. This is cheap and useful.
- **Opt-in research data.** A separate endpoint records full request and
  response bodies plus client IP, with retention defaulting to forever. Consent
  is architectural: only traffic sent to that endpoint is recorded.
  [`db.py`](https://github.com/chutesai/research-data-opt-in-proxy/blob/3c0f7f13446d84f523eabfb378885b0e8a8a9b5b/app/db.py#L16)
- **Accounting audit.** The auditor can replay reward weights from coordinator
  reports, but its check of report commitments against the chain is commented
  out, as is the exporter's commitment transaction.
- **The vLLM and llama.cpp forks** are one model-support commit each, with no
  verification or integrity changes.

### Operations visible in source

- **Miner requirements:** bare metal with static IPs (not Runpod or Vast), RAM
  at least equal to VRAM, TDX-capable hosts.
- **Autoscaling:** scale up at 50% utilization or 3% rate-limited requests,
  scale down below 20%.
- **Scheduler (Gepetto):** places by reward multiplier per dollar of GPU cost.
  It never preempts jobs, booting instances, instances active under 62
  minutes, or the last known instance of a model.
- **Custom deployments:** a deployment fee of three times the hourly estimate,
  and a $50 balance to build images. No creator revenue share was found.
- **Subscriptions in source:** 300 / 2,000 / 5,000 daily requests for $3 / $10
  / $20, with a monthly cap of five times the price.

### Licenses

`chutes-miner`, `graval`, `cllmv`, `e2ee-test`, `research-data-opt-in-proxy`
and `chutes-jumpmaster` have no tracked license file. `e2ee-test` bundles
commercial fonts. `graval` and `cllmv` depend on binaries without source. No
Chutes code has been copied into AIPG. Reuse of any component would need its
own provenance check; `claude-proxy`'s license was not checked.

## Where AIPG already stands

Read from `origin/main` on 2026-11-09. "Live" statements come from dated
deploy documents, the latest from mid-October.

| Revision 1 idea | What exists | State | Real gap |
| --- | --- | --- | --- |
| Managed text runtime | Media only: signed profiles with pinned revision and per-file SHA-256 (`grid-media-worker` `bridge/profiles/`, `grid-core` `docs/architecture/WORKER_PROFILE_V1.md`). | Draft. 0 of 3 hardware classes accepted; `AUDIO_ENABLED=0`. `model_registry.py` is marked "UNWIRED / SHIP-DARK". | No text profile. The text model name is whatever the worker claims. |
| Explicit validator responsibilities | Scorecards already separate availability, protocol, capability, quality and fidelity (`grid-core` `services/validators.py`, `validator-node`). | 3-of-5 quorum text evidence is live. It has no authority over routing, rewards or penalties. Text fidelity, media fidelity, pairing and compensated audits are off. | No fidelity method is calibrated well enough to earn authority. |
| Adversarial comparison lab | Seven dated experiments in `validator-node`, plus `VALIDATOR_ANTI_GAMING.md` and hostile-path tests in `grid-core`. | Research and CI only. | A consolidated limits report, and tests on independent hardware. |
| Independent settlement checking | Hourly custodial payouts with transfer-log proof; hourly SHA-256 plan commitments; public `/v1/payouts/public`. | Payouts live in source. The Merkle claim path is a stub. | A third party can see that transfers happened but cannot recompute allocations. |
| Demand-aware onboarding | `aipg-website` `/run` planner and evidence panels; `/v1/workers/self` and its canary. | Live. | Hardware and download requirements exist only for media profiles. |
| Narrow dependable offering | AI SDK, ElizaOS and n8n packages on npm; `/v1/messages` and `/v1/responses`; OAuth 2.1 for MCP clients; x402 route. | x402 is off by default; its October mainnet attempt failed settlement and only Sepolia is proven. Upstream PRs to LiteLLM, Dify, Vercel, ElizaOS and LangChain were open as of 2026-08-30. | x402 on mainnet, accepted upstream integrations, any SillyTavern presence. |
| Confidential compute | `content/confidential-computing.mdx` says "Research and roadmap only". No E2EE code. | Documentation only. | Everything. Public copy correctly says community workers can read prompts. |

The fidelity lab's measured results matter for what follows. The
answer-logprob study flagged 0 of 88 held-out answers from a substituted 20B
model. Fabricated logprobs scored 100/100 healthy, and probe-aware routing
passed 100/100. AIPG has published evidence that statistical model
identification does not currently work. Chutes reached the same place and
moved its trust to hardware attestation.

### AIPG findings from this audit

- **Text result signatures do not verify.** `grid-inference-worker` sends a
  `receipt` signed over `aipg-receipt:v1:{job}:{sha256(text)}`
  (`inference_worker/ws_client.py:197-216, 937`). `grid-core` reads a
  `worker_sig` field signed over `aipg-job:{job}:{result_hash}`
  (`grid_api/services/signing.py:34`, `routers/worker_ws.py:1146`), where the
  hash also covers reasoning and tool calls. Verification fails closed to
  "stored unsigned", so nothing breaks, but no text ledger row can carry a
  valid worker signature. The media worker already signs in Core's format
  (`bridge/ws_worker.py:780`). Confirmed in source; production rows were not
  queried. A worker-side fix is in review as grid-text-worker PR #51. Any
  public "signed receipts" claim for text should wait for a release that
  includes it.
- **Live scale on 2026-11-09:** six models online with one worker each; about
  600 jobs in the last month; nine workers ever paid; last payout 2026-09-10
  (`/v1/status/models`, `/v1/stats/models`, `/v1/payouts/public`).

## What to take from this

### Lessons

1. **Free inference buys volume, not customers.** Chutes spent a year of
   emissions on roughly 100B tokens a day and kept about a sixth of it. AIPG
   cannot fund that and should not want to.
2. **Other people's clients are the channel.** The integrations that moved
   Chutes' numbers live in upstream repositories, not in Chutes' own.
3. **Statistical verification is a dead end for now; hardware attestation is
   the working answer, and it costs a fleet.** Two independent efforts point
   the same way.
4. **Honest scoping is a differentiator.** Chutes' marketing claims all-TEE
   privacy while eight of nineteen listed models run on third-party platforms
   outside a TEE. AIPG's plain statement that workers can read prompts is
   accurate, and can be a selling point if a confidential tier ever exists.
5. **Chutes' weaknesses are operational and reputational:** unstable terms,
   capacity, slow first tokens, removed plans. A small provider can compete on
   those without matching its scale.

### Options, ranked by expected effect on demand per unit of effort

1. **Get into the agents people already use.** Submit provider integrations to
   Kilo, Roo-Code, Cline, OpenClaw and SillyTavern, with plugin catalogs as the
   fallback when a first-class PR is refused. Expect refusals. AIPG has no
   SillyTavern presence and its existing upstream PRs were still open in
   August.
2. **Ship a one-line Claude Code and Codex setup.** AIPG already serves
   `/v1/messages` and `/v1/responses`. What is missing is the installer script
   and a default model that works well with those clients.
3. **Finish x402 on mainnet.** Chutes has no official agent-payment support.
   This is the one capability where AIPG could be first, and it is one failed
   settlement away. It also replaces "sign in with" as the way an end user pays
   without an account.
4. **Publish an agent-readable surface:** `llms.txt`, prices in the public
   `/v1/models` response, and a skills or plugin repository. A day or two of
   work.
5. **Serve the people Chutes pushed out, on purpose.** A small catalog of
   mid-size models (27–31B class) that stays up, with terms that do not change
   and a clear content policy. This needs supply that stays online, which
   means restarting payouts first.
6. **Fix the receipt signature mismatch** before describing AIPG as having
   signed receipts.
7. **Write up the fidelity lab as a public limits report.** The work is done
   and the negative result is credible. It positions AIPG as the provider that
   says what it cannot prove.
8. **Adopt three cheap trust ideas:** return prompt-template and prompt hashes
   in responses; check weight files against the upstream manifest at load in a
   managed text profile; keep any research-data recording on a separate opt-in
   endpoint.

### Not justified by this audit

- A TEE fleet or client-side encryption. Encryption to a worker key that the
  client cannot attest adds little, and attestation needs TDX hosts AIPG's
  operators do not have.
- A per-token verification scheme. Chutes' own coordinator does not enforce
  its version where it matters.
- Capacity-based rewards, a Kubernetes miner stack, or a custom inference
  engine fork.
- An OAuth identity provider with user balances. Chutes' has no visible
  third-party uptake, and x402 covers the same need.
- More validator authority. No current fidelity method supports it.

## Could not verify

- Whether `/invocations/usage` equals cash revenue.
- Chutes' current emission share, miner payouts in dollars, and 2026 buybacks.
- The split of Chutes' customers by segment.
- Who serves the Standard Models.
- Which legal entity operates the service. The terms name a Delaware
  corporation; the subnet identity on taostats names a Nevis company.
- Funding, headcount, and when subscriptions were discontinued.
- The contents of `chutes-aegis.so`, the validator's key handling, and the 37
  unmerged `chutes-api` branches.
- Current AIPG production configuration and ledger rows.

## Sources

### Pinned repositories

| Repository | Commit | Focus |
| --- | --- | --- |
| [chutes](https://github.com/chutesai/chutes/tree/08d79872854a664de16b32b14cd0bf947e427517) | `08d79872854a664de16b32b14cd0bf947e427517` | Runtime SDK and inference templates |
| [chutes-miner](https://github.com/chutesai/chutes-miner/tree/44c6603ced87c5108359a30fa1e1e6c12f864557) | `44c6603ced87c5108359a30fa1e1e6c12f864557` | Scheduling and miner operations |
| [chutes-api](https://github.com/chutesai/chutes-api/tree/3b5609f42f84e29dea374382ef1fa95b0fda329c) (archived) | `3b5609f42f84e29dea374382ef1fa95b0fda329c` | Coordinator, attestation, pricing, accounting |
| [sek8s](https://github.com/chutesai/sek8s/tree/3a74f23934c6356444a466c0ec02b4c8ad2bc3dd) | `3a74f23934c6356444a466c0ec02b4c8ad2bc3dd` | Confidential VM services and image admission |
| [graval](https://github.com/chutesai/graval/tree/23babae0c429c2db2a94afc3c8d657f868b35d6e) | `23babae0c429c2db2a94afc3c8d657f868b35d6e` | Retired GPU challenge wrappers |
| [e2ee-proxy](https://github.com/chutesai/e2ee-proxy/tree/e213a090cb82be3b4556ce0f2fbd912406001477) | `e213a090cb82be3b4556ce0f2fbd912406001477` | Local encrypted inference proxy |
| [chutes-audit](https://github.com/chutesai/chutes-audit/tree/349891772da46f5e90702818033bfc07ff43440c) | `349891772da46f5e90702818033bfc07ff43440c` | Accounting replay |
| [cllmv](https://github.com/chutesai/cllmv/tree/e7c14d3e67028f2e89f65f6b68989a87668c6be7) | `e7c14d3e67028f2e89f65f6b68989a87668c6be7` | Per-token verification shim |
| [tdx-measure](https://github.com/chutesai/tdx-measure/tree/494f18deba4c8c85b626b3fb11b612c7721b156b) | `494f18deba4c8c85b626b3fb11b612c7721b156b` | Expected TDX measurements |
| [chutes-e2ee-transport](https://github.com/chutesai/chutes-e2ee-transport/tree/874061f0089b0024b0bd8e3baaeeebec215c1415) | `874061f0089b0024b0bd8e3baaeeebec215c1415` | Client encryption library |
| [e2ee-test](https://github.com/chutesai/e2ee-test/tree/0e3543180543c0c22637efb47a243d169ff0ab24) | `0e3543180543c0c22637efb47a243d169ff0ab24` | Browser encryption client |
| [research-data-opt-in-proxy](https://github.com/chutesai/research-data-opt-in-proxy/tree/3c0f7f13446d84f523eabfb378885b0e8a8a9b5b) | `3c0f7f13446d84f523eabfb378885b0e8a8a9b5b` | Opt-in data recording |
| [sglang](https://github.com/chutesai/sglang/tree/6f9fc27ffe6fb52313b9249d41039ca18135e936) (branch `chutes`) | `6f9fc27ffe6fb52313b9249d41039ca18135e936` | Engine fork with token hook and cache verifier |
| [claude-proxy](https://github.com/chutesai/claude-proxy/tree/3686a107b4ecff1480bf34bde19e13636e485ea3) | `3686a107b4ecff1480bf34bde19e13636e485ea3` | Anthropic-shape shim and installer |
| [responses-proxy](https://github.com/chutesai/responses-proxy/tree/5859e0c18546e37a6e1514ab1e94266fb9627143) | `5859e0c18546e37a6e1514ab1e94266fb9627143` | Responses-shape shim and installer |
| [chutes-agent-toolkit](https://github.com/chutesai/chutes-agent-toolkit/tree/0586bc672ce70cd186eb590a83e50001222b5765) | `0586bc672ce70cd186eb590a83e50001222b5765` | Agent skills, configs and MCP |
| [Sign-in-with-Chutes](https://github.com/chutesai/Sign-in-with-Chutes/tree/b4d8b904a562aac024d415bd78f895410eccedf4) | `b4d8b904a562aac024d415bd78f895410eccedf4` | OAuth kit |
| [chutescode](https://github.com/chutesai/chutescode/tree/e60906703c1840826ec6bce9231ae940c8b7e992) | `e60906703c1840826ec6bce9231ae940c8b7e992` | Forked coding agent |

Also read: `bittencert`, `fiber`, `antseed-verification`, `chutes-jumpmaster`,
`model-router`, `chutes-autopilot`, `ai-sdk-provider-chutes`,
`n8n-nodes-chutes`, `chutes-search`, `chutes-dropzone`, `chutes-docs`,
`squad-api`, and the `codex`, `openclaw`, `moltbot`, `hermes-agent`,
`prime-agent`, `vllm` and `llama.cpp` forks. These repositories are separate
revisions, not a demonstrated compatible release.

### Live endpoints (fetched 2026-11-09)

- <https://api.chutes.ai/invocations/stats/llm>
- <https://api.chutes.ai/invocations/usage>
- <https://api.chutes.ai/users/growth>
- <https://api.chutes.ai/miner/stats>
- <https://api.chutes.ai/chutes/utilization>
- <https://llm.chutes.ai/v1/models>
- <https://openrouter.ai/api/v1/models/qwen/qwen3.8-27b/endpoints> and the same
  path for the other four models in the pricing table
- <https://api.aipowergrid.io/v1/status/models>,
  <https://api.aipowergrid.io/v1/stats/models?period=month>,
  <https://api.aipowergrid.io/v1/payouts/public>

### Chutes pages

- <https://chutes.ai/pricing>, <https://chutes.ai/privacy>,
  <https://chutes.ai/terms>
- <https://chutes.ai/docs/core-concepts/security-architecture>
- <https://chutes.ai/docs/miner-resources/scoring>
- <https://chutes.ai/news/community-announcement-february>
- <https://chutes.ai/news/from-volume-to-value-building-a-sustainable-ai-inference-platform-2>
- <https://chutes.ai/news/democratizing-intelligence-building-an-open-source-ai-lab-on-a-decentralized-network>

### Secondary sources

- <https://ownyourmind.pages.dev/tokenomics/chutes-bittensor-revenue-machine/>
- <https://routers.vantage.sh/data_quality>
- <https://taostats.io/subnets/64>
- <https://taodaily.io/jon-durbin-explains-chutes-next-phase-as-the-gpu-market-tightens/>
- <https://reddit.sentinel-team.org/posts/1t9fz5c/snapshots/2026-05-16T00%3A35%3A41.464211Z>
- <https://reddit.sentinel-team.org/posts/1rhy5ks/snapshots/2026-03-02T19%3A46%3A37.091087Z>

### AIPG repositories read

`grid-core` `81305f89`, `grid-inference-worker` `e31287cc`,
`grid-media-worker` `ea8e7c73`, `validator-node` `fbb48c52` (branch `master`),
`aipg-website` `14211e00`, `aipg-documentation` `a0b49c69`,
`grid-provider-integrations` `8f3d2e56`.
