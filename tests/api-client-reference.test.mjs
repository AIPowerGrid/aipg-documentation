// SPDX-FileCopyrightText: 2026 AI Power Grid
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const reference = read('content/api-client-reference.mdx');

test('API discovery is linked from navigation, first-run docs and agent index', () => {
  assert.match(read('content/_meta.tsx'), /"api-client-reference"/);
  for (const path of ['content/integrations.mdx', 'content/streaming-api.mdx', 'public/llms.txt']) {
    assert.ok(read(path).includes('/api-client-reference'), path);
  }
  assert.ok(reference.includes('https://api.aipowergrid.io/openapi.json'));
  assert.ok(reference.includes('https://api.aipowergrid.io/docs'));
});

test('media discovery and existing credit balance have explicit canonical routes', () => {
  assert.ok(read('content/generate.mdx').includes('for live media models'));
  assert.ok(reference.includes('GET /v1/status/models'));
  assert.ok(reference.includes('/v1/account/credits'));
  assert.ok(reference.includes('total_spendable_usd'));
  assert.ok(reference.includes('Account\ncreation does not guarantee free credit'));
});

test('image example requests one explicitly selected billable image', () => {
  const blocks = [...reference.matchAll(/-d '({[\s\S]*?})'/g)];
  assert.equal(blocks.length, 1);
  const body = JSON.parse(blocks[0][1]);
  assert.equal(body.n, 1);
  assert.equal(body.model, 'z-image-turbo');
  assert.equal(body.response_format, 'url');
  assert.ok(reference.includes('one billable image'));
  assert.ok(!reference.includes('"model": "auto"'));
});

test('Python urllib documents the scoped verified fix without an auth or TLS bypass', () => {
  assert.ok(reference.includes('default `Python-urllib/` User-Agent is supported'));
  assert.ok(reference.includes('API-host-only exception'));
  assert.ok(reference.includes('does not authenticate a request'));
  assert.ok(reference.includes('Protected account endpoints still return `401`'));
  assert.ok(reference.includes('Never disable TLS verification'));
  assert.ok(!reference.includes('outstanding edge compatibility issue'));
  assert.match(reference, /urllib\.request\.urlopen\(\s*"https:\/\/api\.aipowergrid\.io\/v1\/models", timeout=20/);
});

test('reasoning limits and retired API migration remain explicit', () => {
  assert.ok(reference.includes('Do not automatically regenerate empty replies'));
  assert.ok(reference.includes('Legacy `/api/v2` returns `410 Gone`'));
  assert.ok(reference.includes('Grid\ngeneration key is not a remote MCP OAuth access token'));
});

test('Ollama troubleshooting reflects the published worker correction', () => {
  const guide = read('content/backends/ollama.mdx');
  assert.ok(guide.includes('v0.3.12'));
  assert.ok(guide.includes('600-second generation read timeout'));
  assert.ok(guide.includes('https://aipowergrid.io/run'));
  assert.ok(!guide.includes('Until a corrected release is qualified'));
});
