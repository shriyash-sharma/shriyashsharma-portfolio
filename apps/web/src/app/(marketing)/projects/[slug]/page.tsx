import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PublicProjectDetail } from "@/components/content/public-project-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { ContextualAssistantCta } from "@/features/assistant";
import { metadataAssistantQuestions } from "@/lib/content/metadata-helpers";
import { buildContentMetadata } from "@/lib/seo/content-metadata";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  getProjectDetail,
  getProjectStaticParams,
} from "@/lib/services/project-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getProjectStaticParams();
}

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const result = await getProjectDetail(slug);

  if (result.kind !== "found") {
    return pageMetadata("projects", { noIndex: result.kind === "unavailable" });
  }

  const { project } = result;

  return buildContentMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.description,
    path: `/projects/${project.slug}`,
    image: project.ogImage ?? project.heroImage,
    canonicalUrl: project.canonicalUrl ?? undefined,
  });
}

export default async function ProjectPage({ params }: RouteContext) {
  const { slug } = await params;
  const result = await getProjectDetail(slug);

  if (result.kind === "missing") {
    notFound();
  }

  if (result.kind === "unavailable") {
    return (
      <PageShell>
        <Section>
          <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Project detail unavailable
            </p>
            <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[44px]">
              The project detail service is temporarily unavailable.
            </h1>
            <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[var(--color-secondary)]">
              The project route is valid, but the CMS-backed detail fetch could not complete.
              Try again shortly or return to the projects index.
            </p>
            <div className="mt-6">
              <a
                href="/projects"
                className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-foreground)] underline underline-offset-4"
              >
                Back to projects
              </a>
            </div>
          </div>
        </Section>
      </PageShell>
    );
  }

  const { project } = result;
  const assistantQuestions = metadataAssistantQuestions(project.metadata);

  const path = `/projects/${project.slug}`;
  return (
    <>
      <JsonLdScript
        data={[
          projectJsonLd({
            title: project.title,
            description: project.description,
            path,
            datePublished: project.publishedAt,
            dateModified: project.updatedAt,
            github: project.links.github,
            live: project.links.live,
            stack: project.stack,
            applicationCategory: project.applicationCategory,
          }),
          breadcrumbJsonLd([
            { name: "Projects", path: "/projects" },
            { name: project.title, path },
          ]),
        ]}
      />
      <PageShell>
        <Section>
          <PublicProjectDetail project={project} />
          <ContextualAssistantCta
            eyebrow="Ask AI about this project"
            prompts={assistantQuestions}
          />
        </Section>
      </PageShell>
    </>
  );
}
