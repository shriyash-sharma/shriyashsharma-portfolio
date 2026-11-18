import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants/site";
import {
  defaultLocale,
  getPublicLocales,
  localeLanguageTags,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { absoluteUrl, resolveMetadataBase } from "@/lib/seo/urls";

export type MetadataOverrides = {
  title?: string;
  /** Full title rendered verbatim, without the brand suffix. */
  absoluteTitle?: string;
  description?: string;
  image?: string;
  path?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  locale?: Locale;
  openGraphType?: "website" | "article";
};

/** Per-route SEO copy for public marketing and content index pages. */
export const pageSeo = {
  projects: {
    title: "Projects",
    description:
      "Projects by Shriyash Sharma, AI Engineer: Next.js platforms, RAG pipelines, pgvector semantic search, and AI-assisted products built for real users.",
    path: "/projects",
  },
  caseStudies: {
    title: "Case Studies",
    description:
      "Engineering case studies by Shriyash Sharma on architecture decisions, RAG pipelines, delivery trade-offs, and measurable product outcomes.",
    path: "/case-studies",
  },
  blog: {
    title: "Blog",
    description:
      "Technical writing by Shriyash Sharma on AI engineering, RAG, embeddings, vector search, and building production Next.js platforms.",
    path: "/blog",
  },
  architecture: {
    title: "Architecture",
    description:
      "Architecture notes on APIs, RAG systems, content pipelines, and platform design decisions behind Shriyash Sharma's AI portfolio platform.",
    path: "/architecture",
  },
  about: {
    title: "About",
    // Rendered verbatim (no brand suffix) to avoid "About Shriyash Sharma — Shriyash Sharma".
    absoluteTitle: "About | Shriyash Sharma, AI Engineer",
    description:
      "Shriyash Sharma is an AI Engineer and GenAI full-stack engineer in Pune with 8+ years building React and Next.js products, RAG systems, and AI pods.",
    path: "/about",
  },
  speaking: {
    title: "Speaking",
    description:
      "Internal tech talks and knowledge sessions by Shriyash Sharma on React, Next.js, RAG, AI-assisted engineering, and frontend architecture.",
    path: "/speaking",
  },
  contact: {
    title: "Contact",
    description:
      "Contact Shriyash Sharma about AI Engineer, GenAI full-stack, and senior engineering roles. Send a message, view the resume, or connect on LinkedIn.",
    path: "/contact",
  },
  assistant: {
    title: "AI assistant",
    description:
      "Chat with the portfolio's AI guide. Answers are grounded in indexed projects, case studies, architecture notes, and articles.",
    path: "/assistant",
  },
  aiLab: {
    title: "AI Lab",
    description:
      "Learn RAG, embeddings, and vector search interactively in Shriyash Sharma's AI Lab: hands-on tools that explain modern AI system architecture.",
    path: "/ai-lab",
  },
  aiLabRagExplorer: {
    title: "RAG Explorer",
    description:
      "Interactive RAG tutorial: visualize chunking, embeddings, vector search, retrieval, and grounded answer generation step by step.",
    path: "/ai-lab/rag-explorer",
  },
  aiLabContextWindowVisualizer: {
    title: "Context Window Visualizer",
    description:
      "Estimate tokens, compare LLM context limits, and simulate truncation to see why RAG is needed for large documents.",
    path: "/ai-lab/context-window-visualizer",
  },
  aiLabSemanticSearchPlayground: {
    title: "Semantic Search Playground",
    description:
      "Compare keyword matching with embeddings and cosine similarity, and see how retrieval works in modern RAG systems.",
    path: "/ai-lab/semantic-search-playground",
  },
  aiLabEmbeddingVisualizer: {
    title: "Embedding Visualizer",
    description:
      "Explore embeddings and semantic similarity with vector-space clusters and nearest-neighbor comparisons, and see how they power RAG.",
    path: "/ai-lab/embedding-visualizer",
  },
} as const;

export type PageSeoKey = keyof typeof pageSeo;

export function buildMetadata(overrides: MetadataOverrides = {}): Metadata {
  const locale = overrides.locale ?? defaultLocale;
  const dictionary = getDictionary(locale);
  const title =
    overrides.absoluteTitle ??
    (overrides.title ? `${overrides.title} — ${siteConfig.name}` : dictionary.meta.title);
  const description = overrides.description ?? dictionary.meta.description;
  const image = overrides.image
    ? { url: overrides.image, alt: title }
    : siteConfig.ogImage;
  const path = overrides.path ?? "/";
  const canonical = overrides.canonicalUrl ?? absoluteUrl(path);

  const publicLocales = getPublicLocales();
  const languageAlternates =
    publicLocales.length > 1
      ? Object.fromEntries(
          publicLocales.map((item) => [
            localeLanguageTags[item],
            absoluteUrl(localizePath(path, item)),
          ])
        )
      : undefined;

  return {
    title: {
      // `absolute` renders this exact string and ignores any ancestor
      // `title.template`, preventing the brand suffix from being appended twice
      // (root layout + page both build a fully-branded title).
      absolute: title,
    },
    description,
    applicationName: siteConfig.name,
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    // Favicon: src/app/icon.png (512) and apple-icon.png (180) — square, trimmed, light bg.
    metadataBase: resolveMetadataBase(),
    alternates: {
      canonical,
      ...(languageAlternates
        ? {
            languages: {
              ...languageAlternates,
              "x-default": absoluteUrl(localizePath(path, defaultLocale)),
            },
          }
        : {}),
    },
    openGraph: {
      type: overrides.openGraphType ?? "website",
      locale: localeLanguageTags[locale].replace("-", "_"),
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: siteConfig.author.twitter,
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
    absoluteTitle: "absoluteTitle" in page ? page.absoluteTitle : undefined,
    description: page.description,
    path: page.path,
    ...overrides,
  });
}
