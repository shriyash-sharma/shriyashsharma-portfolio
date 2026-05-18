import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { buildContentMetadata } from "@/lib/seo/content-metadata";
import { breadcrumbJsonLd, techArticleJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getArchitectureNote } from "@/lib/services/content-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  context: RouteContext
): Promise<Metadata> {
  const { slug } = await context.params;
  const note = await getArchitectureNote(slug);

  if (!note) {
    return pageMetadata("architecture");
  }

  return buildContentMetadata({
    title: note.seoTitle ?? note.title,
    description: note.seoDescription ?? note.description,
    path: `/architecture/${note.slug}`,
    openGraphType: "article",
  });
}

export default async function ArchitectureNotePage({ params }: RouteContext) {
  const { slug } = await params;
  const note = await getArchitectureNote(slug);

  if (!note) {
    notFound();
  }

  const path = `/architecture/${note.slug}`;

  return (
    <>
      <JsonLdScript
        data={[
          techArticleJsonLd({
            title: note.title,
            description: note.description,
            path,
            datePublished: note.publishedAt,
            dateModified: note.updatedAt,
          }),
          breadcrumbJsonLd([
            { name: "Architecture", path: "/architecture" },
            { name: note.title, path },
          ]),
        ]}
      />
      <PageShell>
        <Section>
          <PublicContentDetail
            entry={note}
            backHref="/architecture"
            backLabel="Back to architecture"
          />
        </Section>
      </PageShell>
    </>
  );
}
