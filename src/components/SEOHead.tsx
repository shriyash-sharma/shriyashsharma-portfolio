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
  title = 'Shiryash Sharma - Senior Software Developer | React.js, Next.js, Python Expert',
  description = 'Shiryash Sharma is a Senior Software Developer specializing in React.js, Next.js, Python, TypeScript, and full-stack development. Contact Shiryash Sharma for modern web applications and innovative solutions.',
  keywords = 'Shiryash Sharma, Shiryash Mannalal Sharma, shriyashsharma, Senior Software Developer, React.js, Next.js, Python, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, REST APIs, GraphQL, modern frontend architecture, full-stack development, web developer, software engineer, portfolio',
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
      <meta property="og:site_name" content="Shiryash Sharma Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@shriyashsharma" />
      <meta name="twitter:site" content="@shriyashsharma" />

      {/* Additional Meta Tags */}
      <meta name="author" content="Shiryash Sharma" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Shiryash Sharma",
          "alternateName": ["Shiryash Mannalal Sharma", "shriyashsharma"],
          "jobTitle": "Senior Software Developer",
          "description": "Senior Software Developer specializing in React.js, Next.js, Python, TypeScript, and full-stack development",
          "url": "https://shriyashsharma.com",
          "image": "https://shriyashsharma.com/og-image.jpg",
          "sameAs": [
            "https://github.com/shriyashsharma",
            "https://linkedin.com/in/shriyashsharma",
            "https://twitter.com/shriyashsharma"
          ],
          "knowsAbout": [
            "React.js",
            "Next.js", 
            "Python",
            "TypeScript",
            "JavaScript",
            "HTML5",
            "CSS3",
            "Tailwind CSS",
            "REST APIs",
            "GraphQL",
            "Modern Frontend Architecture",
            "Full-Stack Development"
          ],
          "alumniOf": "Software Development",
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance/Contract"
          },
          "email": "shriyash@shriyashsharma.com",
          "nationality": "Indian"
        })}
      </script>
    </Helmet>
  )
}

export default SEOHead
