import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Detailed engineering breakdowns of systems, architecture decisions, and outcomes.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Deep dives"
          heading="Case Studies"
          subheading="Detailed engineering breakdowns. Coming soon."
        />
      </Section>
    </PageShell>
  );
}
