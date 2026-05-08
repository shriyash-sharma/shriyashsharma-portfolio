import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Writing on engineering, systems, and product thinking.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          eyebrow="Writing"
          heading="Blog"
          subheading="Engineering notes, deep dives, and system design perspectives. Coming soon."
        />
      </Section>
    </PageShell>
  );
}
