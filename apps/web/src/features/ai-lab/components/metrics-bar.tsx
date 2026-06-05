import { cn } from "@/lib/utils/cn";
import type { RagExplorerResponse } from "@/lib/api/contracts/ai-lab";

type Metric = {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
};

/** Horizontal summary of the run's key numbers, shown above the step cards. */
export function MetricsBar({ result }: { result: RagExplorerResponse }) {
  const totalMs =
    result.embedding.generation_ms +
    result.vector_search.search_ms +
    result.answer.response_ms;

  const metrics: Metric[] = [
    { label: "Embedding model", value: shortModel(result.embedding.model) },
    { label: "Dimensions", value: String(result.embedding.dimensions) },
    { label: "Chunks", value: String(result.chunks.length) },
    { label: "Retrieved", value: String(result.retrieved.length) },
    {
      label: "Prompt size",
      value: `${result.prompt.total_chars.toLocaleString()} ch`,
    },
    { label: "Embed time", value: `${Math.round(result.embedding.generation_ms)} ms` },
    { label: "Search time", value: `${result.vector_search.search_ms.toFixed(1)} ms` },
    {
      label: "Generation",
      value: `${Math.round(result.answer.response_ms)} ms`,
    },
    {
      label: "Total time",
      value: `${Math.round(totalMs)} ms`,
      emphasis: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={cn(
            "rounded-lg border p-2.5",
            metric.emphasis
              ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)]"
              : "border-[var(--color-border)] bg-[var(--color-surface-2)]"
          )}
        >
          <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {metric.label}
          </span>
          <span
            className="mt-1 block truncate text-[12.5px] font-medium text-[var(--color-foreground)]"
            title={metric.value}
          >
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function shortModel(model: string): string {
  const slash = model.lastIndexOf("/");
  return slash >= 0 ? model.slice(slash + 1) : model;
}
