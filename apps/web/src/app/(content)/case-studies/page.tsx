import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicContentList } from "@/components/content/public-content-list";
import { ContentCrossLinks } from "@/components/content/content-cross-links";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getCaseStudies } from "@/lib/services/content-service";

export const metadata: Metadata = pageMetadata("caseStudies");
export const revalidate = 300;

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
      />
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
          <ContentCrossLinks
            links={[
              {
                href: "/projects",
                label: "Projects",
                description:
                  "Independent products and engineering systems linked to these case studies.",
              },
              {
                href: "/ai-lab",
                label: "AI Lab",
                description:
                  "Interactive tools to learn RAG, embeddings, and semantic search.",
              },
            ]}
          />
        </Section>
      </PageShell>
    </>
  );
}
