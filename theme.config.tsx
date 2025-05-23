import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>AI Power Grid</span>,
  project: {
    link: 'https://github.com/AIPowerGrid/aipg-documentation',
  },
  chat: {
    link: 'https://discord.gg/W9D8j6HCtC',
  },
  docsRepositoryBase: 'https://github.com/AIPowerGrid/aipg-documentation',

  // Main SEO Titles and Open Graph Tags
  useNextSeoProps() {
    return {
      titleTemplate: 'AI Power Grid Docs - %s',
      title: 'Democratizing Open Source Generative AI',
      description: 'Revolutionizing the AI landscape with open access to blockchain-validated and incentivized generative AI models, fostering adoption, innovation, creativity, and community-driven growth.',
      openGraph: {
        type: 'website',
        url: 'https://aipowergrid.io/',
        title: 'AI Power Grid - Democratizing Open Source Generative AI',
        description: 'Revolutionizing the AI landscape with open access to blockchain-validated and incentivized generative AI models, fostering adoption, innovation, creativity, and community-driven growth.',
        images: [
          {
            url: 'https://aipowergrid.io/Banner-Backgrounds/aipg%20Wallpaper%20V3%20(57).png',
            width: 1200,
            height: 630,
            alt: 'AI Power Grid Open Graph Image'
          }
        ]
      },
      twitter: {
        cardType: 'summary_large_image',
        site: 'aipowergrid.io',
        handle: '@AIPowerGrid'
      }
    }
  },

  // Custom Head Tags (for favicon and viewport settings)
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="AI Power Grid - Democratizing Open Source Generative AI" />
      <meta property="og:description" content="Revolutionizing the AI landscape with open access to blockchain-validated and incentivized generative AI models, fostering adoption, innovation, creativity, and community-driven growth." />
      <meta property="og:url" content="https://aipowergrid.io" />
      <meta property="og:image" content="https://aipowergrid.io/Banner-Backgrounds/aipg%20Wallpaper%20V3%20(57).png" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="AI Power Grid - Democratizing Open Source Generative AI" />
      <meta name="twitter:description" content="Revolutionizing the AI landscape with open access to blockchain-validated and incentivized generative AI models, fostering adoption, innovation, creativity, and community-driven growth." />
      <meta name="twitter:image" content="https://aipowergrid.io/Banner-Backgrounds/aipg%20Wallpaper%20V3%20(57).png" />
      <meta property="twitter:domain" content="aipowergrid.io" />
      <meta property="twitter:url" content="https://aipowergrid.io" />
      
      <link rel="icon" href="/favicon.ico" />
    </>
  ),

  footer: {
    text: 'AI Power Grid Documentation - Democratizing Open Source Generative AI',
  },
}

export default config
