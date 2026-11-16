// SPDX-FileCopyrightText: 2026 AI Power Grid
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const page = read('content/agent-wallet-accounts.mdx');

test('the wallet page is linked from navigation, the API reference and the agent index', () => {
  assert.match(read('content/_meta.tsx'), /"agent-wallet-accounts"/);
  for (const path of ['content/api-client-reference.mdx', 'public/llms.txt']) {
    assert.ok(read(path).includes('/agent-wallet-accounts'), path);
  }
});

test('the sign-in example uses Core’s wallet endpoints with a script origin on Base', () => {
  for (const route of [
    '/v1/accounts/wallet/challenge',
    '/v1/accounts/wallet/verify',
    '/v1/account/keys',
    '/v1/account/deposits/config',
    '/v1/account/deposits/claim',
  ]) {
    assert.ok(page.includes(route), route);
  }
  assert.ok(page.includes('"domain": "localhost"'));
  assert.ok(page.includes('"uri": "http://localhost"'));
  assert.ok(page.includes('"chain_id": 8453'));
  assert.ok(!/"domain": "console\.aipowergrid\.io"/.test(page));
});

test('no key material, treasury address or free-credit promise is published', () => {
  assert.ok(page.includes('The Grid never receives the private key'));
  assert.ok(page.includes('Do not hard-code the\ntreasury address'));
  assert.ok(page.includes('Do not plan on free credit'));
  assert.ok(page.includes('cannot be withdrawn or transferred'));
  // The only 0x value allowed is the placeholder transaction hash.
  assert.deepEqual(page.match(/0x[0-9a-fA-F]{6,}/g) ?? [], []);
  assert.ok(!/grid_[A-Za-z0-9_-]{8,}/.test(page));
});

test('an unclear claim never leads to a second transfer', () => {
  assert.ok(page.includes('Never send a second transfer'));
  assert.ok(page.includes('already_claimed'));
  assert.ok(page.includes('do not retry in a loop'));
});
