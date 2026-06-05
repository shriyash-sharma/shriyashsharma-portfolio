import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type StepCardProps = {
  step: number;
  title: string;
  icon: LucideIcon;
  /** One-line summary shown next to the title. */
  summary?: string;
  /** Beginner-friendly "what / why / problem solved" explainer. */
  explainer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Presentational wrapper for one stage of the RAG pipeline. Renders a numbered
 * header, an icon, an optional educational explainer, and the step's data.
 */
export function StepCard({
  step,
  title,
  icon: Icon,
  summary,
  explainer,
  children,
  className,
}: StepCardProps) {
  return (
    <section
      className={cn(
        "relative rounded-xl border border-[var(--color-border)]",
        "bg-[var(--color-surface)] p-5 sm:p-6",
        className
      )}
      aria-label={`Step ${step}: ${title}`}
    >
      <header className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
            "text-[var(--color-foreground)]"
          )}
          aria-hidden
        >
          <Icon size={16} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Step {step}
          </span>
          <h3 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            {title}
          </h3>
          {summary ? (
            <p className="text-[12.5px] text-[var(--color-secondary)]">
              {summary}
            </p>
          ) : null}
        </div>
      </header>

      {explainer ? (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-3.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            What &amp; why
          </span>
          <div className="mt-1.5 space-y-1.5 text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
            {explainer}
          </div>
        </div>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

/** Vertical connector with a down arrow rendered between step cards. */
export function StepConnector() {
  return (
    <div className="flex justify-center py-2" aria-hidden>
      <div className="flex flex-col items-center gap-1">
        <span className="h-5 w-px bg-[var(--color-border-strong)]" />
        <svg
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
          className="text-[var(--color-muted)]"
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
