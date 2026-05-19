"use client";

/**
 * Single prompt chip.
 *
 * Submits the provided prompt to the shared assistant state and opens the
 * drawer. Used by the home section, the contextual page CTAs, and any future
 * surface that wants to suggest a question.
 */

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { useAssistant } from "@/features/assistant/context";
import { cn } from "@/lib/utils/cn";

type AssistantPromptChipProps = {
  prompt: string;
  /** Optional label override (defaults to the prompt itself). */
  label?: string;
  /** If true, ask immediately. If false, just open the drawer and prefill. */
  submitOnClick?: boolean;
  className?: string;
};

export function AssistantPromptChip({
  prompt,
  label,
  submitOnClick = true,
  className,
}: AssistantPromptChipProps) {
  const { ask, openDrawer, isLoading } = useAssistant();

  const handleClick = () => {
    if (submitOnClick) {
      void ask(prompt, { openDrawer: true });
    } else {
      openDrawer();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading && submitOnClick}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full",
        "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
        "px-3 py-1.5 text-[12px] text-[var(--color-secondary)]",
        "transition-[border-color,background-color,color] duration-[140ms]",
        "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      <span>{label ?? prompt}</span>
      <ArrowUpRight
        size={12}
        aria-hidden="true"
        className="text-[var(--color-muted)] transition-colors duration-[140ms] group-hover:text-[var(--color-foreground)]"
      />
    </button>
  );
}
