import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <img src="/logo.png" alt="AIPG" style={{ height: '28px', width: 'auto' }} />
      <span style={{ fontWeight: 600, fontSize: '1rem' }}>Docs</span>
    </div>
  ),

  project: {
    link: 'https://github.com/AIPowerGrid',
  },

  chat: {
    link: 'https://discord.gg/W9D8j6HCtC',
  },

  docsRepositoryBase: 'https://github.com/AIPowerGrid/aipg-documentation/tree/main',

  // Force dark mode
  darkMode: false,
  nextThemes: {
    defaultTheme: 'dark',
    forcedTheme: 'dark',
  },

  // Custom navbar items linking back to main site
  navbar: {
    extraContent: (
      <div className="nav-extra-links">
        <a href="https://aipowergrid.io" target="_blank" rel="noopener noreferrer">
          Home
        </a>
        <a href="https://aipowergrid.io/about" target="_blank" rel="noopener noreferrer">
          About
        </a>
        <a href="https://aipg.art" target="_blank" rel="noopener noreferrer" className="hide-mobile">
          Art
        </a>
        <a href="https://aipg.chat" target="_blank" rel="noopener noreferrer" className="hide-mobile">
          Chat
        </a>
        <a href="https://explorer.aipowergrid.io" target="_blank" rel="noopener noreferrer">
          Explorer
        </a>
      </div>
    ),
  },

  // Main SEO
  useNextSeoProps() {
    return {
      titleTemplate: '%s – AI Power Grid',
      title: 'AI Power Grid Docs',
      description: 'Documentation for The Grid - decentralized AI inference on Base. Generate images, chat with LLMs, run workers, and build on open-source AI infrastructure.',
      openGraph: {
        type: 'website',
        url: 'https://docs.aipowergrid.io/',
        title: 'AI Power Grid Documentation',
        description: 'Documentation for The Grid - decentralized AI inference on Base.',
        images: [
          {
            url: 'https://docs.aipowergrid.io/og-image.webp',
            width: 1200,
            height: 630,
            alt: 'AI Power Grid'
          }
        ]
      },
      twitter: {
        cardType: 'summary_large_image',
        site: '@AIPowerGrid',
        handle: '@AIPowerGrid'
      }
    }
  },

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0a0a0b" />
      <meta property="og:image" content="https://docs.aipowergrid.io/og-image.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content="https://docs.aipowergrid.io/og-image.webp" />
      <link rel="icon" href="/logo.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  ),

  footer: {
    text: `${new Date().getFullYear()} © AI Power Grid`,
  },

  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },

  toc: {
    float: true,
  },

  editLink: {
    text: 'Edit this page on GitHub →',
  },

  feedback: {
    content: 'Questions? Join Discord →',
    labels: 'feedback',
  },

  navigation: {
    prev: true,
    next: true,
  },

  gitTimestamp: ({ timestamp }) => (
    <span>Last updated: {timestamp.toLocaleDateString()}</span>
  ),
}

export default config
