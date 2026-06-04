# AIPG Decentralized API (DAPI) Research

**Date:** April 2026
**Status:** Research Complete
**Recommendation:** libp2p with py-libp2p for Python workers

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture](#current-architecture)
3. [Why Decentralize](#why-decentralize)
4. [Options Evaluated](#options-evaluated)
5. [Deep Dive: libp2p](#deep-dive-libp2p)
6. [Proposed DAPI Architecture](#proposed-dapi-architecture)
7. [Protocol Specification](#protocol-specification)
8. [Implementation Plan](#implementation-plan)
9. [Risks and Mitigations](#risks-and-mitigations)
10. [Appendix: Code Examples](#appendix-code-examples)

---

## Executive Summary

This document evaluates options for decentralizing the AI Power Grid API so the network can operate without any single operator. After evaluating Waku, Hyperswarm, libp2p, NATS, and Nostr, **libp2p is the recommended choice** due to:

- Production Python bindings (py-libp2p v0.6.0)
- Gossipsub for job broadcast
- Kademlia DHT for peer discovery
- Battle-tested in IPFS, Filecoin, Ethereum
- Multiple implementations (Go, Rust, Python, JS)

**Key insight:** Your workers are Python. Hyperswarm has no Python bindings. libp2p does.

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│  curl api.aipowergrid.io/v1/chat/completions                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CENTRAL API SERVER                            │
│  FastAPI (system-core/grid_api)                                 │
│  ├── POST /v1/chat/completions (OpenAI compatible)              │
│  ├── POST /v1/messages (Anthropic compatible)                   │
│  ├── WS /v1/workers/ws (worker connections)                     │
│  └── Redis Streams (job queue)                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       WORKERS                                    │
│  grid-inference-worker (Python)                                 │
│  comfy-bridge (Python)                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Single Points of Failure

| Component | Risk |
|-----------|------|
| api.aipowergrid.io | Domain seizure, DDoS, operator disappears |
| Redis | Data loss, no federation |
| Central server | Single geographic location |
| TLS certs | Renewal failure, CA issues |

---

## Why Decentralize

### Goal: Network survives without any single operator

| Requirement | Current | DAPI |
|-------------|---------|------|
| Works if operator disappears | No | Yes |
| No DNS dependency | No | Yes |
| No central database | No | Yes |
| Anyone can run a gateway | No | Yes |
| Censorship resistant | No | Yes |

### Non-Goals

- Browser-native P2P (users still use HTTP)
- Eliminating all servers (gateways still exist)
- Anonymity (workers are staked, identifiable)

---

## Options Evaluated

### Summary Matrix

| Protocol | Type | Python Support | NAT Traversal | Throughput | Ecosystem | Verdict |
|----------|------|----------------|---------------|------------|-----------|---------|
| **Waku** | Relay mesh | No | N/A (relays) | Low (1 msg/s RLN) | Small | ❌ Wrong fit |
| **Hyperswarm** | DHT + P2P | No bindings | Excellent | High | Small | ❌ No Python |
| **libp2p** | Modular P2P | Yes (py-libp2p) | Good | High | Large | ✅ **Winner** |
| **NATS** | Federated | Yes | N/A (servers) | Very high | Medium | ⚠️ Not true P2P |
| **Nostr** | Relay-based | Yes | N/A (relays) | Medium | Growing | ⚠️ Relay dependent |

---

### Waku (Rejected)

**What it is:** Privacy-focused messaging protocol from the Logos/Status ecosystem.

**Why we evaluated it:** Designed for decentralized communication, light clients, store-and-forward.

**Why rejected:**

1. **Rate Limited (RLN):** 1 message/second per publisher. At 70 jobs/sec peak, we'd need 70+ identities.
2. **Wrong use case:** Designed for chat apps, not job queues.
3. **No Python SDK:** Would need to call REST API to local nwaku node.
4. **Becoming Logos:** Merging into Logos project, uncertain future.

**Scalability data (from Waku docs):**
- 10 KB/s bandwidth per node (1KB messages, 1 msg/s)
- 0.4s propagation to 2000 nodes
- ~80k users across 8 shards

**Source:** [Waku Performance Benchmarks](https://docs.waku.org/research/benchmarks/test-results-summary)

---

### Hyperswarm (Rejected)

**What it is:** DHT-based P2P networking from Holepunch (Keet, Pear).

**Why we evaluated it:** Excellent NAT traversal, simple API, used in production (Keet video calls).

**Code examined:**
```
/hyperswarm
├── index.js (688 lines) - Main swarm logic
├── lib/
│   ├── peer-discovery.js - DHT topic discovery
│   ├── peer-info.js - Peer state management
│   └── holepuncher.js - NAT traversal
└── hyperdht/ (dependency)
    ├── lib/holepuncher.js - Birthday attack for symmetric NAT
    └── lib/constants.js - Bootstrap nodes
```

**Why rejected:**

1. **JavaScript only:** No production Python bindings.
2. **hyperswarm-rs incomplete:** Rust port depends on unreleased crates.
3. **Small team:** Holepunch is ~10 people. If they disappear, ecosystem stagnates.
4. **Bootstrap dependency:** Default nodes are Holepunch's servers.

**NAT traversal quality:** Excellent. Uses birthday paradox attack (256 sockets) for symmetric NATs.

**Source:** [hyperswarm-rs README](https://github.com/datrs/hyperswarm-rs)

---

### NATS (Partially Viable)

**What it is:** High-performance messaging system with clustering.

**Why we evaluated it:** Extremely fast (millions msg/sec), queue groups solve claim problem automatically.

**Why not chosen:**

1. **Not true P2P:** Requires running NATS servers.
2. **Federated, not decentralized:** Could work if multiple parties run nodes, but trust required.

**Could be used for:** Phase 1 (federated) before full P2P.

---

### Nostr (Partially Viable)

**What it is:** Simple relay-based protocol for decentralized social.

**Why we evaluated it:** Very simple (JSON over WebSocket), growing ecosystem, built-in signatures.

**Why not chosen:**

1. **Relay dependent:** Not true P2P, relays are servers.
2. **Designed for social:** Would need custom event kinds for job queue.

**Could be used for:** Lightweight alternative if libp2p proves too complex.

---

### libp2p (Chosen)

**What it is:** Modular P2P networking stack from Protocol Labs.

**Why chosen:**

1. **Python bindings exist:** py-libp2p v0.6.0, actively maintained.
2. **Gossipsub:** Efficient pub/sub for job broadcast.
3. **Kademlia DHT:** Peer discovery without central servers.
4. **Battle-tested:** Powers IPFS, Filecoin, Ethereum consensus, Polkadot.
5. **Multiple implementations:** If one dies, others continue.

---

## Deep Dive: libp2p

### Implementations Comparison

| Implementation | Language | Version | Maintainer | Maturity |
|----------------|----------|---------|------------|----------|
| go-libp2p | Go | v0.48.0 (Mar 2026) | Protocol Labs | Production |
| rust-libp2p | Rust | v0.56.0 (Jun 2025) | Protocol Labs | Production |
| js-libp2p | JavaScript | v2.x | Protocol Labs | Production |
| py-libp2p | Python | v0.6.0 | Community | Maturing |

### py-libp2p Feature Status

Source: [py-libp2p README](https://github.com/libp2p/py-libp2p)

| Category | Feature | Status |
|----------|---------|--------|
| **Transport** | TCP | ✅ Done |
| | QUIC | ✅ Done |
| | WebSocket | ✅ Done |
| | WebRTC | 🌱 Prototype |
| **NAT Traversal** | Circuit Relay v2 | ✅ Done |
| | AutoNAT | ✅ Done |
| | Hole Punching | ✅ Done |
| **Security** | Noise | ✅ Done |
| | TLS | ✅ Done |
| **Discovery** | Bootstrap | ✅ Done |
| | mDNS | ✅ Done |
| | Rendezvous | ✅ Done |
| **Routing** | Kademlia DHT | ✅ Done |
| **Pub/Sub** | Floodsub | ✅ Done |
| | Gossipsub | ✅ Done |
| **Muxer** | Yamux | ✅ Done |
| | Mplex | ✅ Done |

### Gossipsub Deep Dive

Examined: `/py-libp2p/libp2p/pubsub/gossipsub.py` (1200+ lines)

**Versions supported:**
- meshsub/1.0.0
- meshsub/1.1.0
- meshsub/1.2.0
- meshsub/1.3.0 (Extensions)
- meshsub/1.4.0
- meshsub/2.0.0 (Adaptive)

**Features:**
- Mesh management (degree, degree_high, degree_low)
- Peer scoring
- Spam protection (rate limits, equivocation detection)
- Eclipse protection
- IDONTWANT lists (v1.2)
- Adaptive gossip (v2.0)

**Dependencies:**
```
trio>=0.26.0          # Async runtime
noiseprotocol>=0.3.0  # Encryption
protobuf>=4.25.0      # Message encoding
pynacl>=1.3.0         # Crypto
```

### Key libp2p Concepts

**Peer ID:** Cryptographic identity derived from public key.
```
QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N
```

**Multiaddr:** Self-describing network address.
```
/ip4/192.168.1.1/tcp/4001/p2p/QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N
```

**Protocol ID:** Identifies application protocol.
```
/aipg/jobs/1.0.0
/aipg/claims/1.0.0
```

**Topic:** Gossipsub channel for pub/sub.
```
/aipg/jobs/llama3.2:3b
/aipg/jobs/flux
```

---

## Proposed DAPI Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  USERS (HTTP - unchanged)                                       │
│                                                                 │
│  curl https://any-gateway.io/v1/chat/completions               │
│  openai.Client(base_url="https://gateway.aipowergrid.io")      │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS (same as today)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  GATEWAY NODES (anyone can run one)                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Gateway A│  │ Gateway B│  │ Gateway C│                      │
│  │ (AIPG)   │  │ (partner)│  │ (anon)   │                      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                      │
│       │             │             │                             │
│       └─────────────┴─────────────┘                             │
│                     │ libp2p gossipsub                          │
└─────────────────────┼───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  P2P MESH (libp2p)                                              │
│                                                                 │
│  Topics:                                                        │
│    /aipg/jobs/{model}     - Job broadcasts                      │
│    /aipg/claims/{job_id}  - Claim announcements                 │
│    /aipg/results/{job_id} - Result notifications                │
│                                                                 │
│  DHT:                                                           │
│    /aipg/workers/{model}  - Worker discovery                    │
│    /aipg/gateways         - Gateway discovery                   │
│                                                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ WORKER NODE  │ │ WORKER NODE  │ │ WORKER NODE  │
│              │ │              │ │              │
│ py-libp2p    │ │ py-libp2p    │ │ py-libp2p    │
│ + Ollama     │ │ + vLLM       │ │ + ComfyUI    │
│              │ │              │ │              │
│ Models:      │ │ Models:      │ │ Models:      │
│ - llama3.2   │ │ - mistral    │ │ - flux       │
│ - phi-3      │ │ - llama3     │ │ - sdxl       │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Gateway** | HTTP→P2P bridge, user authentication, rate limiting |
| **Worker** | Model inference, job claiming, result delivery |
| **DHT** | Peer discovery, bootstrap |
| **Gossipsub** | Job broadcast, claim propagation |
| **On-chain** | Worker registry, staking, payment, disputes |

### What's On-Chain vs Off-Chain

| On-Chain (Base L2) | Off-Chain (P2P) |
|--------------------|-----------------|
| Worker registration | Job broadcast |
| Staking/slashing | Job claiming |
| Payment settlement | Token streaming |
| Dispute resolution | Peer discovery |
| Model registry | Result delivery |

---

## Protocol Specification

### AIPG-P2P Protocol v1.0

#### Message Types

**1. JobRequest**
```protobuf
message JobRequest {
  string id = 1;              // UUID
  string model = 2;           // e.g., "llama3.2:3b"
  bytes payload = 3;          // JSON-encoded request
  uint64 max_cost = 4;        // Max AIPG willing to pay (wei)
  bytes user_pubkey = 5;      // User's public key
  bytes signature = 6;        // Signs: id + model + hash(payload) + max_cost
  uint64 timestamp = 7;       // Unix timestamp
  uint32 ttl = 8;             // Seconds until expiry
}
```

**2. JobClaim**
```protobuf
message JobClaim {
  string job_id = 1;
  bytes worker_pubkey = 2;
  uint64 price = 3;           // Actual price (≤ max_cost)
  bytes signature = 4;        // Signs: job_id + price
  uint64 timestamp = 5;
}
```

**3. JobResult**
```protobuf
message JobResult {
  string job_id = 1;
  bytes worker_pubkey = 2;
  oneof result {
    StreamToken token = 3;
    FinalResult done = 4;
    ErrorResult error = 5;
  }
}

message StreamToken {
  string text = 1;
  uint32 index = 2;
}

message FinalResult {
  string full_text = 1;
  uint32 token_count = 2;
  bytes receipt_signature = 3;  // Worker signs: job_id + hash(full_text)
}

message ErrorResult {
  string message = 1;
  uint32 code = 2;
}
```

#### Topic Structure

```
/aipg/1/jobs/{model}/proto      # Job broadcasts for model
/aipg/1/claims/proto            # All claims (global)
/aipg/1/results/{job_id}/proto  # Results for specific job
```

#### Claim Resolution

**Problem:** Multiple workers may attempt to claim the same job.

**Solution:** Deterministic selection using VRF-like hash.

```python
def compute_claim_score(job_id: str, job_seed: bytes, worker_pubkey: bytes) -> bytes:
    """Lower score wins."""
    return sha256(job_id.encode() + job_seed + worker_pubkey)

def should_claim(job: JobRequest, my_pubkey: bytes, known_workers: list[bytes]) -> bool:
    """Deterministic winner selection - every node computes same result."""
    my_score = compute_claim_score(job.id, job.signature[:32], my_pubkey)

    for worker in known_workers:
        their_score = compute_claim_score(job.id, job.signature[:32], worker)
        if their_score < my_score:
            return False  # Someone else should win

    return True
```

**Tie-breaker:** Job signature first 32 bytes serve as random seed.

**Failure handling:** If winner doesn't claim within 5 seconds, next-lowest can claim.

#### Bootstrap Process

1. **Read on-chain registry:**
   ```python
   bootstrap_peers = WorkerRegistry.getBootstrapNodes()
   ```

2. **Connect to DHT:**
   ```python
   dht = KadDHT(bootstrap_peers)
   await dht.bootstrap()
   ```

3. **Discover workers for models:**
   ```python
   workers = await dht.find_providers(f"/aipg/workers/{model}")
   ```

4. **Join gossipsub topics:**
   ```python
   await pubsub.subscribe(f"/aipg/1/jobs/{model}/proto")
   ```

---

## Implementation Plan

### Phase 1: Federated API (2-4 weeks)

**Goal:** Multiple API nodes, shared state, no P2P yet.

**Changes:**
- Deploy 2-3 API instances in different regions
- Redis Cluster for shared job queue
- Load balancer (Cloudflare, AWS ALB)
- Workers connect to nearest API

**Decentralization level:** Low (all infra controlled by AIPG)

**Why do this first:**
- Proves multi-node works
- Reduces single point of failure
- No protocol changes needed

### Phase 2: P2P Worker Mesh (4-8 weeks)

**Goal:** Workers communicate via libp2p, gateways bridge HTTP→P2P.

**Changes:**
- Add py-libp2p to grid-inference-worker
- Workers join gossipsub mesh
- Gateways publish jobs to gossipsub
- Remove Redis from job path (keep for local state)

**New components:**
- `aipg_p2p/` - Shared P2P library
- `aipg_p2p/worker.py` - Worker P2P daemon
- `aipg_p2p/gateway.py` - Gateway P2P bridge

**Decentralization level:** Medium (gateways still controlled, workers are P2P)

### Phase 3: Open Gateways (4-8 weeks)

**Goal:** Anyone can run a gateway, payment via channels.

**Changes:**
- Publish gateway spec
- On-chain gateway registry
- Payment channels (instant settlement)
- Gateway staking (optional, for trust)

**Decentralization level:** High (only on-chain contracts are "central")

### Phase 4: Full Autonomy (ongoing)

**Goal:** Network operates without AIPG involvement.

**Changes:**
- Multiple client implementations
- Formal protocol spec (like BIPs)
- Governance for protocol upgrades
- Bug bounties

**Decentralization level:** Maximum

---

## Risks and Mitigations

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| py-libp2p bugs | Medium | High | Contribute fixes upstream, fallback to sidecar |
| NAT traversal failures | Medium | Medium | Circuit relay fallback, require STUN |
| Gossipsub spam | Low | High | Peer scoring, stake-weighted publishing |
| DHT eclipse attack | Low | High | On-chain bootstrap list, multiple DHT queries |
| Message ordering | Medium | Low | Sequence numbers, client-side reordering |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No one runs gateways | Medium | Critical | AIPG runs reference gateways indefinitely |
| Workers don't upgrade | High | Medium | Protocol versioning, deprecation timeline |
| On-chain contract bug | Low | Critical | Audits, timelocks, upgrade proxy |

### Economic Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Free-riding gateways | Medium | Medium | Payment channels, reputation |
| Worker collusion | Low | Medium | Random job assignment, slashing |
| Price manipulation | Low | Low | On-chain price oracle, market dynamics |

---

## Appendix: Code Examples

### A. Minimal Worker (py-libp2p)

```python
#!/usr/bin/env python3
"""AIPG P2P Worker - Minimal Example"""

import trio
from libp2p import new_host
from libp2p.pubsub import gossipsub
from libp2p.kad_dht import KadDHT

TOPIC_JOBS = "/aipg/1/jobs/llama3.2:3b/proto"

async def main():
    # Create libp2p host
    host = new_host()

    async with host.run(listen_addrs=["/ip4/0.0.0.0/tcp/0"]):
        # Initialize gossipsub
        gs = gossipsub.GossipSub()
        pubsub = Pubsub(host, gs)

        # Subscribe to job topic
        sub = await pubsub.subscribe(TOPIC_JOBS)

        print(f"Worker online: {host.get_id()}")
        print(f"Listening for jobs on {TOPIC_JOBS}")

        # Process jobs
        async for message in sub:
            job = JobRequest.parse(message.data)

            if should_claim(job, host.get_id().to_bytes()):
                print(f"Claiming job {job.id}")
                await process_job(job, pubsub)

async def process_job(job, pubsub):
    # Call local inference backend
    async for token in inference_backend.generate(job.payload):
        result = JobResult(
            job_id=job.id,
            token=StreamToken(text=token)
        )
        await pubsub.publish(f"/aipg/1/results/{job.id}/proto", result.serialize())

    # Send final result
    final = JobResult(
        job_id=job.id,
        done=FinalResult(full_text=full_response, token_count=count)
    )
    await pubsub.publish(f"/aipg/1/results/{job.id}/proto", final.serialize())

if __name__ == "__main__":
    trio.run(main)
```

### B. Gateway Bridge (py-libp2p + FastAPI)

```python
#!/usr/bin/env python3
"""AIPG Gateway - HTTP to P2P Bridge"""

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import trio

app = FastAPI()
p2p_host = None  # Initialized on startup

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    job_id = str(uuid4())

    # Create job request
    job = JobRequest(
        id=job_id,
        model=request.model,
        payload=request.model_dump_json(),
        max_cost=estimate_cost(request),
        user_pubkey=get_user_pubkey(request),
    )
    job.signature = sign_job(job)

    # Publish to P2P network
    topic = f"/aipg/1/jobs/{request.model}/proto"
    await p2p_host.pubsub.publish(topic, job.serialize())

    # Subscribe to results
    result_topic = f"/aipg/1/results/{job_id}/proto"
    sub = await p2p_host.pubsub.subscribe(result_topic)

    # Stream response
    async def generate():
        async for msg in sub:
            result = JobResult.parse(msg.data)
            if result.token:
                yield format_sse_chunk(result.token.text)
            elif result.done:
                yield format_sse_done(result.done)
                break
            elif result.error:
                yield format_sse_error(result.error)
                break

    return StreamingResponse(generate(), media_type="text/event-stream")
```

### C. On-Chain Worker Registry

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WorkerRegistry {
    struct Worker {
        bytes32 peerId;        // libp2p peer ID
        string[] models;       // Supported models
        uint256 stake;         // Staked AIPG
        bool active;
    }

    mapping(address => Worker) public workers;
    bytes32[] public bootstrapNodes;

    uint256 public constant MIN_STAKE = 1000 ether;

    event WorkerRegistered(address indexed owner, bytes32 peerId);
    event WorkerSlashed(address indexed owner, uint256 amount);

    function register(bytes32 peerId, string[] calldata models) external payable {
        require(msg.value >= MIN_STAKE, "Insufficient stake");

        workers[msg.sender] = Worker({
            peerId: peerId,
            models: models,
            stake: msg.value,
            active: true
        });

        emit WorkerRegistered(msg.sender, peerId);
    }

    function addBootstrapNode(bytes32 peerId) external {
        require(workers[msg.sender].stake >= MIN_STAKE, "Must be staked worker");
        bootstrapNodes.push(peerId);
    }

    function getBootstrapNodes() external view returns (bytes32[] memory) {
        return bootstrapNodes;
    }

    function getWorkersForModel(string calldata model) external view returns (bytes32[] memory) {
        // Implementation: iterate workers, filter by model
    }

    function slash(address worker, uint256 amount, bytes calldata proof) external {
        // Implementation: verify proof, reduce stake
    }
}
```

---

## References

1. [libp2p Specifications](https://github.com/libp2p/specs)
2. [py-libp2p Documentation](https://py-libp2p.readthedocs.io/)
3. [Gossipsub v1.1 Spec](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md)
4. [Kademlia DHT Paper](https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf)
5. [Hyperswarm GitHub](https://github.com/holepunchto/hyperswarm)
6. [Waku Documentation](https://docs.waku.org/)
7. [IPFS libp2p Usage](https://docs.ipfs.tech/concepts/libp2p/)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-24 | 1.0 | Initial research document |
