// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('developer share image keeps the docs basePath and matches the shipped PNG', async () => {
  const theme = await readFile(new URL('../theme.config.tsx', import.meta.url), 'utf8');
  const bytes = await readFile(new URL('../public/social/developers-v1.png', import.meta.url));
  const url = 'https://aipowergrid.io/docs/social/developers-v1.png';
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.ok(bytes.length < 5_000_000);
  assert.ok(theme.includes(`<meta property="og:image" content="${url}" />`));
  assert.ok(theme.includes(`<meta name="twitter:image" content="${url}" />`));
  assert.ok(theme.includes(`<meta property="og:image:width" content="${bytes.readUInt32BE(16)}" />`));
  assert.ok(theme.includes(`<meta property="og:image:height" content="${bytes.readUInt32BE(20)}" />`));
  assert.match(theme, /name="twitter:card" content="summary_large_image"/);
  assert.match(theme, /property="og:image:alt" content="[^"]+"/);
  assert.match(theme, /name="twitter:image:alt" content="[^"]+"/);
});
