import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { HeroSection } from "@/features/home/components/hero-section";
import { FeaturedProjectsSection } from "@/features/home/components/featured-projects-section";
import { CaseStudiesSection } from "@/features/home/components/case-studies-section";
import { ContactCtaSection } from "@/features/home/components/contact-cta-section";
import { websiteJsonLd, personJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd(), personJsonLd()]),
        }}
      />

      <PageShell>
        {/* Hero – full viewport height, inside a container for alignment */}
        <Container>
          <HeroSection />
        </Container>

        {/* Sections */}
        <FeaturedProjectsSection />
        <CaseStudiesSection />
        <ContactCtaSection />
      </PageShell>
    </>
  );
}
