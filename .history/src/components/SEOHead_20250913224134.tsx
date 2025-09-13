import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  canonical?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Shriyash Sharma - Software Developer',
  description = 'Software Developer specializing in React, TypeScript, and Python. Looking for full-time roles.',
  keywords = 'software developer, react, typescript, python, web development, frontend, backend',
  ogImage = '/og-image.jpg',
  ogUrl,
  canonical,
}) => {
  const fullTitle = title.includes('Shriyash Sharma') ? title : `${title} | Shriyash Sharma`
  const fullOgUrl = ogUrl || window.location.href
  const fullCanonical = canonical || window.location.href

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Shriyash Sharma Portfolio" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Shriyash Sharma" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />
    </Helmet>
  )
}

export default SEOHead
