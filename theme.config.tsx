import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <img src="/docs/logo.png" alt="AIPG" style={{ height: '28px', width: 'auto' }} />
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

  darkMode: false,
  nextThemes: {
    defaultTheme: 'dark',
    forcedTheme: 'dark',
  },

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

  head: (
    <>
      <title>AI Power Grid Docs</title>
      <meta name="description" content="Free AI for everyone. Documentation for The Grid — decentralized inference on Base." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0a0a0b" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="AI Power Grid Documentation" />
      <meta property="og:description" content="Free AI for everyone. Documentation for The Grid — decentralized inference on Base." />
      <meta property="og:url" content="https://aipowergrid.io/docs" />
      <meta property="og:image" content="https://aipowergrid.io/docs/og-image.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AIPowerGrid" />
      <meta name="twitter:image" content="https://aipowergrid.io/docs/og-image.webp" />
      <link rel="icon" href="/docs/logo.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  ),

  footer: {
    content: `${new Date().getFullYear()} © AI Power Grid`,
  },

  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },

  toc: {
    float: true,
  },

  editLink: {
    content: 'Edit this page on GitHub →',
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
