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
      "Engineering projects by Shriyash Sharma — Next.js, FastAPI, PostgreSQL, pgvector, semantic retrieval, RAG systems, and production system design.",
    path: "/projects",
  },
  caseStudies: {
    title: "Case Studies",
    description:
      "Engineering case studies by Shriyash Sharma on architecture decisions, RAG pipelines, delivery tradeoffs, and measurable outcomes.",
    path: "/case-studies",
  },
  blog: {
    title: "Blog",
    description:
      "Technical writing by Shriyash Sharma on AI engineering, RAG, FastAPI, PostgreSQL, and platform architecture.",
    path: "/blog",
  },
  architecture: {
    title: "Architecture",
    description:
      "Architecture notes on APIs, RAG systems, content pipelines, and platform design by Shriyash Sharma.",
    path: "/architecture",
  },
  about: {
    title: "About Shriyash Sharma",
    description:
      "Shriyash Sharma is a Senior Software Engineer and AI Engineer specializing in Next.js, FastAPI, PostgreSQL, RAG, semantic search, and SaaS architecture. Background, experience, TeamShastra, and AI Lab.",
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
  assistant: {
    title: "AI assistant",
    description:
      "Chat with the portfolio's AI guide. Answers are grounded in indexed projects, case studies, architecture notes, and articles.",
    path: "/assistant",
  },
  aiLab: {
    title: "AI Lab",
    description:
      "Learn RAG, embeddings, and vector search interactively. Shriyash Sharma's AI Lab explains Retrieval-Augmented Generation, semantic retrieval, and modern AI system architecture.",
    path: "/ai-lab",
  },
  aiLabRagExplorer: {
    title: "RAG Explorer",
    description:
      "Interactive RAG tutorial — visualize chunking, embeddings, vector search, retrieval, and grounded answer generation. Learn what RAG is and how modern retrieval systems work.",
    path: "/ai-lab/rag-explorer",
  },
  aiLabContextWindowVisualizer: {
    title: "Context Window Visualizer",
    description:
      "Interactive context window visualizer to estimate tokens, compare LLM limits, simulate truncation, and understand why RAG is needed for large documents.",
    path: "/ai-lab/context-window-visualizer",
  },
  aiLabSemanticSearchPlayground: {
    title: "Semantic Search Playground",
    description:
      "Interactive semantic search playground to compare keyword matching with embeddings and cosine similarity, and understand retrieval in modern RAG systems.",
    path: "/ai-lab/semantic-search-playground",
  },
  aiLabEmbeddingVisualizer: {
    title: "Embedding Visualizer",
    description:
      "Interactive embedding visualizer to explore vector space, semantic similarity clusters, nearest neighbors, and how embeddings power RAG and vector search.",
    path: "/ai-lab/embedding-visualizer",
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
