"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { AdminContentOverviewResponse } from "@/lib/api/contracts/admin";
import type {
  ApiContentItem,
  ApiContentListResponse,
  ContentStatus,
  ContentType,
} from "@/lib/api/contracts/content";
import { Button } from "@/components/ui/button";
import { contentCollections } from "@/lib/content/registry";
import { localeConfigs, type Locale } from "@/lib/i18n/config";

const statusOptions: Array<ContentStatus | "all"> = [
  "all",
  "draft",
  "review",
  "published",
  "archived",
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function typeLabel(type: ContentType) {
  return contentCollections.find((item) => item.type === type)?.description ?? type;
}

export function ContentWorkspace() {
  const [selectedType, setSelectedType] = useState<ContentType>("project");
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const [items, setItems] = useState<ApiContentItem[]>([]);
  const [overview, setOverview] = useState<AdminContentOverviewResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadWorkspace() {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ locale: selectedLocale });
      if (statusFilter !== "all") {
        params.set("status_filter", statusFilter);
      }
      if (deferredQuery) {
        params.set("query", deferredQuery);
      }

      try {
        const [listResponse, overviewResponse] = await Promise.all([
          fetch(`/api/dashboard/content/${selectedType}?${params.toString()}`, {
            cache: "no-store",
          }),
          fetch(
            `/api/dashboard/content/${selectedType}/overview?${params.toString()}`,
            {
              cache: "no-store",
            }
          ),
        ]);

        if (!listResponse.ok || !overviewResponse.ok) {
          const payload = (await listResponse.json().catch(() => null)) as
            | { detail?: string }
            | null;
          throw new Error(payload?.detail ?? "Unable to load content workspace.");
        }

        const listPayload = (await listResponse.json()) as ApiContentListResponse;
        const overviewPayload =
          (await overviewResponse.json()) as AdminContentOverviewResponse;

        if (isCancelled) {
          return;
        }

        setItems(listPayload.items);
        setTotal(listPayload.total);
        setOverview(overviewPayload);
      } catch (loadError) {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load content workspace."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkspace();

    return () => {
      isCancelled = true;
    };
  }, [deferredQuery, selectedLocale, selectedType, statusFilter]);

  const totalPublished = useMemo(() => {
    return overview?.counts.find((item) => item.status === "published")?.total ?? 0;
  }, [overview]);

  const filtersSummary = `${total} total · ${totalPublished} published`;

  async function handleDelete(itemId: string) {
    const previousItems = items;
    setPendingDeleteId(itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
    setTotal((current) => Math.max(0, current - 1));

    startTransition(async () => {
      const response = await fetch(`/api/dashboard/content/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setItems(previousItems);
        setTotal(previousItems.length);
        setError("Delete failed. The item has been restored locally.");
      }

      setPendingDeleteId(null);
    });
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
            Content operations
          </p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)]">
            Editorial workspace
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[var(--color-secondary)]">
            Browse, filter, and operate on persisted content across all platform
            collections. Search stays scoped and calm, with publish state visible at a glance.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href={`/dashboard/content/new?type=${selectedType}`}>Create entry</Link>
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="grid gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              Collection
              <select
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] text-[var(--color-foreground)] outline-none"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value as ContentType)}
              >
                {contentCollections.map((collection) => (
                  <option key={collection.type} value={collection.type}>
                    {collection.type}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              Locale
              <select
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] text-[var(--color-foreground)] outline-none"
                value={selectedLocale}
                onChange={(event) => setSelectedLocale(event.target.value as Locale)}
              >
                {Object.values(localeConfigs).map((locale) => (
                  <option key={locale.code} value={locale.code}>
                    {locale.nativeLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              Status
              <select
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] text-[var(--color-foreground)] outline-none"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ContentStatus | "all")
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              Search
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] text-[var(--color-foreground)] outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="title, slug, tag"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
            <div>
              <p className="text-[14px] text-[var(--color-foreground)]">
                {filtersSummary}
              </p>
              <p className="text-[12px] text-[var(--color-muted)]">
                {typeLabel(selectedType)}
              </p>
            </div>
            {isLoading ? (
              <span className="text-[12px] text-[var(--color-muted)]">Loading…</span>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                      <span>{item.status}</span>
                      <span>·</span>
                      <span>{item.locale}</span>
                      <span>·</span>
                      <span>/{item.slug}</span>
                    </div>
                    <h2 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
                      {item.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-[14px] leading-7 text-[var(--color-secondary)]">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[11px] text-[var(--color-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/dashboard/content/${item.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pendingDeleteId === item.id}
                      onClick={() => void handleDelete(item.id)}
                    >
                      {pendingDeleteId === item.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-[12px] text-[var(--color-muted-2)]">
                  Updated {formatDateTime(item.updated_at)}
                </p>
              </article>
            ))}

            {!isLoading && items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-10 text-center text-[14px] text-[var(--color-muted)]">
                No entries match the current filters.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="grid gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Publish state
            </p>
            <h2 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
              Collection health
            </h2>
          </div>

          {overview?.counts.map((item) => (
            <div
              key={item.status}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[var(--color-secondary)]">
                  {item.status}
                </span>
                <span className="font-mono text-[13px] text-[var(--color-foreground)]">
                  {item.total}
                </span>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}