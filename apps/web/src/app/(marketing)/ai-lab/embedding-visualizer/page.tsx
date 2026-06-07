import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Boxes } from "lucide-react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import {
  EmbeddingSeoContent,
  EmbeddingVisualizer,
} from "@/features/ai-lab";
import { EMBEDDING_VISUALIZER_FAQ } from "@/lib/ai-lab/embedding-visualizer";
import { EMBEDDING_VISUALIZER_KEYWORDS } from "@/lib/ai-lab/tools";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  learningResourceJsonLd,
  techArticleJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("aiLabEmbeddingVisualizer", {
  title: "Embedding Visualizer | Learn Vector Embeddings and Semantic Similarity",
  description:
    "Embeddings explained interactively: visualize vector embeddings, explore semantic similarity clusters, compare nearest neighbors, and learn how embeddings power RAG and vector search.",
  openGraphType: "article",
});

const PUBLISHED_AT = "2026-06-08";

export default function EmbeddingVisualizerPage() {
  return (
    <>
      <JsonLdScript
        data={[
          learningResourceJsonLd({
            title:
              "Embedding Visualizer — Learn Vector Embeddings and Semantic Similarity",
            description:
              "Interactive tool to explore how AI converts text into vectors, visualize semantic clusters, compare similarity scores, and understand how embeddings power RAG and vector search.",
            path: "/ai-lab/embedding-visualizer",
            keywords: EMBEDDING_VISUALIZER_KEYWORDS,
          }),
          techArticleJsonLd({
            title:
              "Embeddings Explained — Vector Representations, Semantic Similarity, and RAG",
            description:
              "A practical guide to embeddings: what they are, how semantic similarity works, why concepts cluster in vector space, and how retrieval systems use embeddings for grounded AI answers.",
            path: "/ai-lab/embedding-visualizer",
            datePublished: PUBLISHED_AT,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Lab", path: "/ai-lab" },
            {
              name: "Embedding Visualizer",
              path: "/ai-lab/embedding-visualizer",
            },
          ]),
          faqPageJsonLd([...EMBEDDING_VISUALIZER_FAQ]),
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
                <Boxes size={13} />
                Embedding Visualizer
              </span>
              <h1 className="max-w-3xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[36px]">
                Embedding Visualizer: Explore Vector Embeddings and Semantic
                Similarity
              </h1>
              <p className="max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-secondary)] sm:text-[15.5px]">
                Learn what embeddings are through a curated vector space where
                animals, vehicles, technology, AI concepts, and business terms
                form distinct clusters. Compare semantic similarity, inspect
                nearest neighbors, and see how vector search retrieves meaning
                instead of keywords.
              </p>
              <p className="max-w-3xl text-[13.5px] leading-relaxed text-[var(--color-muted)]">
                This page includes an interactive scatter plot plus a full
                educational guide on embeddings explained, semantic similarity,
                embedding visualization, and embeddings in RAG—written for
                search engines and readers alike.
              </p>
            </header>

            <EmbeddingVisualizer />
          </div>
        </Section>
        <EmbeddingSeoContent />
      </PageShell>
    </>
  );
}
