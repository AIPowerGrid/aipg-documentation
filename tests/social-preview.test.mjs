// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('developer share image keeps the docs basePath and matches the shipped PNG', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const bytes = await readFile(new URL('../public/social/developers-v1.png', import.meta.url));
  const url = 'https://aipowergrid.io/docs/social/developers-v1.png';
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.ok(bytes.length < 5_000_000);
  assert.ok(layout.includes(`url: '${url}'`));
  assert.ok(layout.includes(`width: ${bytes.readUInt32BE(16)}`));
  assert.ok(layout.includes(`height: ${bytes.readUInt32BE(20)}`));
  assert.match(layout, /openGraph:[\s\S]*?images: \[image\]/);
  assert.match(layout, /twitter:[\s\S]*?card: 'summary_large_image'/);
  assert.match(layout, /alt: '[^']+'/);
  assert.match(layout, /images: \[\{ url: image.url, alt: image.alt \}\]/);
});
