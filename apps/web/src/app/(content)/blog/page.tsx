import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PublicContentList } from "@/components/content/public-content-list";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { getBlogPosts } from "@/lib/services/content-service";

export const metadata: Metadata = pageMetadata("blog");

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <PageShell>
      <Section>
        <PublicContentList
          eyebrow="Writing"
          heading="Blog"
          subheading="Engineering notes on React, Next.js, FastAPI, RAG systems, and product delivery."
          entries={posts}
          hrefBase="/blog"
          emptyLabel="No published posts yet."
        />
      </Section>
    </PageShell>
  );
}
