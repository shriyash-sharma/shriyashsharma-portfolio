import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { hasBackendUrl } from "@/lib/api/backend-url";
import {
  mapCaseStudiesToHomeCards,
  mapFeaturedProjectsToHomeCards,
} from "@/lib/content/home-cards";
import { buildMetadata } from "@/lib/seo/metadata";
import { homePageJsonLdGraph } from "@/lib/seo/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { HeroSection } from "@/features/home/components/hero-section";
import { FeaturedProjectsSection } from "@/features/home/components/featured-projects-section";
import { CaseStudiesSection } from "@/features/home/components/case-studies-section";
import { AssistantSection } from "@/features/home/components/assistant-section";
import { ContactCtaSection } from "@/features/home/components/contact-cta-section";
import { getCaseStudies } from "@/lib/services/content-service";
import { getProjects } from "@/lib/services/project-service";

export const metadata: Metadata = buildMetadata({ path: "/" });

/** Match other CMS pages: refresh home sections after deploy / API cold starts. */
export const revalidate = 300;

/** Homepage sections load published CMS content server-side (single source of truth). */
export default async function HomePage() {
  const backendConfigured = hasBackendUrl();
  const [projects, caseStudies] = await Promise.all([
    getProjects(),
    getCaseStudies(),
  ]);

  return (
    <>
      <JsonLdScript data={homePageJsonLdGraph()} />
      <PageShell>
        <HeroSection />
        <FeaturedProjectsSection
          projects={mapFeaturedProjectsToHomeCards(projects)}
          backendConfigured={backendConfigured}
        />
        <CaseStudiesSection
          caseStudies={mapCaseStudiesToHomeCards(caseStudies)}
          backendConfigured={backendConfigured}
        />
        <AssistantSection />
        <ContactCtaSection />
      </PageShell>
    </>
  );
}
