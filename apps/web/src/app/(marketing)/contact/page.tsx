import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Shriyash Sharma.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Let's talk"
          heading="Contact"
          subheading="Open to senior engineering roles, consulting, and interesting projects."
        />
      </Section>
    </PageShell>
  );
}
