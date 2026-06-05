import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { ToolGrid } from "@/features/ai-lab";
import { aiLabTools } from "@/lib/ai-lab/tools";
import {
  breadcrumbJsonLd,
  learningResourceJsonLd,
} from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("aiLab", {
  title: "AI Lab | Interactive AI Engineering Experiments",
});

const AI_LAB_KEYWORDS = Array.from(
  new Set(aiLabTools.flatMap((tool) => tool.tags))
);

export default function AiLabPage() {
  return (
    <>
      <JsonLdScript
        data={[
          learningResourceJsonLd({
            title: "AI Lab — Interactive AI Engineering Experiments",
            description:
              "Interactive tools and visualizations that explain how modern AI systems work, from retrieval pipelines and embeddings to search, reasoning, and system design.",
            path: "/ai-lab",
            keywords: AI_LAB_KEYWORDS,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Lab", path: "/ai-lab" },
          ]),
        ]}
      />
      <PageShell>
        <Section>
          <div className="flex flex-col gap-12">
            {/* Hero */}
            <header className="flex max-w-3xl flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
                <FlaskConical size={13} />
                AI Lab
              </span>
              <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[40px]">
                Interactive AI engineering experiments
              </h1>
              <p className="text-[15px] leading-relaxed text-[var(--color-secondary)] sm:text-[16px]">
                Interactive tools and visualizations that explain how modern AI
                systems work — from retrieval pipelines and embeddings to
                search, reasoning, and system design.
              </p>
              <p className="text-[13.5px] leading-relaxed text-[var(--color-muted)]">
                This space contains hands-on AI engineering experiments built to
                make complex concepts easier to understand through visualization
                and interaction.
              </p>
            </header>

            {/* Tools */}
            <div className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  Tools &amp; experiments
                </h2>
              </div>
              <ToolGrid />
            </div>
          </div>
        </Section>
      </PageShell>
    </>
  );
}
