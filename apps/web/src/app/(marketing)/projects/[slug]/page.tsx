import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProjectDetail } from "@/components/content/public-project-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo/metadata";
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
    return buildMetadata({ title: "Projects", path: "/projects" });
  }

  return buildMetadata({
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

  return (
    <PageShell>
      <Section>
        <PublicProjectDetail project={project} />
      </Section>
    </PageShell>
  );
}