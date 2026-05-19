"use client";

import { Sparkles } from "lucide-react";

import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import {
  AssistantPanel,
  AssistantPromptChip,
} from "@/features/assistant";
import { cn } from "@/lib/utils/cn";

const RECRUITER_PROMPTS = [
  "Explain the RAG architecture.",
  "What backend systems are in this portfolio?",
  "How does the CMS architecture work?",
  "What AI technologies power this platform?",
] as const;

/**
 * Home-page surface for the portfolio AI assistant.
 *
 * Reads from the shared `AssistantProvider` (mounted in `AppChrome`) so the
 * conversation here, in the floating drawer, and on the `/assistant` page is
 * the same session. Recruiter-oriented prompt chips give visitors a clear,
 * low-friction entry point.
 */
export function AssistantSection() {
  return (
    <Section
      aria-labelledby="home-assistant-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <div
          className={cn(
            "flex flex-col gap-6",
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12"
          )}
        >
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              <Sparkles size={12} aria-hidden="true" />
              AI guide
            </span>
            <h2
              id="home-assistant-heading"
              className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-xl lg:text-2xl"
            >
              Ask anything about this portfolio
            </h2>
            <p className="text-[13px] leading-[1.7] text-[var(--color-secondary)] sm:text-[14px]">
              A retrieval-augmented assistant grounded in indexed projects,
              case studies, architecture notes, and articles. Powered by
              FastAPI, pgvector, OpenAI embeddings, and Groq inference.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Try
              </span>
              <div className="flex flex-wrap gap-2">
                {RECRUITER_PROMPTS.map((prompt) => (
                  <AssistantPromptChip key={prompt} prompt={prompt} />
                ))}
              </div>
            </div>
          </div>
          <AssistantPanel />
        </div>
      </FadeIn>
    </Section>
  );
}
