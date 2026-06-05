import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { AiLabTool } from "@/lib/ai-lab/tools";

type ToolCardProps = {
  tool: AiLabTool;
  href: string;
};

/**
 * A single AI Lab tool card. Available tools link to their route; coming-soon
 * tools render as a non-interactive card so the roadmap stays visible.
 */
export function ToolCard({ tool, href }: ToolCardProps) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";

  const body = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-xl border p-5 sm:p-6",
        "transition-[border-color,background-color,transform] duration-200 ease-out",
        isAvailable
          ? [
              "border-[var(--color-border)] bg-[var(--color-surface)]",
              "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]",
            ]
          : "border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
            isAvailable
              ? "text-[var(--color-foreground)]"
              : "text-[var(--color-muted)]"
          )}
          aria-hidden
        >
          <Icon size={18} />
        </span>
        {isAvailable ? null : (
          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Coming soon
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-[16px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
          {tool.title}
        </h3>
        <p className="text-[12px] font-medium text-[var(--color-muted)]">
          {tool.tagline}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-secondary)]">
          {tool.description}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {isAvailable ? (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-foreground)]">
          Open Tool
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      ) : null}
    </div>
  );

  if (!isAvailable) {
    return (
      <div aria-disabled className="h-full">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Open ${tool.title}`}
      className="h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
    >
      {body}
    </Link>
  );
}
