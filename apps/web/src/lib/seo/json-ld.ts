import { siteConfig } from "@/lib/constants/site";
import { localeLanguageTags, locales } from "@/lib/i18n/config";
import { seoConfig } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

type JsonLd = Record<string, unknown>;

function personEntity(): JsonLd {
  return {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: siteConfig.author.name,
    url: absoluteUrl("/"),
    email: siteConfig.author.email,
    image: absoluteUrl(siteConfig.brand.logo),
    jobTitle: "Senior Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: seoConfig.employer.name,
      url: seoConfig.employer.url,
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
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
    inLanguage: locales.map((locale) => localeLanguageTags[locale]),
    publisher: { "@id": absoluteUrl("/#person") },
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
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#person") },
    image: absoluteUrl(siteConfig.brand.logo),
    inLanguage: "en",
  };
}

export function techArticleJsonLd({
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
    "@type": "TechArticle",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#person") },
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
    author: { "@id": absoluteUrl("/#person") },
    sameAs: [github, live].filter(Boolean),
  };
}

export function homePageJsonLdGraph(): JsonLd[] {
  return [
    { "@context": "https://schema.org", ...personEntity() },
    websiteJsonLd(),
  ];
}
