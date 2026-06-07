"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, FileText, Gauge, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  CONTEXT_WINDOW_MODELS,
  CONTEXT_WINDOW_SAMPLE_TEXT,
  type ContextModel,
} from "@/lib/ai-lab/context-window";

type Toast = { id: number; message: string };

type TokenStats = {
  chars: number;
  words: number;
  tokens: number;
  tokenizer: "approx" | "tiktoken";
};

const TIKTOKEN_MAX_CHARS = 40_000;

function estimateTokens(text: string): TokenStats {
  const trimmed = text.trim();
  const chars = trimmed.length;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const tokens = Math.max(1, Math.ceil(chars / 4));
  return {
    chars,
    words,
    tokens,
    tokenizer: "approx",
  };
}

async function estimateTokensPreferred(text: string): Promise<TokenStats> {
  const approx = estimateTokens(text);
  const trimmed = text.trim();
  if (!trimmed) {
    return approx;
  }

  // Guard UI responsiveness for very large payloads.
  if (trimmed.length > TIKTOKEN_MAX_CHARS) {
    return approx;
  }

  try {
    const dynamicImport = new Function(
      "moduleName",
      "return import(moduleName);"
    ) as (moduleName: string) => Promise<Record<string, unknown>>;

    const mod = await dynamicImport("js-tiktoken");
    const encodingForModel = mod["encodingForModel"] as
      | ((model: string) => { encode: (value: string) => number[] })
      | undefined;
    const getEncoding = mod["getEncoding"] as
      | ((name: string) => { encode: (value: string) => number[] })
      | undefined;

    const encoder =
      encodingForModel?.("gpt-4o-mini") ?? getEncoding?.("cl100k_base");
    if (!encoder) {
      return approx;
    }

    return {
      ...approx,
      tokens: Math.max(1, encoder.encode(trimmed).length),
      tokenizer: "tiktoken",
    };
  } catch {
    return approx;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function percent(used: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (used / total) * 100));
}

function fitForModel(tokens: number, model: ContextModel) {
  const remaining = model.contextWindow - tokens;
  return {
    usedPct: percent(tokens, model.contextWindow),
    fits: remaining >= 0,
    remaining,
  };
}

export function ContextWindowVisualizer({
  maxContentChars = 9000,
}: {
  maxContentChars?: number;
}) {
  const initialInput = CONTEXT_WINDOW_SAMPLE_TEXT.slice(0, maxContentChars);
  const [input, setInput] = React.useState(initialInput);
  const [stats, setStats] = React.useState<TokenStats>(() =>
    estimateTokens(initialInput)
  );
  const [selectedModelId, setSelectedModelId] = React.useState(
    CONTEXT_WINDOW_MODELS[0].id
  );
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toastIdRef = React.useRef(0);

  const selectedModel =
    CONTEXT_WINDOW_MODELS.find((model) => model.id === selectedModelId)
    ?? CONTEXT_WINDOW_MODELS[0];

  const modelRows = React.useMemo(
    () =>
      CONTEXT_WINDOW_MODELS.map((model) => {
        const usage = fitForModel(stats.tokens, model);
        return { model, usage };
      }),
    [stats.tokens]
  );

  const selectedUsage = React.useMemo(
    () => fitForModel(stats.tokens, selectedModel),
    [selectedModel, stats.tokens]
  );

  const visibleTokenRatio = Math.min(
    1,
    selectedModel.contextWindow / Math.max(stats.tokens, 1)
  );
  const visibleChars = Math.floor(stats.chars * visibleTokenRatio);
  const visibleText = input.trim().slice(0, visibleChars);
  const hiddenText = input.trim().slice(visibleChars);

  const showToast = React.useCallback((message: string) => {
    const id = toastIdRef.current + 1;
    toastIdRef.current = id;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const handleInputPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pasted = event.clipboardData.getData("text");
      const target = event.currentTarget;
      const selectionLength = target.selectionEnd - target.selectionStart;
      const projectedLength = target.value.length - selectionLength + pasted.length;
      if (projectedLength > maxContentChars) {
        showToast(`Content limit is ${maxContentChars} characters.`);
      }
    },
    [maxContentChars, showToast]
  );

  async function handleAnalyze(event: React.FormEvent) {
    event.preventDefault();
    const next = await estimateTokensPreferred(input);
    setStats(next);
    showToast(
      `Analyzed ${formatNumber(next.tokens)} estimated tokens across ${formatNumber(next.chars)} characters.`
    );
    if (input.trim().length > TIKTOKEN_MAX_CHARS && next.tokenizer === "approx") {
      showToast(
        `Switched to fast approximate token counting above ${formatNumber(TIKTOKEN_MAX_CHARS)} characters.`
      );
    }
  }

  function handleLoadSample() {
    setInput(initialInput);
    const next = estimateTokens(initialInput);
    setStats(next);
    showToast("Sample content loaded.");
  }

  function handleClear() {
    setInput("");
    setStats({ chars: 0, words: 0, tokens: 1, tokenizer: "approx" });
    showToast("Input cleared.");
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
            <Panel
              icon={FileText}
              title="Input"
              hint="Paste text to estimate token usage and compare context limits."
              action={
                <div className="flex items-center gap-2">
                  <MiniButton onClick={handleLoadSample}>
                    <RefreshCcw size={11} />
                    Load Sample
                  </MiniButton>
                  <MiniButton onClick={handleClear}>
                    <Trash2 size={11} />
                    Clear
                  </MiniButton>
                </div>
              }
            >
              <textarea
                value={input}
                onPaste={handleInputPaste}
                onChange={(event) =>
                  setInput(event.target.value.slice(0, maxContentChars))
                }
                maxLength={maxContentChars}
                placeholder="Paste text here to estimate token usage and visualize context windows..."
                spellCheck={false}
                className={cn(
                  "h-72 w-full resize-y rounded-lg border border-[var(--color-border)] lg:h-80",
                  "bg-[var(--color-background)] p-3.5 font-mono text-[12.5px] leading-relaxed",
                  "text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]",
                  "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
                )}
              />
              <div className="grid grid-cols-3 gap-2 text-[11.5px] text-[var(--color-muted)]">
                <StatChip label="Characters" value={formatNumber(stats.chars)} />
                <StatChip label="Words" value={formatNumber(stats.words)} />
                <StatChip label="Tokens" value={formatNumber(stats.tokens)} />
              </div>
              <p className="text-[11px] text-[var(--color-muted)]">
                Limit: {formatNumber(maxContentChars)} characters
              </p>
              <p className="text-[11px] text-[var(--color-muted)]">
                Token estimation mode:{" "}
                {stats.tokenizer === "tiktoken"
                  ? "tiktoken"
                  : "approximate (about 1 token per 4 characters)"}
                .
              </p>
              <Button type="submit" className="w-full" size="lg">
                <Gauge size={15} />
                Analyze
              </Button>
            </Panel>
          </form>
        </div>

        <div className="min-w-0 flex flex-col gap-4">
          <Panel
            icon={BarChart3}
            title="Model comparison"
            hint="Compare estimated token usage against common model context windows."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                    <th className="px-2 py-2 font-medium">Model</th>
                    <th className="px-2 py-2 font-medium">Context Window</th>
                    <th className="px-2 py-2 font-medium">Used %</th>
                    <th className="px-2 py-2 font-medium">Fits?</th>
                    <th className="px-2 py-2 font-medium">Remaining Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {modelRows.map(({ model, usage }) => (
                    <tr
                      key={model.id}
                      className="border-b border-[var(--color-border)]/70 last:border-b-0"
                    >
                      <td className="px-2 py-2 text-[var(--color-foreground)]">
                        {model.name}
                      </td>
                      <td className="px-2 py-2 text-[var(--color-secondary)]">
                        {formatNumber(model.contextWindow)}
                      </td>
                      <td className="px-2 py-2 text-[var(--color-secondary)]">
                        {usage.usedPct.toFixed(1)}%
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[11px] font-medium",
                            usage.fits
                              ? "bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                              : "bg-[#3a221f] text-[#ffb4a8]"
                          )}
                        >
                          {usage.fits ? "Fits" : "Truncated"}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-[var(--color-secondary)]">
                        {usage.remaining >= 0
                          ? formatNumber(usage.remaining)
                          : `-${formatNumber(Math.abs(usage.remaining))}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            icon={Gauge}
            title="Context usage visualizer"
            hint="See how much of each model window the current input would consume."
          >
            <div className="flex flex-col gap-3">
              {modelRows.map(({ model, usage }) => (
                <div key={model.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-[var(--color-foreground)]">
                      {model.name}
                    </span>
                    <span className="text-[var(--color-muted)]">
                      {formatNumber(stats.tokens)} / {formatNumber(model.contextWindow)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        usage.fits ? "bg-[var(--color-foreground)]" : "bg-[#d96b5f]"
                      )}
                      style={{ width: `${usage.usedPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    {usage.fits
                      ? `${formatNumber(Math.max(usage.remaining, 0))} tokens remaining`
                      : `${formatNumber(Math.abs(usage.remaining))} tokens exceed window`}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            icon={Gauge}
            title="Truncation simulation"
            hint="Pick a model to preview what the model can actually see when input exceeds its limit."
          >
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Model selection
              </label>
              <select
                value={selectedModelId}
                onChange={(event) => setSelectedModelId(event.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[13px] text-[var(--color-foreground)] focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
              >
                {CONTEXT_WINDOW_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({formatNumber(model.contextWindow)})
                  </option>
                ))}
              </select>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                  <h3 className="text-[12px] font-medium text-[var(--color-foreground)]">
                    Visible portion
                  </h3>
                  <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[12px] leading-relaxed text-[var(--color-secondary)]">
                    {visibleText || "(No visible content)"}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                  <h3 className="text-[12px] font-medium text-[var(--color-foreground)]">
                    Hidden portion
                  </h3>
                  <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[12px] leading-relaxed text-[var(--color-secondary)]">
                    {hiddenText || "(No hidden content)"}
                  </p>
                </div>
              </div>

              <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
                Large documents may exceed context windows and cause important
                information to be ignored. In this simulation, {selectedUsage.fits
                  ? "the full input fits the selected model."
                  : "only the leading portion remains visible to the model."}
              </p>
            </div>
          </Panel>

          <Panel
            icon={BarChart3}
            title="Why RAG exists"
            hint="Retrieval pipelines avoid brute-force prompt stuffing and preserve high-signal context."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <FlowCard
                title="Without RAG"
                steps={[
                  "Large Document",
                  "Too Large",
                  "Truncated",
                  "Information Lost",
                ]}
              />
              <FlowCard
                title="With RAG"
                steps={[
                  "Large Document",
                  "Chunking",
                  "Embedding",
                  "Retrieval",
                  "Relevant Chunks",
                  "LLM",
                ]}
              />
            </div>
            <div className="mt-2">
              <Link
                href="/ai-lab/rag-explorer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
              >
                Try the RAG Explorer
              </Link>
            </div>
          </Panel>

          <Panel
            icon={BarChart3}
            title="Model reference"
            hint="Quick lookup for common context windows and practical best-fit scenarios."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                    <th className="px-2 py-2 font-medium">Model</th>
                    <th className="px-2 py-2 font-medium">Context Window</th>
                    <th className="px-2 py-2 font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTEXT_WINDOW_MODELS.map((model) => (
                    <tr
                      key={model.id}
                      className="border-b border-[var(--color-border)]/70 last:border-b-0"
                    >
                      <td className="px-2 py-2 text-[var(--color-foreground)]">
                        {model.name}
                      </td>
                      <td className="px-2 py-2 text-[var(--color-secondary)]">
                        {model.contextWindow >= 1_000_000
                          ? "1M+"
                          : formatNumber(model.contextWindow)}
                      </td>
                      <td className="px-2 py-2 text-[var(--color-secondary)]">
                        {model.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11.5px] text-[var(--color-muted)]">
              Context limits change over time and may vary by provider,
              deployment mode, and account tier.
            </p>
          </Panel>
        </div>
      </div>

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
    </>
  );
}

function Panel({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  hint: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-[1px] inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]">
            <Icon size={14} />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-[14px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
              {title}
            </h2>
            <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
              {hint}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
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
        "inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-[11px]",
        "text-[var(--color-secondary)] transition-colors",
        "hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
      )}
    >
      {children}
    </button>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1.5">
      <p className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="font-mono text-[12px] font-medium text-[var(--color-foreground)]">
        {value}
      </p>
    </div>
  );
}

function FlowCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
      <h3 className="text-[12px] font-medium text-[var(--color-foreground)]">
        {title}
      </h3>
      <ol className="mt-2 flex flex-col gap-1.5">
        {steps.map((step, index) => (
          <li key={step} className="text-[12px] text-[var(--color-secondary)]">
            {index + 1}. {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
