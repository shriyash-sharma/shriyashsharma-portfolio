"use client";

/**
 * Portfolio assistant chat panel.
 *
 * Pure presentational shell over the shared `AssistantProvider` state. Mounts
 * in three places with identical behavior:
 * - the dedicated `/assistant` page
 * - the homepage `AssistantSection`
 * - the floating `AssistantDrawer`
 *
 * Streaming, persistence, and SDKs are deferred to Phase 2.
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useAssistant } from "@/features/assistant/context";
import type { AssistantMessage } from "@/features/assistant/types";

const SUGGESTED_QUESTIONS = [
  "Explain the FastAPI backend architecture.",
  "How does the RAG / pgvector retrieval system work?",
  "What AI systems have been built in this portfolio?",
  "Walk me through the CMS architecture.",
  "What technologies power this platform?",
];

type AssistantPanelProps = {
  /** Visual density. Drawer uses "compact" for tighter chrome. */
  density?: "comfortable" | "compact";
  /** Optional override for the suggested prompts shown in the empty state. */
  suggestedPrompts?: readonly string[];
  /** Hide the header (the drawer renders its own). */
  hideHeader?: boolean;
  className?: string;
};

export function AssistantPanel({
  density = "comfortable",
  suggestedPrompts = SUGGESTED_QUESTIONS,
  hideHeader = false,
  className,
}: AssistantPanelProps) {
  const { messages, isLoading, error, ask } = useAssistant();
  const [input, setInput] = React.useState("");
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;
    setInput("");
    void ask(query);
  };

  const compact = density === "compact";

  return (
    <div
      className={[
        "flex h-full min-h-0 flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]",
        compact ? "p-3" : "p-4 sm:gap-4",
        className ?? "",
      ].join(" ")}
    >
      {!hideHeader ? (
        <header className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
              Portfolio AI guide
            </h2>
            <p className="text-[12px] text-[var(--color-muted)]">
              Ask about projects, architecture, RAG, or engineering decisions.
            </p>
          </div>
        </header>
      ) : null}

      <div
        ref={scrollerRef}
        className="min-h-[260px] flex-1 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3"
      >
        {messages.length === 0 ? (
          <EmptyState
            prompts={suggestedPrompts}
            disabled={isLoading}
            onPick={(prompt) => void ask(prompt)}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading ? (
              <li className="text-[12px] text-[var(--color-muted)]">
                Retrieving sources and drafting an answer…
              </li>
            ) : null}
          </ul>
        )}
      </div>

      {error ? (
        <p role="alert" className="text-[12px] text-red-400">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label="Ask the portfolio assistant"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about a project, architecture, or system…"
          disabled={isLoading}
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
          style={{ height: 36 }}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Thinking…" : "Ask"}
        </Button>
      </form>
    </div>
  );
}

function EmptyState({
  prompts,
  onPick,
  disabled,
}: {
  prompts: readonly string[];
  onPick: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] text-[var(--color-muted)]">Try one of these:</p>
      <ul className="flex flex-col gap-1.5">
        {prompts.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => onPick(suggestion)}
              disabled={disabled}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-left text-[12.5px] text-[var(--color-secondary)] transition-colors duration-[140ms] hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)] disabled:opacity-40"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === "user";
  return (
    <li
      className={`flex flex-col gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 ${
        isUser
          ? "self-end bg-[var(--color-surface-3)]"
          : "self-start bg-[var(--color-surface-2)]"
      }`}
    >
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {isUser ? "You" : "Assistant"}
      </span>
      <p className="whitespace-pre-wrap text-[13px] leading-[1.55] text-[var(--color-foreground)]">
        {message.content}
      </p>
      {message.sources && message.sources.length > 0 ? (
        <div className="mt-1 flex flex-col gap-1 border-t border-[var(--color-border)] pt-2">
          <span className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Sources
          </span>
          <ol className="flex flex-col gap-1 text-[12px] text-[var(--color-secondary)]">
            {message.sources.map((source, index) => (
              <li key={`${source.title}-${index}`}>
                <span className="text-[var(--color-muted)]">[{index + 1}]</span>{" "}
                <span className="text-[var(--color-foreground)]">
                  {source.title}
                </span>
                {source.excerpt ? (
                  <span className="text-[var(--color-muted)]">
                    {" — "}
                    {source.excerpt}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </li>
  );
}
