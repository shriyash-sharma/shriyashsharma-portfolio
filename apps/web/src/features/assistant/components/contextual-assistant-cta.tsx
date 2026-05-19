"use client";

/**
 * Contextual assistant CTA.
 *
 * Compact block rendered at the bottom of a content detail page (project,
 * case study, architecture note, blog post). Surfaces 2–3 page-specific
 * questions so visitors can ask the assistant about *this* piece of content
 * without ever leaving the page.
 *
 * Server pages can render this safely — it is a client component but takes
 * only serializable props.
 */

import * as React from "react";
import { Sparkles } from "lucide-react";

import { AssistantPromptChip } from "@/features/assistant/components/assistant-prompt-chip";
import { cn } from "@/lib/utils/cn";

type ContextualAssistantCtaProps = {
  /** Eyebrow label, e.g. "Ask AI about this project". */
  eyebrow?: string;
  /** Title of the surrounding content. Used to build natural prompts. */
  title: string;
  /** Override the default prompt set. */
  prompts?: readonly string[];
  /** Headline text. */
  heading?: string;
  /** Supporting copy. */
  description?: string;
  className?: string;
};

export function ContextualAssistantCta({
  eyebrow = "Ask AI",
  title,
  prompts,
  heading,
  description,
  className,
}: ContextualAssistantCtaProps) {
  const defaultPrompts = React.useMemo(
    () => [
      `Summarize "${title}" in a paragraph.`,
      `What architecture decisions stand out in "${title}"?`,
      `What technologies are used in "${title}"?`,
    ],
    [title]
  );

  const resolvedPrompts = prompts && prompts.length > 0 ? prompts : defaultPrompts;

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
