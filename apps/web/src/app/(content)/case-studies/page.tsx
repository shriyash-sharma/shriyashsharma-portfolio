import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { PublicContentList } from "@/components/content/public-content-list";
import { getCaseStudies } from "@/lib/services/content-service";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Detailed engineering breakdowns of systems, architecture decisions, and outcomes.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Deep dives"
          heading="Case Studies"
          subheading="Published engineering breakdowns, architecture tradeoffs, and implementation outcomes from the content platform."
          entries={caseStudies}
          hrefBase="/case-studies"
          emptyLabel="No published case studies yet. Publish a case study from the dashboard to make it appear here."
        />
      </Section>
    </PageShell>
  );
}
