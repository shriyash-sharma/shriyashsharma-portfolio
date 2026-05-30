import Link from "next/link";
import { CircuitBoard } from "lucide-react";
import { MarkdownContent } from "@/components/content/markdown-content";
import {
  getAdditionalMetadata,
  readMetadataString,
} from "@/lib/content/project-metadata";
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
  const isCaseStudy = entry.type === "case-study";
  const additionalMetadata = isCaseStudy
    ? getAdditionalMetadata(entry.type, entry.metadata)
    : [];

  const intro = isCaseStudy
    ? readMetadataString(entry.metadata, ["intro"])
    : null;
  const problem = isCaseStudy
    ? readMetadataString(entry.metadata, [
        "problem",
        "challenge",
        "home_challenge",
        "homeChallenge",
      ])
    : null;
  const decisionSummary = isCaseStudy
    ? readMetadataString(entry.metadata, [
        "decision",
        "home_decision",
        "homeDecision",
      ])
    : null;
  const outcome = isCaseStudy
    ? readMetadataString(entry.metadata, [
        "outcome",
        "home_outcome",
        "homeOutcome",
      ])
    : null;
  const keyDecision = isCaseStudy
    ? readMetadataString(entry.metadata, ["key_decision", "keyDecision"])
    : null;
  const architectureSummary = isCaseStudy
    ? readMetadataString(entry.metadata, [
        "architecture_summary",
        "architectureSummary",
      ])
    : null;
  const systemDetail = isCaseStudy
    ? readMetadataString(entry.metadata, ["system_detail", "systemDetail"])
    : null;

  const body = entry.body.trim() ? entry.body : entry.description;

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
        {intro ? (
          <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[var(--color-secondary)]">
            {intro}
          </p>
        ) : (
          <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[var(--color-secondary)]">
            {entry.description}
          </p>
        )}

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

      {isCaseStudy ? (
        <div className="grid gap-6">
          {problem || decisionSummary || outcome ? (
            <section className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:grid-cols-3 sm:p-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                  Problem
                </p>
                <p className="mt-3 text-[14px] leading-7 text-[var(--color-secondary)]">
                  {problem ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                  Decision
                </p>
                <p className="mt-3 text-[14px] leading-7 text-[var(--color-secondary)]">
                  {decisionSummary ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                  Outcome
                </p>
                <p className="mt-3 text-[14px] leading-7 text-[var(--color-secondary)]">
                  {outcome ?? "—"}
                </p>
              </div>
            </section>
          ) : null}

          {intro ? (
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Overview
              </p>
              <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                Product direction and engineering scope
              </h2>
              <p className="mt-4 text-[16px] leading-8 text-[var(--color-secondary)]">
                {entry.description}
              </p>
            </section>
          ) : null}

          {keyDecision ? (
            <section className="rounded-[28px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]">
                  <CircuitBoard className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                    Key engineering decision
                  </p>
                  <div className="mt-4 text-[18px] leading-8 text-[var(--color-foreground)]">
                    <MarkdownContent value={keyDecision} />
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="grid gap-6">
              {architectureSummary ? (
                <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                    Architecture
                  </p>
                  <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                    System topology and platform shape
                  </h2>
                  <div className="mt-5">
                    <MarkdownContent value={architectureSummary} />
                  </div>
                </section>
              ) : null}

              {systemDetail ? (
                <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                    System details
                  </p>
                  <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                    Delivery notes and implementation specifics
                  </h2>
                  <div className="mt-5">
                    <MarkdownContent value={systemDetail} />
                  </div>
                </section>
              ) : null}

              {additionalMetadata.map((item) => (
                <section
                  key={`${item.heading}-${item.description}`}
                  className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
                >
                  <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                    {item.heading}
                  </h2>
                  <p className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-[var(--color-secondary)]">
                    {item.description}
                  </p>
                </section>
              ))}

              <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                  Full writeup
                </p>
                <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                  Implementation notes
                </h2>
                <div className="mt-6">
                  <MarkdownContent
                    value={body}
                    emptyMessage="No long-form content has been published yet."
                  />
                </div>
              </section>
            </div>

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
                  <p className="mt-1">
                    {entry.categories.join(", ") || "Uncategorized"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                    Read time
                  </p>
                  <p className="mt-1">{entry.readTime}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
          <div className="grid gap-6">
            <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <MarkdownContent
                value={body}
                emptyMessage="No long-form content has been published yet."
              />
            </article>
          </div>

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
      )}
    </div>
  );
}