import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicContentList } from "@/components/content/public-content-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getArchitectureNotes } from "@/lib/services/content-service";

export const metadata: Metadata = pageMetadata("architecture");
export const revalidate = 300;

export default async function ArchitecturePage() {
  const notes = await getArchitectureNotes();

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Architecture", path: "/architecture" },
        ])}
      />
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
    </>
  );
}
