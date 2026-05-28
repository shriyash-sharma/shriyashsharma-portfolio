import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
              I am a Senior Software Engineer based in Pune, with 7+ years of experience building
              web products. My background is strongest in frontend engineering with React,
              Next.js, and TypeScript, and in the last few years I have been moving deeper into
              backend work with FastAPI, PostgreSQL, and AI-assisted systems that solve practical
              product problems.
            </p>
          </header>

          {/* Row padding prevents adjacent mt-12 grids from margin-collapsing and overlapping. */}
          <div className="mt-12 grid gap-4 py-4 sm:grid-cols-3 sm:py-5">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Current role
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                Senior Software Engineer at Globant India Pvt. Ltd., working on large-scale web applications,
                frontend systems, and product delivery across distributed teams.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Recent focus
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                React, Next.js, TypeScript, FastAPI, PostgreSQL, semantic retrieval, RAG, and
                AI-assisted systems for real product workflows.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Location
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--color-secondary)]">
                Pune, India. Open to senior frontend and full-stack product engineering roles, and
                a small number of focused consulting conversations.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 py-4 sm:py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Intro
              </p>
              <div className="mt-5 grid gap-5 text-[15px] leading-8 text-[var(--color-secondary)]">
                <p>
                  I started as a frontend engineer and spent most of my career building interfaces
                  that had to work well at scale, not just look good in isolation. A lot of that
                  work has been around React and Next.js applications where product expectations,
                  delivery speed, and long-term maintainability all matter at the same time.
                </p>
                <p>
                  Over time, I became more interested in how the full system works behind the UI.
                  That pulled me toward API design, data flows, backend integration, and the kind
                  of decisions that make a product easier to run and extend. That is why my work
                  today is moving more deliberately toward full-stack engineering.
                </p>
                <p>
                  I am also spending a lot of time on practical AI integration. For me, that means
                  building grounded workflows with semantic retrieval and RAG, understanding where
                  they help, and being honest about where they still need clear product and system
                  boundaries.
                </p>
              </div>
            </section>

            <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Technologies
              </p>
              <ul className="mt-5 grid gap-3 text-[14px] text-[var(--color-secondary)]">
                <li>React and Next.js for production frontend systems</li>
                <li>TypeScript for maintainable UI and shared application logic</li>
                <li>FastAPI and Python for backend services and APIs</li>
                <li>PostgreSQL, semantic retrieval, and practical RAG workflows</li>
                <li>Scalable systems, operational platforms, and product-focused delivery</li>
              </ul>
            </aside>
          </div>

          <section className="mt-12 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Current work
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
                  I work on enterprise web applications where frontend quality has a direct impact
                  on product delivery. The public version of that work includes React and Next.js
                  implementation, TypeScript-heavy codebases, architecture decisions, code reviews,
                  planning, and close collaboration with backend teams.
                </p>
              </div>

              <div className="grid gap-2 border-l border-[var(--color-border)] pl-5">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Ongoing
                </p>
                <h2 className="text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                  TeamShastra · Field workforce operations platform
                </h2>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  I am building TeamShastra as a practical operational SaaS product for field
                  workforce management. It is the kind of system that brings together frontend
                  product thinking, backend workflows, operational clarity, and measured use of
                  AI-assisted features where they can actually support users.
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
                  I worked on enterprise product information management systems using React,
                  JavaScript, Node.js, Express, Python, ElasticSearch, MySQL, and REST APIs. That
                  experience gave me a solid base in search-heavy interfaces, data workflows,
                  frontend and backend integration, and reusable product functionality.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 grid gap-8 py-4 sm:py-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Product and system interests
              </p>
              <div className="mt-5 grid gap-5 text-[15px] leading-8 text-[var(--color-secondary)]">
                <p>
                  I enjoy building products that need both good user experience and strong backend
                  systems. That includes operational platforms, workflow-based applications,
                  search-driven features, and systems where reliability is important.
                </p>
                <p>
                  I am especially interested in building scalable systems that remain simple and
                  easy to maintain as they grow. I like practical architecture decisions, clean
                  frontend and backend integration, and AI-assisted systems that solve real user
                  problems instead of just following trends.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Recent focus areas
              </p>
              <ul className="mt-5 grid gap-3 text-[14px] text-[var(--color-secondary)]">
                <li>Frontend systems with React, Next.js, and TypeScript</li>
                <li>Backend services with FastAPI and PostgreSQL</li>
                <li>AI-assisted systems with semantic retrieval and RAG</li>
                <li>Operational platforms for real teams and field workflows</li>
                <li>Full-stack product thinking across UX, APIs, and delivery</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 grid gap-8 py-4 sm:py-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Education
              </p>
              <h2 className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                Master of Computer Applications
              </h2>
              <p className="mt-2 text-[15px] leading-8 text-[var(--color-secondary)]">
                Shri Ramdeobaba College of Engineering &amp; Management, Nagpur, Maharashtra,
                India · CGPA 9.06
              </p>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Collaboration and contact
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
                If you are hiring for frontend or full-stack engineering roles, or building
                products that need practical frontend, backend, or AI-assisted systems, feel free
                to reach out at{" "}
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-[var(--color-foreground)] underline underline-offset-4"
                >
                  {siteConfig.author.email}
                </a>
                .
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
                I am always open to good engineering discussions and interesting product ideas.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-[14px] text-[var(--color-secondary)]">
                <Link
                  href={siteConfig.links.github}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={siteConfig.links.linkedin}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </Section>
      </PageShell>
    </>
  );
}
