import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCaseStudy } from "@/lib/services/content-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return buildMetadata({ title: "Case Studies", path: "/case-studies" });
  }

  return buildMetadata({
    title: caseStudy.seoTitle ?? caseStudy.title,
    description: caseStudy.seoDescription ?? caseStudy.description,
    path: `/case-studies/${caseStudy.slug}`,
  });
}

export default async function CaseStudyPage({ params }: RouteContext) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <PageShell>
      <Section>
        <PublicContentDetail
          entry={caseStudy}
          backHref="/case-studies"
          backLabel="Back to case studies"
        />
      </Section>
    </PageShell>
  );
}