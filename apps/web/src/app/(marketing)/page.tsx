import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildMetadata } from "@/lib/seo/metadata";
import { homePageJsonLdGraph } from "@/lib/seo/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { HeroSection } from "@/features/home/components/hero-section";
import { FeaturedProjectsSection } from "@/features/home/components/featured-projects-section";
import { CaseStudiesSection } from "@/features/home/components/case-studies-section";
import { AssistantSection } from "@/features/home/components/assistant-section";
import { ContactCtaSection } from "@/features/home/components/contact-cta-section";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={homePageJsonLdGraph()} />
      <PageShell>
        <HeroSection />
        <FeaturedProjectsSection />
        <CaseStudiesSection />
        <AssistantSection />
        <ContactCtaSection />
      </PageShell>
    </>
  );
}
