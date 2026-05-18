import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicProjectList } from "@/components/content/public-project-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { hasBackendUrl } from "@/lib/api/backend-url";
import { getProjects } from "@/lib/services/project-service";

export const metadata: Metadata = pageMetadata("projects");

export default async function ProjectsPage() {
  const projects = await getProjects();
  const backendConfigured = hasBackendUrl();

  return (
    <PageShell>
      <Section>
        <PublicProjectList
          projects={projects}
          backendConfigured={backendConfigured}
        />
      </Section>
    </PageShell>
  );
}
