import type { Metadata } from "next";

import { EmailLink } from "@/components/shared/email-link";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <PageShell>
      <Section>
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Contact
          </p>
          <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
            Get in touch
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
            If you are hiring for frontend or full-stack engineering roles, looking for technical
            collaboration, or just want to discuss products, architecture, or AI-assisted
            systems, feel free to reach out.
          </p>
          <p className="mt-6 text-[15px] leading-8 text-[var(--color-secondary)]">
            <EmailLink className="inline-flex items-center whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-[14px] font-medium text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]" />
          </p>
        </header>
      </Section>
    </PageShell>
  );
}
