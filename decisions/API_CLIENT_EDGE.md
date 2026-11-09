# Raw API Client Edge Compatibility

## Active Rule

The maintainer approved and deployed **API urllib BIC exception** on 2026-11-09.
Cloudflare Configuration Rule ID: `f7f66c14554e4a479a34bdcabe2abf9c`.

```text
(http.host eq "api.aipowergrid.io" and starts_with(http.user_agent, "Python-urllib/"))
```

The only configured setting is Browser Integrity Check **off** for matching
requests. Global Browser Integrity Check, managed WAF, DDoS protections, TLS,
Core authentication/scopes, rate limits and charging were not changed. The
User-Agent is client-controlled, never an authorization or trust signal.
This is not a general WAF skip or an allow rule.

## Verification

Before deployment, default Python urllib received `403` / error `1010` even
for public `/v1/models`; a descriptive application User-Agent received `200`.
After deployment, real Python stdlib requests with their default User-Agent
proved:

| Request | Result |
| --- | --- |
| `/v1/models` | `200`, valid JSON |
| `/v1/status/models` | `200`, valid JSON |
| `/v1/pricing` | `200`, valid JSON |
| `/openapi.json` | `200`, valid JSON |
| `/v1/account`, no key | Core JSON `401`, missing key |
| `/v1/account`, deliberately invalid Bearer | Core JSON `401`, invalid key |
| `/v1/account`, deliberately invalid `apikey` | Core JSON `401`, invalid key |
| Marketing host `/docs/api-client-reference`, default urllib | `403` / `1010` |

Nonmatching application User-Agents can already be allowed by BIC; do not
assume they must return `403`. Their public discovery still worked, and an
unauthenticated account request still returned `401`. The rule's exact host
and case-sensitive prefix match is authoritative for its scope.

All verification was read-only, used no real credentials, and sent no inference,
funding or transaction request. The public client guide documents default
urllib discovery and retains the TLS/authentication boundaries.

## Rollback

Disable only this named Configuration Rule in the `aipowergrid.io` zone. Do not
disable global BIC, change bot/WAF settings, or modify the unrelated docs CSP
transform. Disabling the rule restores the default-urllib compatibility failure;
a descriptive application User-Agent remains a diagnostic workaround, not a
fix to auth, billing or backend availability.
