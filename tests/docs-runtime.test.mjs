// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { Project } from 'ts-morph'
import katex from 'katex'

const root = new URL('../', import.meta.url)

test('the supported dependency graph retains patched security floors', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'))
  assert.equal(pkg.dependencies.next, '15.5.29')
  assert.equal(pkg.dependencies.nextra, '4.6.1')
  assert.equal(pkg.dependencies['nextra-theme-docs'], pkg.dependencies.nextra)
  assert.equal(lock.packages['node_modules/zod'].version, '4.6.7')
  assert.equal(pkg.overrides.dompurify, '3.4.17')
  assert.equal(pkg.overrides.katex, '0.18.2')
  assert.equal(pkg.overrides.sharp, '0.35.5')
  assert.equal(pkg.overrides['source-map-js'], '1.2.2')
})

test('the scoped matcher patch preserves real ts-morph glob selection', () => {
  const require = createRequire(new URL('../node_modules/@ts-morph/common/package.json', import.meta.url))
  const { minimatch, Minimatch } = require('minimatch')
  assert.equal(typeof Minimatch, 'function')
  assert.equal(minimatch('/src/nested/file.ts', '/src/**/*.ts'), true)
  assert.equal(minimatch('/src/nested/file.js', '/src/**/*.ts'), false)
  const project = new Project({ useInMemoryFileSystem: true })
  project.createSourceFile('/src/page.ts', 'export const page = 1')
  project.createSourceFile('/src/nested/item.ts', 'export const item = 2')
  project.createSourceFile('/outside/other.ts', 'export const other = 3')
  assert.deepEqual(project.getSourceFiles('/src/**/*.ts').map(file => file.getFilePath()).sort(), [
    '/src/nested/item.ts', '/src/page.ts',
  ])
})

test('patched math rendering still handles documentation notation', () => {
  const html = katex.renderToString(String.raw`\frac{a_i}{\sum_{j=1}^n a_j}`, { throwOnError: true })
  assert.match(html, /katex-mathml/)
  assert.match(html, /<math/)
  assert.match(html, /<annotation/)
})

test('the pinned layout patch validates config after children is separated', async () => {
  const file = await readFile(new URL('../node_modules/nextra-theme-docs/dist/layout.js', import.meta.url), 'utf8')
  assert.match(file, /LayoutPropsSchema\.omit\(\{ children: true \}\)\.safeParse\(themeConfig\)/)
  assert.doesNotMatch(file, /LayoutPropsSchema\.safeParse\(themeConfig\)/)
  const { z } = await import('zod')
  const schema = z.strictObject({ children: z.custom(), darkMode: z.boolean() })
  assert.equal(schema.safeParse({ darkMode: false }).success, false)
  const configSchema = schema.omit({ children: true })
  assert.equal(configSchema.safeParse({ darkMode: false }).success, true)
  assert.equal(configSchema.safeParse({ darkMode: 'false' }).success, false)
  assert.equal(configSchema.safeParse({ darkMode: false, unknownOption: true }).success, false)
})

test('content routing keeps the base path and excludes private documents', async () => {
  const config = await readFile(new URL('next.config.mjs', root), 'utf8')
  const route = await readFile(new URL('app/[[...mdxPath]]/page.tsx', root), 'utf8')
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.match(config, /basePath: '\/docs'/)
  assert.match(route, /generateStaticParamsFor\('mdxPath'\)/)
  assert.match(route, /dynamicParams = false/)
  assert.match(pkg.scripts.postbuild, /pagefind --site \.next\/server\/app --output-path public\/_pagefind/)
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      assert.notEqual(entry.name, 'AGENTS.md')
      assert.notEqual(entry.name, 'engineering-standards')
      if (entry.isDirectory()) await visit(path.join(directory, entry.name))
    }
  }
  await visit(fileURLToPath(new URL('content/', root)))
})
