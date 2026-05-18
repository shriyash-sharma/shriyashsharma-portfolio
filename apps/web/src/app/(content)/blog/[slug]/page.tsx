import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo/metadata";
import { getBlogPost } from "@/lib/services/content-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const post = await getBlogPost(slug);

  if (!post) {
    return buildMetadata({ title: "Blog", path: "/blog" });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: RouteContext) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageShell>
      <Section>
        <PublicContentDetail
          entry={post}
          backHref="/blog"
          backLabel="Back to blog"
        />
      </Section>
    </PageShell>
  );
}