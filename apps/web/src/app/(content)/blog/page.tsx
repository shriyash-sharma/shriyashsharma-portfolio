import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { PublicContentList } from "@/components/content/public-content-list";
import { getBlogPosts } from "@/lib/services/content-service";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Writing on engineering, systems, and product thinking.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Writing"
          heading="Blog"
          subheading="Published engineering notes, implementation essays, and system design writing from the content platform."
          entries={posts}
          hrefBase="/blog"
          emptyLabel="No published blog posts yet. Publish an article from the dashboard to make it appear here."
        />
      </Section>
    </PageShell>
  );
}
