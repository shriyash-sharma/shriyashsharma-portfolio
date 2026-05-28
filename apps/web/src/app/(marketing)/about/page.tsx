import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EmailLink } from "@/components/shared/email-link";
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
                  boundaries. I have also completed a Gen AI Leadership Certification as part of
                  that learning, mainly to strengthen how I think about modern AI workflows and
                  practical product adoption.
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
              Professional experience
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

          <section className="mt-12 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Building
            </p>
            <div className="mt-4 max-w-3xl text-[15px] leading-8 text-[var(--color-secondary)]">
              Independent products and systems I am actively building alongside my professional
              engineering work.
            </div>
            <div className="mt-6 grid gap-8">
              <div className="grid gap-3 border-l border-[var(--color-border)] pl-5">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Ongoing product
                </p>
                <h2 className="text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                  TeamShastra · Field workforce operations platform
                </h2>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  TeamShastra is a real ongoing product focused on field workforce operations. It
                  is being built around practical coordination needs such as task visibility,
                  attendance, team movement, and day-to-day execution in environments where
                  reliability matters more than presentation.
                </p>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  The product direction is offline-first and operations-focused, with workflow
                  design shaped by real field conditions, practical backend coordination, and
                  modern product-focused engineering. AI-assisted tooling is used where it can
                  support operational follow-up and reduce manual work without turning the product
                  into a demo.
                </p>
                <div className="pt-1">
                  <Link
                    href="https://app.teamshastra.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-[var(--color-foreground)] underline underline-offset-4 transition-colors hover:text-[var(--color-secondary)]"
                  >
                    <span>View Product</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 border-l border-[var(--color-border)] pl-5">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Active platform build
                </p>
                <h2 className="text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                  AI portfolio platform · Full-stack engineering system
                </h2>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  This portfolio is also an active product build, not a simple static site. It is
                  designed as a full-stack platform for publishing projects, case studies, and
                  architecture notes in a way that stays structured, searchable, and useful.
                </p>
                <p className="text-[15px] leading-8 text-[var(--color-secondary)]">
                  Technically, it brings together Next.js, FastAPI, PostgreSQL, CMS-backed
                  content, multilingual architecture, semantic retrieval, RAG workflows, and
                  AI-assisted search. I use it as a practical system for exploring content
                  modeling, retrieval quality, and product-grade frontend and backend coordination.
                </p>
                <div className="pt-1">
                  <Link
                    href="https://shriyashsharma.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-[var(--color-foreground)] underline underline-offset-4 transition-colors hover:text-[var(--color-secondary)]"
                  >
                    <span>View Product</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
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
                Education and professional development
              </p>
              <h2 className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                Master of Computer Applications
              </h2>
              <p className="mt-2 text-[15px] leading-8 text-[var(--color-secondary)]">
                Shri Ramdeobaba College of Engineering &amp; Management, Nagpur, Maharashtra,
                India · CGPA 9.06
              </p>
              <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Certification
                </p>
                <h3 className="mt-2 text-[18px] font-medium tracking-[-0.02em] text-[var(--color-foreground)]">
                  Gen AI Leadership Certification
                </h3>
                <p className="mt-2 text-[15px] leading-8 text-[var(--color-secondary)]">
                  Completed as part of my ongoing learning in AI-assisted systems, semantic
                  retrieval, operational AI workflows, and practical Gen AI integration alongside
                  frontend and full-stack engineering work.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Collaboration and contact
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
                If you are hiring for frontend or full-stack engineering roles, or building
                products that need practical frontend, backend, or AI-assisted systems, feel free
                to reach out at{" "}
                <EmailLink className="inline-flex items-center whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 align-middle text-[14px] font-medium text-[var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]" />
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
