import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { EmailLink } from "@/components/shared/email-link";
import { ResumeLink } from "@/components/shared/resume-link";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/constants/site";
import { contactPageJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata, pageSeo } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("contact");

const pillClassName =
  "inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-[14px] text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] hover:bg-[var(--color-surface)]";

export default function ContactPage() {
  return (
    <>
      <JsonLdScript
        data={contactPageJsonLd({
          name: `Contact ${siteConfig.author.name}`,
          description: pageSeo.contact.description,
          path: pageSeo.contact.path,
        })}
      />
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
              If you are hiring for AI Engineer, GenAI full-stack, or senior engineering roles,
              looking for technical collaboration, or just want to discuss products,
              architecture, or AI-assisted systems, feel free to reach out.
            </p>
            <p className="mt-6 text-[15px] leading-8 text-[var(--color-secondary)]">
              <EmailLink className="inline-flex items-center whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-[14px] font-medium text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]" />
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={pillClassName}
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={pillClassName}
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <ResumeLink location="contact" className={pillClassName}>
                <span>Download Resume</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ResumeLink>
            </div>
          </header>

          <section
            aria-labelledby="contact-form-heading"
            className="mt-12 max-w-3xl rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
          >
            <h2
              id="contact-form-heading"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]"
            >
              Send a message
            </h2>
            <div className="mt-5">
              <ContactForm />
            </div>
          </section>
        </Section>
      </PageShell>
    </>
  );
}
