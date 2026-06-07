"use client";

import * as React from "react";
import { FileText, MessageCircleQuestion, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { RagExplorerResponse } from "@/lib/api/contracts/ai-lab";
import {
  RAG_EXPLORER_CHUNK_SIZE_STEP,
  RAG_EXPLORER_DEFAULT_CHUNK_SIZE,
  RAG_EXPLORER_EXAMPLE_QUESTIONS,
  RAG_EXPLORER_MAX_CONTENT_CHARS,
  RAG_EXPLORER_MAX_CHUNK_SIZE,
  RAG_EXPLORER_MIN_CHUNK_SIZE,
  RAG_EXPLORER_SAMPLE_CONTENT,
} from "@/lib/ai-lab/sample-content";
import { PipelineOverview } from "./pipeline-overview";
import { ResultsView } from "./results-view";

type Status = "idle" | "loading" | "done" | "error";
type Toast = { id: number; message: string };

export function RagExplorer() {
  const sampleContent = React.useMemo(
    () => RAG_EXPLORER_SAMPLE_CONTENT.trim().slice(0, RAG_EXPLORER_MAX_CONTENT_CHARS),
    []
  );

  // Pre-populate with a high-quality sample so the tool is useful immediately.
  const [content, setContent] = React.useState(sampleContent);
  const [question, setQuestion] = React.useState("");
  const [chunkSize, setChunkSize] = React.useState(
    RAG_EXPLORER_DEFAULT_CHUNK_SIZE
  );
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<RagExplorerResponse | null>(null);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toastIdRef = React.useRef(0);
  const contentLimitToastShownRef = React.useRef(false);

  const showToast = React.useCallback((message: string) => {
    const id = toastIdRef.current + 1;
    toastIdRef.current = id;
    setToasts((previous) => [...previous, { id, message }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const canSubmit =
    content.trim().length >= 20 &&
    content.trim().length <= RAG_EXPLORER_MAX_CONTENT_CHARS &&
    question.trim().length >= 3 &&
    status !== "loading";

  const handleContentPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pasted = event.clipboardData.getData("text");
      const target = event.currentTarget;
      const selectionLength = target.selectionEnd - target.selectionStart;
      const projectedLength = target.value.length - selectionLength + pasted.length;
      if (projectedLength > RAG_EXPLORER_MAX_CONTENT_CHARS) {
        showToast(
          `Content limit is ${RAG_EXPLORER_MAX_CONTENT_CHARS} characters.`
        );
      }
    },
    [showToast]
  );

  async function handleRun(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setError(null);

    const normalizedContent = content
      .trim()
      .slice(0, RAG_EXPLORER_MAX_CONTENT_CHARS);
    const normalizedQuestion = question.trim();

    try {
      const response = await fetch("/api/ai-lab/rag-explorer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: normalizedContent,
          question: normalizedQuestion,
          is_demo_content: normalizedContent === sampleContent,
          chunk_size: chunkSize,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; detail?: string }
          | null;
        const message = payload?.error ?? payload?.detail;
        const limitMessage =
          response.status === 429
            ? `429 Too Many Requests. ${message ?? "Please try again later."}`
            : message;
        if (limitMessage) {
          showToast(limitMessage);
        }
        throw new Error(
          message ?? `Request failed with HTTP ${response.status}.`
        );
      }

      const data = (await response.json()) as RagExplorerResponse;
      setResult(data);
      setStatus("done");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong."
      );
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
      {/* Left: inputs (sticky on desktop) */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <form onSubmit={handleRun} className="flex flex-col gap-4">
          <Panel
            icon={FileText}
            title="Input content"
            hint="Paste documentation, a blog article, an architecture note, or any technical text. A sample is loaded for you."
            action={
              <div className="flex items-center gap-2">
                <MiniButton onClick={() => setContent(sampleContent)}>
                  Load sample
                </MiniButton>
                <MiniButton onClick={() => setContent("")}>
                  <RotateCcw size={11} />
                  Clear
                </MiniButton>
              </div>
            }
          >
            <textarea
              value={content}
              onPaste={handleContentPaste}
              onChange={(event) => {
                const nextValue = event.target.value;
                const isOverLimit = nextValue.length > RAG_EXPLORER_MAX_CONTENT_CHARS;
                if (isOverLimit && !contentLimitToastShownRef.current) {
                  showToast(
                    `Content limit is ${RAG_EXPLORER_MAX_CONTENT_CHARS} characters.`
                  );
                  contentLimitToastShownRef.current = true;
                }
                if (!isOverLimit) {
                  contentLimitToastShownRef.current = false;
                }
                setContent(nextValue.slice(0, RAG_EXPLORER_MAX_CONTENT_CHARS));
              }}
              maxLength={RAG_EXPLORER_MAX_CONTENT_CHARS}
              placeholder="Paste the text you want to ask questions about…"
              spellCheck={false}
              className={cn(
                "h-72 w-full resize-y rounded-lg border border-[var(--color-border)] lg:h-80",
                "bg-[var(--color-background)] p-3.5 font-mono text-[12.5px] leading-relaxed",
                "text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]",
                "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
              )}
            />
            <div className="flex items-center justify-between text-[11.5px] text-[var(--color-muted)]">
              <span>
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>
                {content.trim().length}/{RAG_EXPLORER_MAX_CONTENT_CHARS} characters
              </span>
            </div>
            {content.trim().length > RAG_EXPLORER_MAX_CONTENT_CHARS ? (
              <p className="mt-1 text-[11.5px] text-[#d96b5f]">
                Content exceeds {RAG_EXPLORER_MAX_CONTENT_CHARS} characters.
                Please shorten it before running.
              </p>
            ) : null}
          </Panel>

          <Panel
            icon={MessageCircleQuestion}
            title="Your question"
            hint="Ask something answerable from the content above."
          >
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. Why does RAG reduce hallucinations?"
              spellCheck={false}
              className={cn(
                "h-24 w-full resize-y rounded-lg border border-[var(--color-border)]",
                "bg-[var(--color-background)] p-3.5 text-[13px] leading-relaxed",
                "text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]",
                "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
              )}
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Try examples
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RAG_EXPLORER_EXAMPLE_QUESTIONS.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setQuestion(example)}
                    className={cn(
                      "rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1 text-[11.5px]",
                      "text-[var(--color-secondary)] transition-colors",
                      "hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
                    )}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="chunk-size"
                  className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]"
                >
                  Chunk size
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-medium text-[var(--color-foreground)]">
                    {chunkSize} chars
                  </span>
                  {chunkSize !== RAG_EXPLORER_DEFAULT_CHUNK_SIZE ? (
                    <button
                      type="button"
                      onClick={() => setChunkSize(RAG_EXPLORER_DEFAULT_CHUNK_SIZE)}
                      className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--color-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
                    >
                      Reset
                    </button>
                  ) : (
                    <span className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--color-muted)]">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <input
                id="chunk-size"
                type="range"
                min={RAG_EXPLORER_MIN_CHUNK_SIZE}
                max={RAG_EXPLORER_MAX_CHUNK_SIZE}
                step={RAG_EXPLORER_CHUNK_SIZE_STEP}
                value={chunkSize}
                onChange={(event) => setChunkSize(Number(event.target.value))}
                className="w-full accent-[var(--color-foreground)]"
              />
              <p className="text-[11px] leading-relaxed text-[var(--color-muted)]">
                Smaller chunks make retrieval more precise; larger chunks keep
                more context per chunk. Try different sizes and re-run to compare.
              </p>
            </div>

            <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
              <Sparkles size={15} />
              {status === "loading" ? "Running pipeline…" : "Run RAG pipeline"}
            </Button>
            <p className="text-[11.5px] leading-relaxed text-[var(--color-muted)]">
              Embeddings run locally with an open-source model. The answer is
              generated with Groq.
            </p>
          </Panel>
        </form>
      </div>

      {/* Toasts */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-[12.5px] text-[var(--color-foreground)] shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Right: results */}
      <div className="min-w-0">
        {status === "idle" ? (
          <div className="flex flex-col gap-4">
            <PipelineOverview />
            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40 p-8 text-center">
              <p className="text-[13.5px] text-[var(--color-secondary)]">
                Ask a question to run the full pipeline.
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                You&apos;ll see chunking, embeddings, vector search, retrieval,
                prompt construction, and the grounded answer — each explained.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[13px] text-[var(--color-secondary)]"
          >
            {error}
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="flex flex-col gap-4">
            <PipelineOverview />
            <div className="flex items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-[13px] text-[var(--color-secondary)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-foreground)]" />
              Chunking, embedding, searching, and generating…
            </div>
          </div>
        ) : null}

        {status === "done" && result ? (
          <div className="flex flex-col gap-4">
            <PipelineOverview activeStage={6} />
            <ResultsView result={result} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: typeof FileText;
  title: string;
  hint: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-[var(--color-muted)]" />
          <h2 className="text-[13.5px] font-medium text-[var(--color-foreground)]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
        {hint}
      </p>
      {children}
    </div>
  );
}

function MiniButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] px-2 py-1 text-[11px] font-medium",
        "text-[var(--color-secondary)] transition-colors",
        "hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
      )}
    >
      {children}
    </button>
  );
}
