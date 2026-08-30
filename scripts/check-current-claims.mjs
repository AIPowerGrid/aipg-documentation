// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const pagesDirectory = path.resolve('pages')
const excludedPages = new Set(['whitepaper.mdx'])
const retiredClaims = [
  /free ai for everyone/i,
  /free daily access is live/i,
  /free tier that doesn't expire/i,
  /a free tier for everyone/i,
  /absolutely no cost/i,
  /unlimited access/i,
  /no surveillance of your prompts/i,
  /earn AIPG today\s+per request/i,
  /launch your own AI-powered token with built-in access/i,
  /a generation network that nobody can shut down and nobody can spy on/i,
]

async function collectMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) return collectMdxFiles(target)
      return entry.isFile() && entry.name.endsWith('.mdx') ? [target] : []
    }),
  )
  return nested.flat()
}

const currentProductFiles = [
  ...(await collectMdxFiles(pagesDirectory)),
  path.resolve('theme.config.tsx'),
]

const violations = []
for (const file of currentProductFiles) {
  if (excludedPages.has(path.relative(pagesDirectory, file))) continue
  const contents = await readFile(file, 'utf8')
  for (const claim of retiredClaims) {
    if (claim.test(contents)) {
      violations.push(`${path.relative(process.cwd(), file)} matches ${claim}`)
    }
  }
}

if (violations.length > 0) {
  console.error('Retired current-product claims found:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exitCode = 1
} else {
  console.log('Current-product claim gate passed')
}
