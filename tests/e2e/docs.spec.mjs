// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'
import path from 'node:path'

const routes = readdirSync(path.resolve('content'), { recursive: true })
  .filter(file => file.endsWith('.mdx'))
  .map(file => '/docs/' + file.replaceAll(path.sep, '/').replace(/(?:^|\/)index\.mdx$/, '').replace(/\.mdx$/, ''))
  .map(route => route.replace(/\/$/, ''))

test('every public document remains available and private content stays private', async ({ request }) => {
  expect(routes.length).toBeGreaterThanOrEqual(43)
  for (const route of routes) {
    const response = await request.get(route)
    expect(response.status(), route).toBe(200)
    const body = await response.text()
    expect(body, route).toContain('<h1')
    expect(body, route).not.toContain('Application error: a server-side exception')
  }
  for (const route of ['/docs/AGENTS', '/docs/engineering-standards/00-core', '/docs/decisions/0001-supported-docs-runtime', '/docs/not-a-real-document']) {
    expect((await request.get(route)).status(), route).toBe(404)
  }
})

test('metadata, branding and ordinary document navigation render without browser errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/docs')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Power Grid')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://aipowergrid.io/docs/social/developers-v1.png')
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1730')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '909')
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://aipowergrid.io/docs/social/developers-v1.png')
  await expect(page.locator('.docs-logo img')).toBeVisible()
  expect(await page.locator('.docs-logo img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.getByRole('link', { name: 'Quick Start', exact: true }).first().click()
  await expect(page).toHaveURL(/\/docs\/quick-start$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(errors).toEqual([])
})

test('the production search index resolves a backend document under the base path', async ({ page }) => {
  await page.goto('/docs')
  await page.getByRole('combobox').fill('Ollama')
  const result = page.locator('.nextra-search-results a[href^="/docs/backends/ollama"]').first()
  await expect(result).toBeVisible({ timeout: 15_000 })
  await result.click()
  await expect(page).toHaveURL(/\/docs\/backends\/ollama(?:#.*)?$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connect Ollama')
})

test('validator data-flow diagrams render instead of empty or error placeholders', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/docs/validator-node')
  await page.getByRole('heading', { name: /Validator Data Flow/ }).evaluate(element => element.scrollIntoView({ block: 'start' }))
  const diagram = page.locator('main svg.flowchart').first()
  await expect(diagram).toBeVisible({ timeout: 20_000 })
  expect(await diagram.locator('path').count()).toBeGreaterThan(0)
  expect(errors).toEqual([])
})

test('responsive headers and document content do not overlap or overflow', async ({ page }, testInfo) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/docs')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `body at ${width}px`).toBe(true)
    const overlap = await page.locator('header a, header button, header input[role="combobox"]').evaluateAll(elements => {
      const boxes = elements.map(element => element.getBoundingClientRect()).filter(box => box.width && box.height)
      return boxes.some((a, i) => boxes.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1))
    })
    expect(overlap, `header at ${width}px`).toBe(false)
    await page.screenshot({ path: testInfo.outputPath(`docs-${width}.png`) })
  }
})

test('the mobile menu can open and navigate to a worker guide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/docs')
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('link', { name: 'Text Worker', exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/worker-llm$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
