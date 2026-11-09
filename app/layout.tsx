// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'

const image = {
  url: 'https://aipowergrid.io/docs/social/developers-v1.png',
  width: 1730,
  height: 909,
  alt: 'Your next app. Powered by the Grid. Open models. One API. Text, image, video and music.',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aipowergrid.io'),
  title: { default: 'AI Power Grid Docs', template: '%s | AI Power Grid Docs' },
  description: 'One API for open text, image, video, and audio models, powered by community GPUs and settled on Base.',
  icons: { icon: '/docs/logo.png' },
  openGraph: {
    type: 'website',
    title: 'AI Power Grid Documentation',
    description: 'One API for open text, image, video, and audio models, powered by community GPUs and settled on Base.',
    url: 'https://aipowergrid.io/docs',
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AIPowerGrid',
    images: [{ url: image.url, alt: image.alt }],
  },
  alternates: {
    types: { 'text/markdown': 'https://aipowergrid.io/docs/llms.txt' },
  },
}

export const viewport: Viewport = { themeColor: '#000000' }

const navbar = (
  <Navbar
    className="docs-navbar"
    logo={<span className="docs-logo"><img src="/docs/logo.png" alt="AIPG" width={28} height={28} /><span>Docs</span></span>}
    projectLink="https://github.com/AIPowerGrid"
    chatLink="https://discord.gg/W9D8j6HCtC"
  >
    <div className="nav-extra-links">
      <a href="https://aipowergrid.io" target="_blank" rel="noopener noreferrer">Home</a>
      <a href="https://aipowergrid.io/about" target="_blank" rel="noopener noreferrer">About</a>
      <a href="https://aipg.art" target="_blank" rel="noopener noreferrer" className="hide-mobile">Art</a>
      <a href="https://aipg.chat" target="_blank" rel="noopener noreferrer" className="hide-mobile">Chat</a>
      <a href="https://explorer.aipowergrid.io" target="_blank" rel="noopener noreferrer">Explorer</a>
    </div>
  </Navbar>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#000000', light: '#ffffff' }}>
        <link rel="help" type="text/markdown" href="https://aipowergrid.io/.well-known/skills/grid/SKILL.md" title="AI Power Grid agent skill" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>{new Date().getFullYear()} &copy; AI Power Grid</Footer>}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/AIPowerGrid/aipg-documentation/tree/main"
          darkMode={false}
          copyPageButton={false}
          nextThemes={{ defaultTheme: 'dark', forcedTheme: 'dark' }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ float: true }}
          editLink="Edit this page on GitHub"
          feedback={{ content: 'Questions? Join Discord', link: 'https://discord.gg/W9D8j6HCtC', labels: 'feedback' }}
          navigation={{ prev: true, next: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
