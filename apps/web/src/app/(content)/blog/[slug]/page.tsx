import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { ContextualAssistantCta } from "@/features/assistant";
import { buildContentMetadata } from "@/lib/seo/content-metadata";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { contentStaticParams } from "@/lib/build/static-generation";
import { getBlogPost, getBlogPosts } from "@/lib/services/content-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return contentStaticParams(getBlogPosts, (post) => post.slug);
}

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const post = await getBlogPost(slug);

  if (!post) {
    return pageMetadata("blog");
  }

  return buildContentMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/blog/${post.slug}`,
    canonicalUrl: post.canonicalUrl ?? undefined,
    openGraphType: "article",
  });
}

export default async function BlogPostPage({ params }: RouteContext) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLdScript
        data={[
          blogPostingJsonLd({
            title: post.title,
            description: post.description,
            path,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          }),
          breadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        ]}
      />
      <PageShell>
        <Section>
          <PublicContentDetail
            entry={post}
            backHref="/blog"
            backLabel="Back to blog"
          />
          <ContextualAssistantCta
            eyebrow="Explore with AI"
            prompts={[
              `Summarize the blog post "${post.title}".`,
              `What are the key takeaways from "${post.title}"?`,
              `How does "${post.title}" relate to the rest of the portfolio?`,
            ]}
          />
        </Section>
      </PageShell>
    </>
  );
}
