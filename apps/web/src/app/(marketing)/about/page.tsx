import type { Metadata } from "next";
import Link from "next/link";

import { JsonLdScript } from "@/components/seo/json-ld-script";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/layout/section";
import { personJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <JsonLdScript data={personJsonLd()} />
      <PageShell>
        <Section>
          <header className="max-w-4xl py-4 sm:py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              About
            </p>
            <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
              Shriyash Sharma
            </h1>
            <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
              I am a Senior Software Engineer building scalable web applications and evolving
              AI-powered engineering systems. My work is strongest where frontend architecture,
              product delivery, and backend collaboration meet: React and Next.js on the user
              experience side, TypeScript-driven systems design across the stack, and pragmatic AI
              integration only when it improves the product in a measurable way.
            </p>
          </header>

          {/* Row padding prevents adjacent mt-12 grids from margin-collapsing and overlapping. */}
          <div className="mt-12 grid gap-4 py-4 sm:grid-cols-3 sm:py-5">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Current role
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                Senior Software Engineer at Globant India Pvt. Ltd., working on large-scale
                customer-facing web applications and frontend-heavy delivery systems.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Focus areas
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                React, Next.js, TypeScript, frontend systems, platform-quality UI engineering,
                FastAPI, semantic retrieval, and AI-assisted product workflows.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Location
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                Pune, India. Remote-first. Open to senior engineering roles and selected consulting
                collaborations.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 py-4 sm:py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                How I work
              </p>
              <div className="mt-5 grid gap-5 text-[15px] leading-8 text-[var(--color-secondary)]">
                <p>
                  I care most about systems that remain understandable after the initial launch.
                  That usually means clearer ownership boundaries, reusable UI decisions that do
                  not turn into framework worship, and backend coordination that makes product work
                  easier rather than more fragile.
                </p>
                <p>
                  Over the last 7+ years I have worked across enterprise frontend systems, digital
                  learning flows, booking-style workflows, search-heavy interfaces, and internal
                  product tooling. The common thread is not a single domain. It is the work of
                  making ambitious product requirements feel operationally calm.
                </p>
                <p>
                  More recently, I have been exploring AI-native engineering systems through
                  retrieval, semantic search, and grounded assistant workflows. I am interested in
                  the practical side of that work: how to integrate it into real products without
                  overstating what the system can reliably do.
                </p>
              </div>
            </section>

            <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Technical focus
              </p>
              <ul className="mt-5 grid gap-3 text-[14px] text-[var(--color-secondary)]">
                <li>React.js and Next.js application architecture</li>
                <li>TypeScript-based frontend systems and reusable UI patterns</li>
                <li>FastAPI, Python, and backend integration design</li>
                <li>Semantic retrieval, pgvector, and practical RAG implementation</li>
                <li>Engineering workflows, reviews, planning, and delivery quality</li>
              </ul>
            </aside>
          </div>

          <section className="mt-12 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Experience
            </p>
            <div className="mt-6 grid gap-8">
              <div className="grid gap-2 border-l border-[var(--color-border)] pl-5">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  May 2021 — Present
                </p>
                <h2 className="text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                  Globant India Pvt. Ltd. · Senior Software Engineer
                </h2>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  Working on large-scale enterprise web applications across digital learning,
                  booking workflows, event-driven platforms, and customer-facing frontend systems.
                  Publicly, the work I can talk about is centered on frontend architecture
                  implementation, React and Next.js engineering, TypeScript-heavy delivery,
                  sprint planning, code review discipline, deployment coordination, and day-to-day
                  collaboration with backend teams.
                </p>
              </div>

              <div className="grid gap-2 border-l border-[var(--color-border)] pl-5">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Jun 2018 — Mar 2022
                </p>
                <h2 className="text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                  Contentserv Technologies Pvt. Ltd. · Associate Software Developer to Software Developer
                </h2>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  Worked on enterprise product information management systems with a mix of React,
                  JavaScript, Node.js, Express, Python, ElasticSearch, MySQL, and REST APIs. The
                  public version of that experience is search and filtering flows, data quality
                  tooling, frontend/backend integration work, and reusable UI functionality inside
                  enterprise product workflows.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 grid gap-8 py-4 sm:py-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Education
              </p>
              <h2 className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                Master of Computer Applications
              </h2>
              <p className="mt-2 text-[15px] leading-8 text-[var(--color-secondary)]">
                Shri Ramdeobaba College of Engineering &amp; Management, Nagpur · CGPA 9.06
              </p>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Contact
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
                If you are hiring for senior frontend or full-stack product engineering, or you
                want help shaping a technically credible AI-assisted platform, reach out at{" "}
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-[var(--color-foreground)] underline underline-offset-4"
                >
                  {siteConfig.author.email}
                </a>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-[14px] text-[var(--color-secondary)]">
                <Link href={siteConfig.links.github} className="underline underline-offset-4">
                  GitHub
                </Link>
                <Link href={siteConfig.links.linkedin} className="underline underline-offset-4">
                  LinkedIn
                </Link>
              </div>
            </section>
          </div>
        </Section>
      </PageShell>
    </>
  );
}
