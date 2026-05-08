import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants/site";

type MetadataOverrides = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
};

/**
 * Central metadata factory.
 * Every route should call this to ensure consistent SEO output.
 *
 * Usage:
 *   export const metadata = buildMetadata({ title: "Projects", path: "/projects" });
 */
export function buildMetadata(overrides: MetadataOverrides = {}): Metadata {
  const title = overrides.title
    ? `${overrides.title} — ${siteConfig.name}`
    : siteConfig.title;

  const description = overrides.description ?? siteConfig.description;
  const image = overrides.image ?? siteConfig.ogImage;
  const url = overrides.path
    ? `${siteConfig.url}${overrides.path}`
    : siteConfig.url;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
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
