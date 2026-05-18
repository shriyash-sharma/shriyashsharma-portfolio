import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicContentDetail } from "@/components/content/public-content-detail";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo/metadata";
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
    return buildMetadata({ title: "Architecture", path: "/architecture" });
  }

  return buildMetadata({
    title: note.seoTitle ?? note.title,
    description: note.seoDescription ?? note.description,
    path: `/architecture/${note.slug}`,
  });
}

export default async function ArchitectureNotePage({ params }: RouteContext) {
  const { slug } = await params;
  const note = await getArchitectureNote(slug);

  if (!note) {
    notFound();
  }

  return (
    <PageShell>
      <Section>
        <PublicContentDetail
          entry={note}
          backHref="/architecture"
          backLabel="Back to architecture"
        />
      </Section>
    </PageShell>
  );
}