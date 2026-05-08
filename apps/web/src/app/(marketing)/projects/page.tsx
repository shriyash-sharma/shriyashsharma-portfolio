import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PublicProjectList } from "@/components/content/public-project-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getProjects } from "@/lib/services/project-service";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "A collection of projects I have built or contributed to.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageShell>
      <Section>
        <PublicProjectList projects={projects} />
      </Section>
    </PageShell>
  );
}
