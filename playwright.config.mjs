// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  use: {
    baseURL: process.env.DOCS_TEST_URL || 'http://127.0.0.1:3047',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.DOCS_TEST_URL ? undefined : {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3047',
    url: 'http://127.0.0.1:3047/docs',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
