import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo/metadata";
import { aiCapabilities } from "@/lib/ai/capabilities";
import { contentCollections } from "@/lib/content/registry";

export const metadata: Metadata = buildMetadata({
  title: "Architecture",
  description:
    "Platform architecture notes for backend integration, content systems, and future AI capabilities.",
  path: "/architecture",
});

const layers = [
  {
    title: "Frontend product layer",
    description:
      "Next.js App Router stays Server Component-first. Client components remain leaf-level for motion, language switching, and future interactive tooling.",
  },
  {
    title: "Backend integration boundary",
    description:
      "Typed endpoint wrappers call FastAPI through a single HTTP client that owns timeout, auth token, and error behavior.",
  },
  {
    title: "Content and indexing layer",
    description:
      "Structured content collections keep projects, case studies, articles, architecture notes, and research logs ready for CMS and retrieval indexing.",
  },
  {
    title: "AI service boundary",
    description:
      "Semantic search, assistant streaming, ingestion, and observability are modeled as capabilities, not coupled directly into UI components.",
  },
];

export default function ArchitecturePage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Systems"
          heading="Platform Architecture"
          subheading="A backend-ready foundation for content, dashboard tooling, semantic search, and future AI capabilities."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {layers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <h2 className="text-[15px] font-medium text-[var(--color-foreground)]">
                {layer.title}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--color-muted)]">
                {layer.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-[15px] font-medium text-[var(--color-foreground)]">
              Content collections
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {contentCollections.map((collection) => (
                <span
                  key={collection.type}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[12px] text-[var(--color-muted)]"
                >
                  {collection.type}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-[15px] font-medium text-[var(--color-foreground)]">
              AI readiness
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {aiCapabilities.map((capability) => (
                <span
                  key={capability.id}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[12px] text-[var(--color-muted)]"
                >
                  {capability.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
