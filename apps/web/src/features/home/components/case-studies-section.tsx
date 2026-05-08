import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";

/** Placeholder – will be replaced with real case-study service data */
const PLACEHOLDER_CASE_STUDIES = [
  {
    id: "1",
    title: "Scaling a Frontend Monorepo to 20+ Engineers",
    description:
      "How we restructured a legacy SPA into a feature-first monorepo and cut build times by 60%.",
    tags: ["Architecture", "Monorepo", "DX"],
    href: "/case-studies/monorepo-scaling",
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "Building a RAG Pipeline for Document Search",
    description:
      "End-to-end design of a semantic search system using pgvector, FastAPI, and LangChain.",
    tags: ["AI/ML", "FastAPI", "pgvector"],
    href: "/case-studies/rag-pipeline",
    readTime: "12 min read",
  },
];

export function CaseStudiesSection() {
  return (
    <Section
      aria-labelledby="case-studies-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <SectionHeading
          id="case-studies-heading"
          eyebrow="Deep dives"
          heading="Case Studies"
          subheading="Detailed breakdowns of engineering problems, decisions, and outcomes."
          className="mb-12"
        />
      </FadeIn>

      <div className="flex flex-col gap-4">
        {PLACEHOLDER_CASE_STUDIES.map((study, i) => (
          <FadeIn key={study.id} delay={i * 0.05}>
            <Link
              href={study.href}
              className={cn(
                "group flex flex-col gap-3 rounded-xl p-6 sm:flex-row sm:items-start sm:justify-between",
                "border border-[var(--color-border)] bg-[var(--color-surface)]",
                "transition-all duration-200",
                "hover:border-[var(--color-muted-2)] hover:bg-[var(--color-surface-2)]"
              )}
            >
              <div className="flex flex-col gap-2 sm:max-w-lg">
                <h3 className="text-sm font-medium text-[var(--color-foreground)] leading-snug">
                  {study.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                  {study.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:flex-col sm:items-end sm:gap-3">
                <span className="text-xs text-[var(--color-muted-2)]">
                  {study.readTime}
                </span>
                <ArrowRight
                  size={14}
                  className={cn(
                    "text-[var(--color-muted-2)]",
                    "transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-foreground)]"
                  )}
                />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.15}>
        <div className="mt-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            All case studies
            <ArrowRight size={13} />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
}
