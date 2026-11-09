# ADR 0001: Supported Documentation Runtime

Status: accepted for implementation; production remains gated on review and QA.

## Context

The previous Nextra 3 dependency graph retained Zod 3, which has no patched
release for [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
Changing its major dependency in place would violate the consumer's API contract.
Other findings affected Next, image processing, sanitization, math and source maps.

## Decision

Use Nextra and its matching docs theme at 4.6.1, whose native Zod range resolves
to patched 4.6.7. Keep React 18 and the Next 15 patch line. Move existing Markdown
and navigation to `content/` and use the supported static catch-all App Router
integration. Preserve document bodies and public `/docs` paths; this is not a
content redesign. Replace the retired theme-config API with the root layout.

Pin compatible patches for Next, DOMPurify, sharp, KaTeX and source-map-js.
Scope minimatch 11.0.1 to `@ts-morph/common` for its
[glob-amplification advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249).
That consumer uses the retained `minimatch(path, pattern)` API; a real ts-morph
project/glob regression checks compatibility. Node 22 is the supported runtime.
The pinned theme also strips `children` before validating its configuration,
while the schema still requires that property under patched Zod. A one-line
`patch-package` correction omits only that already-separated property from the
internal configuration schema. All other strict validation remains in place.
Installation fails if the patch cannot apply; regression tests require both
the patch and continued rejection of invalid/unknown options. Remove the patch
only when an upstream theme release contains the equivalent correction.
Do not downgrade the framework to satisfy npm's automated suggestion, relabel
vulnerable packages, suppress audit findings or use `npm audit fix --force`.

## Consequences And Verification

Nextra 4 requires App Router and a generated Pagefind search index. The
[upstream migration guide](https://the-guild.dev/blog/nextra-4) describes the
supported integration. Index only rendered public documents; internal standards,
proposals and this decision stay outside the content tree. Unknown document
paths return 404 rather than being evaluated dynamically.

Require a clean npm install, zero-vulnerability audit, strict TypeScript, current
claim and metadata tests, the complete route inventory, Mermaid/math rendering,
search navigation and desktop/mobile screenshots. Verify a clean-commit preview
before production and record the exact deployed commit. Retain the previous
deployment for incident recovery; reverting to its vulnerable dependencies is
not a security remediation.

Revisit scoped overrides when upstream declares the patched ranges. Any future
dependency update must preserve the zero-audit and runtime compatibility gates.
