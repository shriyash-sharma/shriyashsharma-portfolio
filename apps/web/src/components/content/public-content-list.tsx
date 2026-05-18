import Link from "next/link";
import type { PublicContentEntry } from "@/lib/services/content-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value)
  );
}

type PublicContentListProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  entries: PublicContentEntry[];
  hrefBase: string;
  emptyLabel: string;
};

export function PublicContentList({
  eyebrow,
  heading,
  subheading,
  entries,
  hrefBase,
  emptyLabel,
}: PublicContentListProps) {
  return (
    <div className="grid gap-10">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
          {heading}
        </h1>
        <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
          {subheading}
        </p>
      </div>

      {entries.length ? (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`${hrefBase}/${entry.slug}`}
              className="group rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                <span>{formatDate(entry.publishedAt)}</span>
                <span>·</span>
                <span>{entry.readTime}</span>
                <span>·</span>
                <span>{entry.type}</span>
              </div>
              <h2 className="mt-4 text-[24px] font-medium tracking-[-0.03em] text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
                {entry.title}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[var(--color-secondary)]">
                {entry.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-[15px] text-[var(--color-muted)]">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}