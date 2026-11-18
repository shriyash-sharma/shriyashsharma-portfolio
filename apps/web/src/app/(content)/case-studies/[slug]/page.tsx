import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { ContextualAssistantCta } from "@/features/assistant";
import {
  metadataAssistantQuestions,
  metadataString,
} from "@/lib/content/metadata-helpers";
import { siteConfig } from "@/lib/constants/site";
import { buildContentMetadata } from "@/lib/seo/content-metadata";
import { breadcrumbJsonLd, techArticleJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { contentStaticParams } from "@/lib/build/static-generation";
import { getCaseStudies, getCaseStudy } from "@/lib/services/content-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return contentStaticParams(getCaseStudies, (entry) => entry.slug);
}

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return pageMetadata("caseStudies");
  }

  const title = caseStudy.seoTitle ?? caseStudy.title;

  return buildContentMetadata({
    title,
    // An SEO title that already carries the brand is used as-is.
    absoluteTitle: title.includes(siteConfig.name) ? title : undefined,
    description: caseStudy.seoDescription ?? caseStudy.description,
    path: `/case-studies/${caseStudy.slug}`,
    canonicalUrl: caseStudy.canonicalUrl ?? undefined,
    openGraphType: "article",
  });
}

export default async function CaseStudyPage({ params }: RouteContext) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const path = `/case-studies/${caseStudy.slug}`;
  const assistantQuestions = metadataAssistantQuestions(caseStudy.metadata);
  const aboutName = metadataString(caseStudy.metadata, "about_name", "aboutName");
  const aboutUrl = metadataString(caseStudy.metadata, "about_url", "aboutUrl");

  return (
    <>
      <JsonLdScript
        data={[
          techArticleJsonLd({
            title: caseStudy.title,
            description: caseStudy.description,
            path,
            datePublished: caseStudy.publishedAt,
            dateModified: caseStudy.updatedAt,
            about:
              aboutName && aboutUrl
                ? { name: aboutName, url: aboutUrl }
                : undefined,
          }),
          breadcrumbJsonLd([
            { name: "Case Studies", path: "/case-studies" },
            { name: caseStudy.title, path },
          ]),
        ]}
      />
      <PageShell>
        <Section>
          <PublicContentDetail
            entry={caseStudy}
            backHref="/case-studies"
            backLabel="Back to case studies"
          />
          <ContextualAssistantCta
            eyebrow="Ask AI about this case study"
            prompts={assistantQuestions}
          />
        </Section>
      </PageShell>
    </>
  );
}
