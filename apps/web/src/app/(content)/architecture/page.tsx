import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { PublicContentList } from "@/components/content/public-content-list";
import { buildMetadata } from "@/lib/seo/metadata";
import { getArchitectureNotes } from "@/lib/services/content-service";

export const metadata: Metadata = buildMetadata({
  title: "Architecture",
  description:
    "Platform architecture notes for backend integration, content systems, and future AI capabilities.",
  path: "/architecture",
});

export default async function ArchitecturePage() {
  const notes = await getArchitectureNotes();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Systems"
          heading="Architecture"
          subheading="Published architecture notes, platform decisions, and implementation references from the content system."
          entries={notes}
          hrefBase="/architecture"
          emptyLabel="No published architecture notes yet. Publish an architecture note from the dashboard to make it appear here."
        />
      </Section>
    </PageShell>
  );
}
