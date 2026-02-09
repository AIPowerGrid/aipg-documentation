import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{
      fontWeight: 700,
      fontSize: '1.25rem',
      letterSpacing: '-0.02em'
    }}>
      AI Power Grid
    </span>
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
            url: 'https://aipowergrid.io/Banner-Backgrounds/aipg%20Wallpaper%20V3%20(57).png',
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
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  ),

  footer: {
    text: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://aipowergrid.io" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>Home</a>
          <a href="https://aipg.art" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>Art</a>
          <a href="https://aipg.chat" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>Chat</a>
          <a href="https://discord.gg/W9D8j6HCtC" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>Discord</a>
          <a href="https://github.com/AIPowerGrid" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>GitHub</a>
          <a href="https://twitter.com/aipowergrid" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(240, 5%, 64.9%)' }}>Twitter</a>
        </div>
        <div style={{ textAlign: 'center', color: 'hsl(240, 5%, 50%)' }}>
          {new Date().getFullYear()} © AI Power Grid. Built on Base.
        </div>
      </div>
    ),
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
