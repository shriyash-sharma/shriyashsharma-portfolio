import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicContentList } from "@/components/content/public-content-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getCaseStudies } from "@/lib/services/content-service";

export const metadata: Metadata = pageMetadata("caseStudies");

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Work"
          heading="Case Studies"
          subheading="Published case studies from the content system, including shipped work, architecture context, and linked projects."
          entries={caseStudies}
          hrefBase="/case-studies"
          emptyLabel="No published case studies yet."
        />
      </Section>
    </PageShell>
  );
}
