"use client";

/**
 * Contextual assistant CTA.
 *
 * Compact block rendered at the bottom of a content detail page (project,
 * case study). Surfaces author-defined questions so visitors can ask the
 * assistant about *this* piece of content without leaving the page.
 *
 * Server pages can render this safely — it is a client component but takes
 * only serializable props.
 */

import { Sparkles } from "lucide-react";

import { AssistantPromptChip } from "@/features/assistant/components/assistant-prompt-chip";
import { cn } from "@/lib/utils/cn";

type ContextualAssistantCtaProps = {
  /** Eyebrow label, e.g. "Ask AI about this project". */
  eyebrow?: string;
  /** Author-defined prompts entered in the CMS. */
  prompts: readonly string[];
  /** Headline text. */
  heading?: string;
  /** Supporting copy. */
  description?: string;
  className?: string;
};

export function ContextualAssistantCta({
  eyebrow = "Ask AI",
  prompts,
  heading,
  description,
  className,
}: ContextualAssistantCtaProps) {
  const resolvedPrompts = prompts
    .map((prompt) => prompt.trim())
    .filter(Boolean);

  if (resolvedPrompts.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Ask the AI assistant about this page"
      className={cn(
        "mt-12 flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 sm:p-6",
        className
      )}
    >
      <header className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
          <Sparkles size={12} aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
          {heading ?? "Explore this with the portfolio AI guide"}
        </h2>
        {description ? (
          <p className="text-[12.5px] leading-[1.6] text-[var(--color-secondary)]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="flex flex-wrap gap-2">
        {resolvedPrompts.map((prompt) => (
          <AssistantPromptChip key={prompt} prompt={prompt} />
        ))}
      </div>
    </aside>
  );
}
