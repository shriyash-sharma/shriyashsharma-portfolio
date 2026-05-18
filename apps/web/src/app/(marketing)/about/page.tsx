import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { personJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <JsonLdScript data={personJsonLd()} />
      <PageShell>
        <Section>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              About
            </p>
            <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
              Shriyash Sharma
            </h1>
            <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
              Senior Software Engineer at Globant. I build scalable web applications with React and
              Next.js, integrate AI and RAG where it adds clear product value, and mentor engineers
              on architecture and delivery. This portfolio documents projects, case studies, and
              technical writing.
            </p>
          </header>
        </Section>
      </PageShell>
    </>
  );
}
