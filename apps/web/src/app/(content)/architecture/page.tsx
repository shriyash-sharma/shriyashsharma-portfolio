import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicContentList } from "@/components/content/public-content-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getArchitectureNotes } from "@/lib/services/content-service";

export const metadata: Metadata = pageMetadata("architecture");

export default async function ArchitecturePage() {
  const notes = await getArchitectureNotes();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Platform"
          heading="Architecture"
          subheading="System topology, ADR-style decisions, AI assistant foundations, and platform evolution."
          entries={notes}
          hrefBase="/architecture"
          emptyLabel="No published architecture notes yet."
        />
      </Section>
    </PageShell>
  );
}
