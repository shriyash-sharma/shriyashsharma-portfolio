import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants/site";
import {
  defaultLocale,
  localeLanguageTags,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { absoluteUrl, resolveMetadataBase } from "@/lib/seo/urls";

export type MetadataOverrides = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  locale?: Locale;
  openGraphType?: "website" | "article";
};

/** Per-route SEO copy for public marketing and content index pages. */
export const pageSeo = {
  projects: {
    title: "Projects",
    description:
      "Selected software projects — React, Next.js, FastAPI, and production system design.",
    path: "/projects",
  },
  caseStudies: {
    title: "Case Studies",
    description:
      "Engineering case studies on architecture decisions, delivery, and measurable outcomes.",
    path: "/case-studies",
  },
  blog: {
    title: "Blog",
    description:
      "Technical writing on modern web development, AI integration, and platform engineering.",
    path: "/blog",
  },
  architecture: {
    title: "Architecture",
    description:
      "Architecture notes on APIs, content systems, and platform design.",
    path: "/architecture",
  },
  about: {
    title: "About",
    description:
      "About Shriyash Sharma — Senior Software Engineer at Globant, speaker, and engineering mentor.",
    path: "/about",
  },
  speaking: {
    title: "Speaking",
    description:
      "Conference and team talks on React, Next.js, AI systems, and engineering leadership.",
    path: "/speaking",
  },
  contact: {
    title: "Contact",
    description: "Contact Shriyash Sharma for engineering roles, speaking, and collaboration.",
    path: "/contact",
  },
} as const;

export type PageSeoKey = keyof typeof pageSeo;

export function buildMetadata(overrides: MetadataOverrides = {}): Metadata {
  const locale = overrides.locale ?? defaultLocale;
  const dictionary = getDictionary(locale);
  const title = overrides.title
    ? `${overrides.title} — ${siteConfig.name}`
    : dictionary.meta.title;
  const description = overrides.description ?? dictionary.meta.description;
  const image = overrides.image ?? siteConfig.ogImage;
  const path = overrides.path ?? "/";
  const canonical = absoluteUrl(path);

  const languageAlternates = Object.fromEntries(
    locales.map((item) => [
      localeLanguageTags[item],
      absoluteUrl(localizePath(path, item)),
    ])
  );

  return {
    title: {
      default: title,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    applicationName: siteConfig.name,
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    // Favicon: src/app/icon.png (512) and apple-icon.png (180) — square, trimmed, light bg.
    metadataBase: resolveMetadataBase(),
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        "x-default": absoluteUrl(localizePath(path, defaultLocale)),
      },
    },
    openGraph: {
      type: overrides.openGraphType ?? "website",
      locale: localeLanguageTags[locale].replace("-", "_"),
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.author.twitter,
    },
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    authors: [{ name: siteConfig.author.name, url: absoluteUrl("/about") }],
  };
}

export function pageMetadata(
  key: PageSeoKey,
  overrides: MetadataOverrides = {}
): Metadata {
  const page = pageSeo[key];
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    ...overrides,
  });
}
