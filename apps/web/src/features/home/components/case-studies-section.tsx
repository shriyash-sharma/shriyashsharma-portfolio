import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";

type CaseStudy = {
  id: string;
  title: string;
  challenge: string;
  decision: string;
  operations: string;
  outcome: string;
  tags: string[];
  href: string;
  readTime: string;
};

// Home-page case study teasers — static highlights that mirror CMS seed slugs.
const CASE_STUDIES: CaseStudy[] = [
  {
    id: "1",
    title: "Building an AI-native engineering portfolio without turning it into a gimmick",
    challenge:
      "Most portfolios stop at screenshots and technology lists. That makes it hard for a recruiter or engineer to inspect how the system was actually designed or what tradeoffs shaped it.",
    decision:
      "Treat the portfolio as a real product system: CMS-backed content, markdown architecture docs, retrieval-backed assistant behavior, and a public experience designed around technical trust.",
    operations:
      "Next.js + FastAPI · pgvector retrieval · markdown ingestion · recruiter-oriented assistant UX",
    outcome:
      "A portfolio that behaves like an engineering knowledge system instead of a brochure.",
    tags: ["Architecture", "RAG", "Platform"],
    href: "/case-studies/building-an-ai-native-engineering-portfolio",
    readTime: "9 min",
  },
  {
    id: "2",
    title: "Frontend architecture for enterprise booking workflows",
    challenge:
      "Workflow-heavy enterprise products accumulate validation, error handling, partial failure states, and backend-dependent steps faster than teams expect.",
    decision:
      "Keep the frontend architecture explicit around workflow boundaries, state transitions, and API coordination instead of hiding everything behind generic shared abstractions.",
    operations:
      "React + TypeScript · workflow state modeling · backend contract alignment",
    outcome:
      "A product surface that is easier to change safely and easier for teams to reason about during delivery.",
    tags: ["Frontend", "TypeScript", "Delivery"],
    href: "/case-studies/frontend-architecture-for-enterprise-booking-workflows",
    readTime: "8 min",
  },
  {
    id: "3",
    title: "Same-origin coordination between Next.js and FastAPI",
    challenge:
      "As products grow, auth, backend URLs, timeout handling, and API coordination can leak too much complexity into the browser layer.",
    decision:
      "Use a same-origin proxy pattern so the web app owns browser-facing integration while the API keeps retrieval, validation, and backend orchestration concerns.",
    operations:
      "Route handlers as BFF layer · typed contracts · assistant requests through one public endpoint",
    outcome:
      "Cleaner browser integration and a more intentional split between public UX and backend behavior.",
    tags: ["Next.js", "FastAPI", "Architecture"],
    href: "/case-studies/same-origin-coordination-between-nextjs-and-fastapi",
    readTime: "7 min",
  },
  {
    id: "4",
    title: "Search and filtering for enterprise product tooling",
    challenge:
      "Search-heavy enterprise tooling becomes difficult to trust when filters feel inconsistent, result states are unclear, or users cannot tell whether a problem is in the query or the underlying data.",
    decision:
      "Treat search and filtering as a product workflow with explicit state, backend alignment, and clear user feedback rather than just a set of table controls.",
    operations:
      "Search flows · filtering semantics · data-quality-aware UI behavior",
    outcome:
      "A more trustworthy enterprise tool where operational users can reason about results instead of guessing what the system is doing.",
    tags: ["Search", "Tooling", "Enterprise UX"],
    href: "/case-studies/search-and-filtering-for-enterprise-product-tooling",
    readTime: "7 min",
  },
];

export function CaseStudiesSection() {
  return (
    <Section
      aria-labelledby="case-studies-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              <span className="mr-2 font-mono text-[var(--color-muted-2)]">02</span>
              Deep dives
            </span>
            <h2
              id="case-studies-heading"
              className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-2xl lg:text-3xl"
            >
              Case Studies
            </h2>
            <p className="max-w-[58ch] text-[14px] leading-[1.72] text-[var(--color-muted)] sm:text-[15px]">
              Engineering-focused writeups about architecture choices,
              delivery tradeoffs, integration boundaries, and the practical
              constraints behind the systems on this platform.
            </p>
          </div>
          <Link
            href="/case-studies"
            className={cn(
              "hidden items-center gap-1.5 text-[13px] text-[var(--color-muted)] sm:flex",
              "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
            )}
          >
            All case studies
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>
      </FadeIn>

      <div className="flex flex-col divide-y divide-[var(--color-border)]">
        {CASE_STUDIES.map((study, i) => (
          <FadeIn key={study.id} delay={i * 0.06}>
            <Link
              href={study.href}
              className={cn(
                "group py-8 sm:py-9",
                // Mobile: stack everything
                "flex flex-col gap-4",
                // Desktop: grid with right col
                "lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10"
              )}
            >
              {/* Main content */}
              <div className="flex flex-col gap-3.5 sm:gap-4">
                {/* Title with index */}
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 font-mono text-[11px] text-[var(--color-muted-2)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={cn(
                    "text-[15px] font-medium leading-snug tracking-[-0.015em]",
                    "text-[var(--color-foreground)]",
                    "transition-colors duration-[140ms] group-hover:text-white",
                    "sm:text-[16px]"
                  )}>
                    {study.title}
                  </h3>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-5">
                  {/* Challenge — abbreviated on mobile via line clamp */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                      Problem
                    </span>
                    <p className="line-clamp-3 text-[14px] leading-[1.68] text-[var(--color-muted)] sm:line-clamp-none">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Decision */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                      Decision
                    </span>
                    <p className="line-clamp-3 text-[14px] leading-[1.68] text-[var(--color-muted)] sm:line-clamp-none">
                      {study.decision}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr] sm:gap-5">
                  {/* Operations */}
                  <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                      ops note
                    </span>
                    <p className="font-mono text-[12px] leading-relaxed text-[var(--color-muted)]">
                      {study.operations}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2.5">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                      outcome
                    </span>
                    <p className="font-mono text-[12px] leading-relaxed text-[var(--color-secondary)]">
                      {study.outcome}
                    </p>
                  </div>
                </div>

                {/* Tags — visible on mobile too */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border border-[var(--color-border)] px-2.5 py-0.5",
                        "text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-muted-2)]"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right meta — inline on mobile, column on desktop */}
              <div className={cn(
                "flex items-center gap-4",
                "lg:flex-col lg:items-end lg:justify-between lg:pt-0.5 lg:gap-6"
              )}>
                <span className="text-[12px] tracking-wide text-[var(--color-muted-2)]">
                  {study.readTime} read
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.75}
                  className="text-[var(--color-muted-2)] transition-all duration-[140ms] group-hover:translate-x-0.5 group-hover:text-[var(--color-secondary)]"
                />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Mobile link */}
      <FadeIn delay={0.1}>
        <div className="mt-6 sm:hidden">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-secondary)]"
          >
            All case studies
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
}
