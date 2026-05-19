import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PublicProjectDetail } from "@/components/content/public-project-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { ContextualAssistantCta } from "@/features/assistant";
import { buildContentMetadata } from "@/lib/seo/content-metadata";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getProject } from "@/lib/services/project-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const project = await getProject(slug);

  if (!project) {
    return pageMetadata("projects");
  }

  return buildContentMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: RouteContext) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const path = `/projects/${project.slug}`;
  return (
    <>
      <JsonLdScript
        data={[
          creativeWorkJsonLd({
            title: project.title,
            description: project.description,
            path,
            datePublished: project.publishedAt,
            github: project.links.github,
            live: project.links.live,
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
            title={project.title}
            prompts={[
              `Summarize "${project.title}" in a paragraph.`,
              `What technical decisions stand out in "${project.title}"?`,
              `Which technologies were used to build "${project.title}"?`,
            ]}
          />
        </Section>
      </PageShell>
    </>
  );
}
