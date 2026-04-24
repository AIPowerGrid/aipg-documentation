# DAPI Quickstart Guide

Get a P2P worker running in 15 minutes.

---

## Prerequisites

- Python 3.10+
- Ollama running locally
- An AIPG wallet (for staking, later)

---

## 1. Install Dependencies

```bash
pip install libp2p trio
```

## 2. Create Worker Script

```python
#!/usr/bin/env python3
"""aipg_worker.py - Minimal P2P worker"""

import json
import hashlib
import trio
from libp2p import new_host
from libp2p.pubsub.gossipsub import GossipSub
from libp2p.pubsub.pubsub import Pubsub
from libp2p.peer.peerinfo import info_from_p2p_addr
import httpx

# Config
MODEL = "llama3.2:3b"
OLLAMA_URL = "http://localhost:11434"
TOPIC = f"/aipg/1/jobs/{MODEL}/proto"

async def call_ollama(prompt: str):
    """Stream tokens from Ollama."""
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            f"{OLLAMA_URL}/api/generate",
            json={"model": MODEL.split(":")[0], "prompt": prompt},
            timeout=300,
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "response" in data:
                        yield data["response"]
                    if data.get("done"):
                        break

async def main():
    # Create host
    host = new_host()

    async with host.run(listen_addrs=["/ip4/0.0.0.0/tcp/0"]):
        # Setup gossipsub
        gs = GossipSub()
        pubsub = Pubsub(host, gs)
        await pubsub.subscribe(TOPIC)

        my_id = host.get_id().to_string()
        print(f"Worker online: {my_id}")
        print(f"Listening on: {TOPIC}")
        print(f"Model: {MODEL}")
        print("-" * 50)

        # Process messages
        async for message in pubsub.subscription_queue(TOPIC):
            try:
                job = json.loads(message.data.decode())
                print(f"Received job: {job.get('id', 'unknown')}")

                # Extract prompt
                payload = job.get("payload", {})
                if isinstance(payload, str):
                    payload = json.loads(payload)

                messages = payload.get("messages", [])
                prompt = messages[-1]["content"] if messages else ""

                # Generate response
                full_response = ""
                async for token in call_ollama(prompt):
                    full_response += token
                    print(token, end="", flush=True)

                print(f"\n[Done: {len(full_response)} chars]")

            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    trio.run(main)
```

## 3. Run It

Terminal 1 - Start Ollama:
```bash
ollama serve
ollama pull llama3.2:3b
```

Terminal 2 - Start Worker:
```bash
python aipg_worker.py
```

You should see:
```
Worker online: QmYourPeerIdHere
Listening on: /aipg/1/jobs/llama3.2:3b/proto
Model: llama3.2:3b
--------------------------------------------------
```

---

## 4. Test with a Second Node

Create `test_publisher.py`:

```python
#!/usr/bin/env python3
"""Publish a test job to the network."""

import json
import trio
from uuid import uuid4
from libp2p import new_host
from libp2p.pubsub.gossipsub import GossipSub
from libp2p.pubsub.pubsub import Pubsub
from libp2p.peer.peerinfo import info_from_p2p_addr
import multiaddr

TOPIC = "/aipg/1/jobs/llama3.2:3b/proto"

async def main():
    host = new_host()

    async with host.run(listen_addrs=["/ip4/0.0.0.0/tcp/0"]):
        gs = GossipSub()
        pubsub = Pubsub(host, gs)

        # Connect to worker (replace with actual multiaddr)
        worker_addr = input("Enter worker multiaddr: ")
        if worker_addr:
            maddr = multiaddr.Multiaddr(worker_addr)
            info = info_from_p2p_addr(maddr)
            await host.connect(info)
            print(f"Connected to {info.peer_id}")

        # Give gossipsub time to establish mesh
        await trio.sleep(2)

        # Publish job
        job = {
            "id": str(uuid4()),
            "model": "llama3.2:3b",
            "payload": {
                "messages": [
                    {"role": "user", "content": "What is 2+2? Reply in one word."}
                ]
            },
            "timestamp": 1234567890
        }

        await pubsub.publish(TOPIC, json.dumps(job).encode())
        print(f"Published job: {job['id']}")

        # Keep alive to see response
        await trio.sleep(30)

if __name__ == "__main__":
    trio.run(main)
```

Run:
```bash
python test_publisher.py
# Enter the multiaddr printed by the worker
```

---

## 5. Connect to Bootstrap Nodes

For production, connect to known peers:

```python
BOOTSTRAP_NODES = [
    "/ip4/x.x.x.x/tcp/4001/p2p/QmBootstrapPeerId1",
    "/ip4/y.y.y.y/tcp/4001/p2p/QmBootstrapPeerId2",
]

async def bootstrap(host):
    for addr in BOOTSTRAP_NODES:
        try:
            maddr = multiaddr.Multiaddr(addr)
            info = info_from_p2p_addr(maddr)
            await host.connect(info)
            print(f"Connected to bootstrap: {info.peer_id}")
        except Exception as e:
            print(f"Failed to connect to {addr}: {e}")
```

---

## Next Steps

1. **Add claim logic** - Implement deterministic winner selection
2. **Add result publishing** - Stream tokens back via gossipsub
3. **Add on-chain registration** - Register peer ID in WorkerRegistry
4. **Add payment** - Implement payment channel or on-chain settlement

See [DAPI-RESEARCH.md](./DAPI-RESEARCH.md) for full protocol specification.

---

## Troubleshooting

**"Connection refused" to Ollama:**
```bash
# Make sure Ollama is running
curl http://localhost:11434/api/tags
```

**"No module named libp2p":**
```bash
pip install libp2p
# If that fails, try:
pip install git+https://github.com/libp2p/py-libp2p.git
```

**Workers can't find each other:**
- Both nodes need to be on same network or have public IPs
- Use relay nodes for NAT traversal
- Check firewall allows UDP/TCP on random ports

**Gossipsub not propagating:**
- Ensure both nodes subscribed to same topic
- Wait 2-3 seconds after connecting before publishing
- Check that mesh is formed (gossipsub needs time to graft)
