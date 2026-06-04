# P2P Protocol Comparison for AIPG

Quick reference for protocol options evaluated.

---

## Decision Matrix

| Criteria | Weight | Waku | Hyperswarm | libp2p | NATS | Nostr |
|----------|--------|------|------------|--------|------|-------|
| **Python support** | Critical | ❌ 0 | ❌ 0 | ✅ 10 | ✅ 10 | ✅ 10 |
| **True P2P** | High | ✅ 8 | ✅ 10 | ✅ 10 | ❌ 2 | ⚠️ 5 |
| **NAT traversal** | High | N/A | ✅ 10 | ✅ 8 | N/A | N/A |
| **Throughput** | Medium | ❌ 2 | ✅ 8 | ✅ 8 | ✅ 10 | ⚠️ 6 |
| **Ecosystem size** | Medium | ⚠️ 4 | ⚠️ 4 | ✅ 10 | ✅ 8 | ⚠️ 6 |
| **Battle-tested** | Medium | ⚠️ 5 | ✅ 7 | ✅ 10 | ✅ 9 | ⚠️ 6 |
| **Simplicity** | Low | ⚠️ 6 | ✅ 9 | ⚠️ 5 | ✅ 9 | ✅ 9 |
| **TOTAL** | | 25 | 48 | **61** | 48 | 42 |

**Winner: libp2p** (only option with Python support AND true P2P)

---

## Protocol Deep Dives

### Waku

**Type:** Privacy-focused relay network

**Architecture:**
```
Publisher → Relay Node → Relay Node → Subscriber
              ↑            ↑
         (Store protocol for offline)
```

**Pros:**
- Privacy features (RLN for spam)
- Store protocol (messages survive offline)
- Light clients

**Cons:**
- Rate limited: 1 msg/sec per identity
- No Python SDK
- Designed for chat, not job queues
- Merging into Logos project

**Throughput:** ~1 msg/sec per publisher (RLN limit)

**Verdict:** Wrong tool for the job. Use for private messaging, not job queues.

---

### Hyperswarm

**Type:** DHT-based P2P with excellent hole punching

**Architecture:**
```
Peer A ←→ DHT ←→ Peer B
         ↓
   (Topic discovery)
         ↓
Peer A ←──────→ Peer B
   (Direct encrypted connection)
```

**Pros:**
- Best NAT traversal (birthday attack for symmetric NAT)
- Simple API
- Production-tested (Keet video calls)
- Built-in DHT

**Cons:**
- JavaScript only (no Python bindings)
- hyperswarm-rs incomplete
- Small team (Holepunch)
- Bootstrap nodes are Holepunch's

**Code quality:** Excellent. Clean, well-documented.

**Verdict:** Would be perfect if Python bindings existed. Monitor hyperswarm-rs progress.

---

### libp2p

**Type:** Modular P2P networking stack

**Architecture:**
```
┌─────────────────────────────────────┐
│           Application               │
├─────────────────────────────────────┤
│  Pubsub (Gossipsub)  │  DHT (Kad)   │
├─────────────────────────────────────┤
│         Stream Muxer (Yamux)        │
├─────────────────────────────────────┤
│      Security (Noise / TLS)         │
├─────────────────────────────────────┤
│    Transport (TCP / QUIC / WS)      │
└─────────────────────────────────────┘
```

**Pros:**
- Python bindings (py-libp2p v0.6.0)
- Multiple implementations (Go, Rust, JS, Python)
- Gossipsub for efficient pub/sub
- Kademlia DHT for discovery
- Massive ecosystem (IPFS, Filecoin, ETH)

**Cons:**
- Complex (many moving parts)
- py-libp2p less mature than Go/Rust
- Steeper learning curve

**py-libp2p status:**
| Feature | Status |
|---------|--------|
| TCP | ✅ |
| QUIC | ✅ |
| Noise | ✅ |
| Gossipsub | ✅ |
| Kademlia | ✅ |
| AutoNAT | ✅ |
| Relay | ✅ |

**Verdict:** Best choice. Has everything needed, Python works.

---

### NATS

**Type:** High-performance messaging (federated servers)

**Architecture:**
```
Client → NATS Server ← Client
            ↓
      NATS Cluster
      /    |    \
   Node  Node  Node
```

**Pros:**
- Extremely fast (millions msg/sec)
- Queue groups (automatic load balancing)
- JetStream (persistence)
- Simple to deploy

**Cons:**
- Not P2P (requires servers)
- Trust required for server operators
- Central points of failure

**Verdict:** Good for Phase 1 (federated). Not suitable for true decentralization.

---

### Nostr

**Type:** Relay-based decentralized protocol

**Architecture:**
```
Client → Relay 1 ← Client
   ↓        ↓
Relay 2 ← Relay 3
```

**Pros:**
- Very simple (JSON over WebSocket)
- Built-in signatures (secp256k1)
- Growing ecosystem
- Multiple relays = redundancy

**Cons:**
- Relays are servers (not P2P)
- Designed for social, not job queues
- Would need custom event kinds

**Verdict:** Simpler alternative if libp2p too complex. Still relay-dependent.

---

## Implementation Complexity

| Protocol | Lines of Code (estimate) | Time to MVP |
|----------|-------------------------|-------------|
| NATS | 200-400 | 1-2 weeks |
| Nostr | 300-500 | 2-3 weeks |
| libp2p | 500-1000 | 4-6 weeks |
| Hyperswarm | 400-600 | 3-4 weeks* |
| Waku | 500-800 | 4-6 weeks |

*Hyperswarm estimate assumes JS or waiting for Rust bindings

---

## Risk Assessment

| Protocol | Technical Risk | Ecosystem Risk | Longevity Risk |
|----------|---------------|----------------|----------------|
| Waku | Medium | High (small) | High (Logos merger) |
| Hyperswarm | Low | High (small team) | Medium |
| libp2p | Low | Low (huge) | Low |
| NATS | Low | Low | Low |
| Nostr | Low | Medium | Medium |

---

## Final Recommendation

### Primary: libp2p (py-libp2p)

**Why:**
1. Python bindings exist and work
2. Gossipsub is exactly what we need for job broadcast
3. Kademlia DHT for peer discovery
4. Will outlive us (Protocol Labs + Ethereum backing)

### Fallback: NATS (federated)

**When:**
- py-libp2p proves too buggy
- Need to ship faster
- Accept federated model

### Future Watch: Hyperswarm

**When:**
- hyperswarm-rs completes
- Python bindings created
- Would consider switching for simpler API

---

## Links

- [py-libp2p](https://github.com/libp2p/py-libp2p)
- [rust-libp2p](https://github.com/libp2p/rust-libp2p)
- [go-libp2p](https://github.com/libp2p/go-libp2p)
- [Hyperswarm](https://github.com/holepunchto/hyperswarm)
- [HyperDHT](https://github.com/holepunchto/hyperdht)
- [Waku Docs](https://docs.waku.org/)
- [NATS](https://nats.io/)
- [Nostr Protocol](https://github.com/nostr-protocol/nostr)
