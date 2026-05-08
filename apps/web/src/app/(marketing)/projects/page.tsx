import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "A collection of projects I have built or contributed to.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Work"
          heading="Projects"
          subheading="Things I have built, shipped, or contributed to. More detail coming soon."
        />
      </Section>
    </PageShell>
  );
}
