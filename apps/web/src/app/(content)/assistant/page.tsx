import type { Metadata } from "next";

import { AssistantPanel } from "@/features/assistant";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("assistant");

export default function AssistantPage() {
  return (
    <PageShell>
      <Section>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <header className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Platform
            </span>
            <h1 className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)]">
              Portfolio AI guide
            </h1>
            <p className="max-w-2xl text-[13.5px] text-[var(--color-secondary)]">
              A retrieval-augmented assistant that answers questions about this
              portfolio using indexed projects, case studies, architecture
              notes, and articles. Powered by FastAPI, pgvector, OpenAI
              embeddings, and Groq LLM inference.
            </p>
          </header>
          {/* Bounded height so the internal scroller overflows instead of
              the page growing with each new message. */}
          <div className="h-[min(72dvh,720px)] min-h-[420px]">
            <AssistantPanel className="h-full" />
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
