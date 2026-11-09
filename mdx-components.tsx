// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import type { MDXComponents } from 'mdx/types'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

const themeComponents = getThemeComponents()

export function useMDXComponents(components: MDXComponents = {}) {
  return { ...themeComponents, ...components }
}
