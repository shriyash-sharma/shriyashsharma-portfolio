import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("speaking");

export default function SpeakingPage() {
  return (
    <PageShell>
      <Section>
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Speaking
          </p>
          <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
            Talks & sessions
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
            I speak at engineering meetups and internal tech forums on React, Next.js, AI
            integration, RAG systems, and shipping reliable product software. Availability is
            limited — reach out via{" "}
            <Link href="/contact" className="text-[var(--color-foreground)] underline underline-offset-4">
              contact
            </Link>
            .
          </p>
        </header>
      </Section>
    </PageShell>
  );
}
