import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Network } from "lucide-react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import {
  SemanticSearchPlayground,
  SemanticSearchSeoContent,
} from "@/features/ai-lab";
import { SEMANTIC_SEARCH_FAQ } from "@/lib/ai-lab/semantic-search";
import { SEMANTIC_SEARCH_KEYWORDS } from "@/lib/ai-lab/tools";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  learningResourceJsonLd,
  techArticleJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata(
  "aiLabSemanticSearchPlayground",
  {
    title: "Semantic Search Playground | Compare Keyword vs Semantic Retrieval",
  }
);

const PUBLISHED_AT = "2026-06-08";

export default function SemanticSearchPlaygroundPage() {
  return (
    <>
      <JsonLdScript
        data={[
          learningResourceJsonLd({
            title:
              "Semantic Search Playground — Compare Keyword Search vs Semantic Search",
            description:
              "Interactive playground to compare lexical keyword matching with semantic vector retrieval, understand embeddings and cosine similarity, and connect retrieval to modern RAG systems.",
            path: "/ai-lab/semantic-search-playground",
            keywords: SEMANTIC_SEARCH_KEYWORDS,
          }),
          techArticleJsonLd({
            title:
              "Semantic Search Explained — Keyword Search vs Vector Retrieval in AI Systems",
            description:
              "Learn how semantic search works using embeddings and cosine similarity, compare it against keyword matching, and understand why retrieval quality drives RAG performance.",
            path: "/ai-lab/semantic-search-playground",
            datePublished: PUBLISHED_AT,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Lab", path: "/ai-lab" },
            {
              name: "Semantic Search Playground",
              path: "/ai-lab/semantic-search-playground",
            },
          ]),
          faqPageJsonLd([...SEMANTIC_SEARCH_FAQ]),
        ]}
      />
      <PageShell>
        <Section>
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4">
              <Link
                href="/ai-lab"
                className="inline-flex w-fit items-center gap-1.5 text-[12.5px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
              >
                <ArrowLeft size={14} />
                Back to AI Lab
              </Link>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
                <Network size={13} />
                Semantic Search Playground
              </span>
              <h1 className="max-w-3xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[36px]">
                Compare Keyword Search and Semantic Search on the Same Dataset
              </h1>
              <p className="max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-secondary)] sm:text-[15.5px]">
                Explore how lexical keyword matching differs from semantic vector
                retrieval. Run both approaches side by side, inspect ranked results,
                and build intuition for embeddings, cosine similarity, and modern
                RAG retrieval architecture.
              </p>
            </header>

            <SemanticSearchPlayground />
          </div>
        </Section>
        <SemanticSearchSeoContent />
      </PageShell>
    </>
  );
}
