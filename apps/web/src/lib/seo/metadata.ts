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
 * Resolves origins for resolving relative OG/icon URLs (`metadataBase`) without
 * breaking local dev — `siteConfig.url` alone would point `/favicon.ico` at production while on localhost.
 */
function resolveMetadataBaseOrigin(): URL {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (trimmed) {
    try {
      return new URL(trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed);
    } catch {
      // fall through
    }
  }
  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return new URL(`https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`);
  }
  if (process.env.NODE_ENV === "development") {
    return new URL("http://localhost:3000");
  }
  return new URL(siteConfig.url);
}

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
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: siteConfig.brand.logo, type: "image/png" },
      ],
      apple: [{ url: siteConfig.brand.logo, type: "image/png" }],
      shortcut: [{ url: siteConfig.brand.logo }],
    },
    metadataBase: resolveMetadataBaseOrigin(),
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
