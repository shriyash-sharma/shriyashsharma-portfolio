import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "About Shriyash Sharma – software engineer and builder.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Background"
          heading="About"
          subheading="Software engineer, system designer, and occasional writer. Detail coming soon."
        />
      </Section>
    </PageShell>
  );
}
