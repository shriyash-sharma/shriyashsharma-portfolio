import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";

type CaseStudy = {
  id: string;
  title: string;
  challenge: string;
  outcome: string;
  tags: string[];
  href: string;
  readTime: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "1",
    title: "Scaling a frontend monorepo to 20+ engineers",
    challenge:
      "A shared-everything SPA where any PR could silently break unrelated teams. 4-minute CI runs, no module ownership, and implicit coupling through global state.",
    outcome: "60% build time reduction · team-scoped ownership · zero cross-boundary regressions",
    tags: ["Architecture", "Monorepo", "DX"],
    href: "/case-studies/monorepo-scaling",
    readTime: "8 min",
  },
  {
    id: "2",
    title: "Building a production RAG pipeline for document search",
    challenge:
      "Keyword search with poor recall on 400k+ enterprise documents. Users couldn't find information phrased differently from how it was written.",
    outcome: "Hybrid BM25 + vector retrieval · p95 latency 800ms · streaming with source citations",
    tags: ["AI/ML", "FastAPI", "pgvector"],
    href: "/case-studies/rag-pipeline",
    readTime: "12 min",
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
                "group py-7 sm:py-8",
                // Mobile: stack everything
                "flex flex-col gap-4",
                // Desktop: grid with right col
                "lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10"
              )}
            >
              {/* Main content */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Title with index */}
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 font-mono text-[10px] text-[var(--color-muted-2)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={cn(
                    "text-[14px] font-medium leading-snug tracking-[-0.015em]",
                    "text-[var(--color-foreground)]",
                    "transition-colors duration-[140ms] group-hover:text-white",
                    "sm:text-[15px]"
                  )}>
                    {study.title}
                  </h3>
                </div>

                {/* Challenge — full on sm+, abbreviated on mobile via line clamp */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                    Challenge
                  </span>
                  <p className="text-[13px] leading-[1.65] text-[var(--color-muted)] line-clamp-3 sm:line-clamp-none">
                    {study.challenge}
                  </p>
                </div>

                {/* Outcome */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                    Outcome
                  </span>
                  <p className="font-mono text-[12px] leading-relaxed text-[var(--color-secondary)]">
                    {study.outcome}
                  </p>
                </div>

                {/* Tags — visible on mobile too */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border border-[var(--color-border)] px-2.5 py-0.5",
                        "text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--color-muted-2)]"
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
                <span className="text-[11px] tracking-wide text-[var(--color-muted-2)]">
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
