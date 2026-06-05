import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Workflow } from "lucide-react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { RagExplorer, RagSeoContent } from "@/features/ai-lab";
import { RAG_EXPLORER_KEYWORDS } from "@/lib/ai-lab/tools";
import {
  breadcrumbJsonLd,
  learningResourceJsonLd,
  techArticleJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("aiLabRagExplorer", {
  title: "RAG Explorer | Learn Retrieval-Augmented Generation Step by Step",
});

const PUBLISHED_AT = "2026-06-05";

export default function RagExplorerPage() {
  return (
    <>
      <JsonLdScript
        data={[
          learningResourceJsonLd({
            title:
              "RAG Explorer — Learn Retrieval-Augmented Generation Step by Step",
            description:
              "Interactive visualization of chunking, embeddings, vector search, retrieval, prompt construction, and answer generation. Learn how modern RAG systems work internally.",
            path: "/ai-lab/rag-explorer",
            keywords: RAG_EXPLORER_KEYWORDS,
          }),
          techArticleJsonLd({
            title:
              "RAG Explorer — Retrieval-Augmented Generation Explained Step by Step",
            description:
              "Paste any text, ask a question, and watch a full RAG pipeline run: chunking, local embeddings, vector search, retrieval, prompt construction, and grounded answer generation.",
            path: "/ai-lab/rag-explorer",
            datePublished: PUBLISHED_AT,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Lab", path: "/ai-lab" },
            { name: "RAG Explorer", path: "/ai-lab/rag-explorer" },
          ]),
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
                <Workflow size={13} />
                RAG Explorer
              </span>
              <h1 className="max-w-3xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[36px]">
                Learn Retrieval-Augmented Generation, step by step
              </h1>
              <p className="max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-secondary)] sm:text-[15.5px]">
                Paste your own content, ask a question, and watch a complete RAG
                pipeline run end to end: chunking, embeddings, vector search,
                retrieval, prompt construction, and a grounded answer. Each step
                explains what it does and why it exists.
              </p>
            </header>

            <RagExplorer />
          </div>
        </Section>
        <RagSeoContent />
      </PageShell>
    </>
  );
}
