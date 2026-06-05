import {
  Boxes,
  FileText,
  Layers,
  type LucideIcon,
  ListOrdered,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Stage = {
  label: string;
  icon: LucideIcon;
};

const STAGES: Stage[] = [
  { label: "Content", icon: FileText },
  { label: "Chunking", icon: Layers },
  { label: "Embeddings", icon: Boxes },
  { label: "Vector Search", icon: Search },
  { label: "Retrieved Chunks", icon: ListOrdered },
  { label: "Prompt", icon: Terminal },
  { label: "Answer", icon: Sparkles },
];

type PipelineOverviewProps = {
  /** 0-based index of the active stage, or -1 for idle. */
  activeStage?: number;
  className?: string;
};

/**
 * Compact visual map of the RAG pipeline. Rendered above the step cards so users
 * always see the whole flow before drilling into each stage.
 */
export function PipelineOverview({
  activeStage = -1,
  className,
}: PipelineOverviewProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5",
        className
      )}
    >
      <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
        Pipeline overview
      </span>
      <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeStage;
          const isDone = activeStage >= 0 && index < activeStage;
          return (
            <li key={stage.label} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
                  isActive
                    ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                    : isDone
                      ? "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                )}
              >
                <Icon size={13} />
                {stage.label}
              </div>
              {index < STAGES.length - 1 ? (
                <span
                  className="text-[var(--color-muted)]"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
