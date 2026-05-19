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
        <header className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Speaking
          </p>
          <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
            Talks & sessions
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
            I use this page as an honest description of the sessions I can lead, not as a padded
            list of invented conference appearances. Most of my speaking so far has been internal
            engineering knowledge-sharing, architecture walkthroughs, and practical discussions
            around frontend systems, product delivery, and AI-assisted engineering workflows.
          </p>
          <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
            If you are looking for a technically grounded session for an internal team, meetup, or
            engineering community, I am open to selected conversations. Reach out via{" "}
            <Link href="/contact" className="text-[var(--color-foreground)] underline underline-offset-4">
              contact
            </Link>
            .
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Session themes
            </p>
            <div className="mt-5 grid gap-5 text-[15px] leading-8 text-[var(--color-secondary)]">
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-foreground)]">
                  Frontend systems that survive delivery pressure
                </h2>
                <p className="mt-2">
                  React and Next.js architecture, reusable UI boundaries, and how to keep delivery
                  speed without letting the codebase collapse into local optimizations.
                </p>
              </div>
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-foreground)]">
                  AI features with real engineering constraints
                </h2>
                <p className="mt-2">
                  RAG pipelines, semantic retrieval, prompt boundaries, and what it takes to make
                  an assistant feel like a product surface instead of a demo.
                </p>
              </div>
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-foreground)]">
                  Frontend/backend collaboration in product teams
                </h2>
                <p className="mt-2">
                  Typed contracts, release coordination, delivery planning, and the practical work
                  of making cross-functional teams move with less friction.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Formats I can support
            </p>
            <ul className="mt-5 grid gap-4 text-[15px] leading-8 text-[var(--color-secondary)]">
              <li>Architecture walkthroughs for engineering teams</li>
              <li>Practical sessions on React, Next.js, and frontend platform quality</li>
              <li>Introductory RAG / semantic retrieval sessions for product teams</li>
              <li>Small-group engineering mentoring or code-review workshops</li>
            </ul>

            <div className="mt-8 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                Note
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[var(--color-secondary)]">
                I am intentionally not publishing a fake talk archive here. As public talks and
                recordings accumulate, this page can evolve into a proper session index. For now,
                it reflects the topics I can credibly speak about based on real engineering work.
              </p>
            </div>
          </section>
        </div>
      </Section>
    </PageShell>
  );
}
