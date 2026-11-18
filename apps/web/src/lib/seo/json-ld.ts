import { siteConfig } from "@/lib/constants/site";
import { localeLanguageTags, getPublicLocales } from "@/lib/i18n/config";
import { seoConfig } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

type JsonLd = Record<string, unknown>;

const PERSON_ID = "https://shriyashsharma.com/#person";

function personEntity(): JsonLd {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.author.name,
    alternateName: "Shriyash",
    url: absoluteUrl("/about"),
    mainEntityOfPage: absoluteUrl("/"),
    email: `mailto:${siteConfig.author.email}`,
    image: absoluteUrl(siteConfig.brand.portrait),
    jobTitle: seoConfig.jobTitle,
    hasOccupation: {
      "@type": "Occupation",
      name: seoConfig.jobTitle,
      occupationalCategory: "Software Engineering",
      skills: [...seoConfig.knowsAbout],
    },
    worksFor: {
      "@type": "Organization",
      name: seoConfig.employer.name,
      url: seoConfig.employer.url,
    },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressCountry: "IN",
      },
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.x],
    knowsAbout: [...seoConfig.knowsAbout],
    description: seoConfig.positioning,
  };
}

export function personJsonLd(): JsonLd {
  return { "@context": "https://schema.org", ...personEntity() };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: getPublicLocales().map((locale) => localeLanguageTags[locale]),
    publisher: { "@id": PERSON_ID },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    image: absoluteUrl(siteConfig.ogImage.url),
    inLanguage: "en",
  };
}

export function techArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  about,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  /** Software the article is about, emitted as a SoftwareApplication. */
  about?: { name: string; url: string };
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: absoluteUrl(siteConfig.ogImage.url),
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    ...(about
      ? {
          about: {
            "@type": "SoftwareApplication",
            name: about.name,
            url: about.url,
          },
        }
      : {}),
  };
}

export function creativeWorkJsonLd({
  title,
  description,
  path,
  datePublished,
  github,
  live,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  github?: string;
  live?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    author: { "@id": PERSON_ID },
    sameAs: [github, live].filter(Boolean),
  };
}

export function projectJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  github,
  live,
  stack,
  applicationCategory,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  github?: string;
  live?: string;
  stack?: string[];
  applicationCategory?: string;
}): JsonLd {
  if (live || applicationCategory) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title,
      description,
      url: absoluteUrl(path),
      datePublished,
      dateModified: dateModified ?? datePublished,
      applicationCategory: applicationCategory ?? "WebApplication",
      operatingSystem: "Any",
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      softwareRequirements: stack?.join(", "),
      sameAs: [github, live].filter(Boolean),
    };
  }

  return creativeWorkJsonLd({
    title,
    description,
    path,
    datePublished,
    github,
    live,
  });
}

export function learningResourceJsonLd({
  title,
  description,
  path,
  keywords,
  educationalLevel = "Beginner",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  educationalLevel?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: absoluteUrl(path),
    learningResourceType: "Interactive tool",
    educationalLevel,
    inLanguage: "en",
    keywords: keywords?.join(", "),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isAccessibleForFree: true,
  };
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** /about — ProfilePage (a schema.org AboutPage subtype for a single person). */
export function profilePageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfilePage", "AboutPage"],
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "en",
    mainEntity: personEntity(),
  };
}

export function contactPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "en",
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "professional inquiries",
      email: siteConfig.author.email,
      url: absoluteUrl(path),
      availableLanguage: ["en"],
    },
  };
}

export function itemListJsonLd({
  name,
  path,
  items,
}: {
  name: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function homePageJsonLdGraph(): JsonLd[] {
  return [
    { "@context": "https://schema.org", ...personEntity() },
    websiteJsonLd(),
  ];
}
