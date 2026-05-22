import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import type { HomeCaseStudyCard } from "@/lib/content/home-cards";
import { cn } from "@/lib/utils/cn";

type CaseStudiesSectionProps = {
  /** From getCaseStudies() → mapCaseStudiesToHomeCards (all published). */
  caseStudies: HomeCaseStudyCard[];
  backendConfigured?: boolean;
};

export function CaseStudiesSection({
  caseStudies,
  backendConfigured = true,
}: CaseStudiesSectionProps) {
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

      {caseStudies.length === 0 ? (
        <FadeIn>
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-[14px] leading-relaxed text-[var(--color-muted)]">
            {!backendConfigured ? (
              <>
                Content API is not configured. Set{" "}
                <code className="text-[13px]">NEXT_PUBLIC_API_URL</code> and{" "}
                <code className="text-[13px]">API_INTERNAL_URL</code>, then
                redeploy.
              </>
            ) : (
              "No published case studies yet."
            )}
          </div>
        </FadeIn>
      ) : (
      <div className="flex flex-col divide-y divide-[var(--color-border)]">
        {caseStudies.map((study, i) => (
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
      )}

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
