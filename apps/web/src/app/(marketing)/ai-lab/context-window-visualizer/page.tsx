import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import {
  ContextWindowSeoContent,
  ContextWindowVisualizer,
} from "@/features/ai-lab";
import { CONTEXT_WINDOW_FAQ } from "@/lib/ai-lab/context-window";
import { getAiLabMaxContentChars } from "@/lib/ai-lab/limits";
import { CONTEXT_WINDOW_VISUALIZER_KEYWORDS } from "@/lib/ai-lab/tools";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  learningResourceJsonLd,
  techArticleJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("aiLabContextWindowVisualizer", {
  title: "Context Window Visualizer | Learn Token Limits and Truncation",
});

const PUBLISHED_AT = "2026-06-07";
const CONTEXT_WINDOW_VISUALIZER_MAX_CONTENT_CHARS = 60_000;

export default function ContextWindowVisualizerPage() {
  const maxContentChars = Math.max(
    getAiLabMaxContentChars(),
    CONTEXT_WINDOW_VISUALIZER_MAX_CONTENT_CHARS
  );

  return (
    <>
      <JsonLdScript
        data={[
          learningResourceJsonLd({
            title:
              "Context Window Visualizer — Learn Token Limits and Truncation",
            description:
              "Interactive tool to estimate token usage, compare LLM context windows, simulate truncation, and learn why retrieval architectures are needed for large documents.",
            path: "/ai-lab/context-window-visualizer",
            keywords: CONTEXT_WINDOW_VISUALIZER_KEYWORDS,
          }),
          techArticleJsonLd({
            title:
              "Context Window Explained — Token Limits, Truncation, and Why RAG Exists",
            description:
              "A practical guide to LLM context windows: estimate tokens, compare model limits, visualize truncation risk, and understand why RAG improves reliability on large corpora.",
            path: "/ai-lab/context-window-visualizer",
            datePublished: PUBLISHED_AT,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Lab", path: "/ai-lab" },
            {
              name: "Context Window Visualizer",
              path: "/ai-lab/context-window-visualizer",
            },
          ]),
          faqPageJsonLd([...CONTEXT_WINDOW_FAQ]),
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
                <Layers size={13} />
                Context Window Visualizer
              </span>
              <h1 className="max-w-3xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[36px]">
                Understand Context Windows, Token Limits, and Truncation Risk
              </h1>
              <p className="max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-secondary)] sm:text-[15.5px]">
                Paste any text, estimate token usage, compare model limits, and
                simulate what happens when prompts outgrow an LLM context window.
                Learn why large contexts still need retrieval architecture.
              </p>
            </header>

            <ContextWindowVisualizer maxContentChars={maxContentChars} />
          </div>
        </Section>
        <ContextWindowSeoContent />
      </PageShell>
    </>
  );
}
