/**
 * Dashboard workspace for content operations.
 *
 * This client component coordinates the editor-facing list view for persisted
 * content. It combines filter state, dashboard BFF routes, and per-status
 * overview data so administrators can operate on localized drafts and published
 * entries from one surface.
 *
 * The component intentionally treats the backend as the source of truth for
 * filters and counts; local state only provides responsive loading and delete
 * optimism.
 */

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
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
  const [deleteCandidate, setDeleteCandidate] = useState<ApiContentItem | null>(null);

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
    setDeleteCandidate(null);
    setItems((current) => current.filter((item) => item.id !== itemId));
    setTotal((current) => Math.max(0, current - 1));

    startTransition(async () => {
      try {
        const response = await fetch(`/api/dashboard/content/items/${itemId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          setItems(previousItems);
          setTotal(previousItems.length);
          setError("Delete failed. The item has been restored locally.");
        }
      } catch {
        setItems(previousItems);
        setTotal(previousItems.length);
        setError("Delete failed. The item has been restored locally.");
      } finally {
        setPendingDeleteId(null);
      }
    });
  }

  function handleRequestDelete(item: ApiContentItem) {
    if (pendingDeleteId) {
      return;
    }

    setDeleteCandidate(item);
  }

  function handleDeleteDialogChange(nextOpen: boolean) {
    if (pendingDeleteId) {
      return;
    }

    if (!nextOpen) {
      setDeleteCandidate(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteCandidate || pendingDeleteId) {
      return;
    }

    await handleDelete(deleteCandidate.id);
  }

  return (
    <>
      <Dialog.Root
        open={Boolean(deleteCandidate)}
        onOpenChange={handleDeleteDialogChange}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px]" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-[71] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-red-500/25 bg-[var(--color-surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] outline-none"
            onPointerDownOutside={(event) => {
              if (pendingDeleteId) {
                event.preventDefault();
              }
            }}
            onEscapeKeyDown={(event) => {
              if (pendingDeleteId) {
                event.preventDefault();
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/25 bg-red-500/12 text-red-200">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <Dialog.Title className="text-[18px] font-medium tracking-[-0.02em] text-[var(--color-foreground)]">
                    Confirm delete
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-[14px] leading-7 text-[var(--color-secondary)]">
                    Are you sure you want to delete this data? This action cannot be undone.
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close
                aria-label="Close delete confirmation"
                disabled={Boolean(pendingDeleteId)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)] disabled:pointer-events-none disabled:opacity-35"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>

            {deleteCandidate ? (
              <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3">
                <p className="text-[12px] uppercase tracking-[0.12em] text-red-200/80">
                  Selected entry
                </p>
                <p className="mt-2 text-[14px] text-[var(--color-foreground)]">
                  {deleteCandidate.title}
                </p>
                <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                  /{deleteCandidate.slug}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDeleteCandidate(null)}
                disabled={Boolean(pendingDeleteId)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={!deleteCandidate || Boolean(pendingDeleteId)}
                className="border border-red-500/30 bg-red-500 text-white hover:bg-red-400 disabled:border-red-500/20 disabled:bg-red-500/70 !text-white"
              >
                {pendingDeleteId ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
            Content operations
          </p>
          <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[30px]">
            Editorial workspace
          </h1>
          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[var(--color-secondary)] sm:text-[15px] sm:leading-8">
            Browse, filter, and operate on persisted content across all platform
            collections. Search stays scoped and calm, with publish state visible at a glance.
          </p>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/dashboard/content/new?type=${selectedType}`}>Create entry</Link>
        </Button>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid w-full content-start gap-4 self-start rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:rounded-[24px] sm:p-5">
          <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
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

            <label className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
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

            <label className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
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

            <label className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted-2)] sm:col-span-2 xl:col-span-1">
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

                  <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-end">
                    <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Link href={`/dashboard/content/${item.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={Boolean(pendingDeleteId)}
                      onClick={() => handleRequestDelete(item)}
                      className="w-full text-red-200 hover:bg-red-500/10 hover:text-red-100 sm:w-auto"
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

        <aside className="grid w-full content-start gap-3 self-start rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:rounded-[24px] sm:p-5">
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
    </>
  );
}