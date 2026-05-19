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
  /** Drawer embed: flex footer input, no double border. */
  layout?: "default" | "drawer";
  /** Extra bottom padding when the mobile keyboard is open (from visualViewport). */
  keyboardInset?: number;
  /** Optional override for the suggested prompts shown in the empty state. */
  suggestedPrompts?: readonly string[];
  /** Hide the header (the drawer renders its own). */
  hideHeader?: boolean;
  className?: string;
};

export function AssistantPanel({
  density = "comfortable",
  layout = "default",
  keyboardInset = 0,
  suggestedPrompts = SUGGESTED_QUESTIONS,
  hideHeader = false,
  className,
}: AssistantPanelProps) {
  const { messages, isLoading, error, ask } = useAssistant();
  const [input, setInput] = React.useState("");
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
  const inDrawer = layout === "drawer";
  const keyboardOpen = keyboardInset > 48;

  const scrollInputIntoView = () => {
    if (inDrawer) return;
    window.requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    });
  };

  return (
    <div
      data-assistant-panel
      className={[
        "flex h-full min-h-0 min-w-0 w-full max-w-full flex-col",
        inDrawer
          ? "gap-2 bg-transparent"
          : [
              "gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]",
              compact ? "p-3" : "p-4 sm:gap-4",
            ].join(" "),
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
        className={[
          "min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain",
          inDrawer
            ? "rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3"
            : "min-h-[140px] rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3 sm:min-h-[260px]",
          keyboardOpen && inDrawer ? "max-h-[min(42vh,280px)]" : "",
        ].join(" ")}
      >
        {messages.length === 0 ? (
          <EmptyState
            prompts={suggestedPrompts}
            disabled={isLoading}
            onPick={(prompt) => void ask(prompt)}
          />
        ) : (
          <ul className="flex min-w-0 max-w-full flex-col gap-3">
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

      <form
        onSubmit={handleSubmit}
        className={[
          "z-10 shrink-0",
          inDrawer
            ? "box-border w-full min-w-0 max-w-full border-t border-[var(--color-border)] bg-[var(--color-background)] px-1 pt-3"
            : "sticky bottom-0 bg-[var(--color-surface-2)] px-0.5 pt-1",
          inDrawer || keyboardOpen
            ? "flex flex-row items-center gap-2"
            : "flex flex-col gap-2 sm:flex-row sm:items-center",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          aria-label="Ask the portfolio assistant"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={scrollInputIntoView}
          placeholder="Ask about a project, architecture, or system…"
          disabled={isLoading}
          enterKeyHint="send"
          autoComplete="off"
          className={[
            "min-h-11 min-w-0 flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]",
            "outline-none focus:border-[var(--color-border-strong)] focus:ring-2 focus:ring-inset focus:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25",
            !inDrawer ? "sm:min-h-9 sm:text-[13px]" : "",
          ].join(" ")}
        />
        <Button
          type="submit"
          variant="primary"
          className="h-11 shrink-0 px-4 sm:h-9"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "…" : "Ask"}
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
      className={`flex max-w-full min-w-0 flex-col gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 ${
        isUser
          ? "ml-auto max-w-[92%] self-end bg-[var(--color-surface-3)]"
          : "max-w-[92%] self-start bg-[var(--color-surface-2)]"
      }`}
    >
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {isUser ? "You" : "Assistant"}
      </span>
      <p className="break-words whitespace-pre-wrap text-[13px] leading-[1.55] text-[var(--color-foreground)]">
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
