import Link from "next/link";
import { MarkdownPreview } from "@/components/dashboard/markdown-preview";
import type { PublicContentEntry } from "@/lib/services/content-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type PublicContentDetailProps = {
  entry: PublicContentEntry;
  backHref: string;
  backLabel: string;
};

export function PublicContentDetail({
  entry,
  backHref,
  backLabel,
}: PublicContentDetailProps) {
  return (
    <div className="grid gap-10">
      <div>
        <Link
          href={backHref}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-secondary)]"
        >
          {backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
          <span>{formatDate(entry.publishedAt)}</span>
          <span>·</span>
          <span>{entry.readTime}</span>
          <span>·</span>
          <span>{entry.type}</span>
        </div>

        <h1 className="mt-4 max-w-4xl text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[52px]">
          {entry.title}
        </h1>
        <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[var(--color-secondary)]">
          {entry.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
        <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <MarkdownPreview value={entry.body || entry.description} />
        </article>

        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
            Entry metadata
          </p>
          <div className="mt-4 grid gap-4 text-[13px] text-[var(--color-secondary)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                Updated
              </p>
              <p className="mt-1">{formatDate(entry.updatedAt)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                Categories
              </p>
              <p className="mt-1">{entry.categories.join(", ") || "Uncategorized"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}