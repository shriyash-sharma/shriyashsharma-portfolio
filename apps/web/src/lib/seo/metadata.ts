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

type MetadataOverrides = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  locale?: Locale;
};

/**
 * Central metadata factory.
 * Every route should call this to ensure consistent SEO output.
 *
 * Usage:
 *   export const metadata = buildMetadata({ title: "Projects", path: "/projects" });
 */
export function buildMetadata(overrides: MetadataOverrides = {}): Metadata {
  const locale = overrides.locale ?? defaultLocale;
  const dictionary = getDictionary(locale);
  const title = overrides.title
    ? `${overrides.title} — ${siteConfig.name}`
    : dictionary.meta.title;
  const description = overrides.description ?? dictionary.meta.description;
  const image = overrides.image ?? siteConfig.ogImage;
  const url = overrides.path
    ? `${siteConfig.url}${overrides.path}`
    : siteConfig.url;
  const path = overrides.path ?? "/";
  const languageAlternates = Object.fromEntries(
    locales.map((item) => [
      localeLanguageTags[item],
      `${siteConfig.url}${localizePath(path, item)}`,
    ])
  );

  return {
    title: {
      default: title,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    applicationName: siteConfig.name,
    category: "technology",
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        ...languageAlternates,
        "x-default": `${siteConfig.url}${localizePath(path, defaultLocale)}`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeLanguageTags[locale].replace("-", "_"),
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
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
    authors: [{ name: siteConfig.author.name }],
  };
}
