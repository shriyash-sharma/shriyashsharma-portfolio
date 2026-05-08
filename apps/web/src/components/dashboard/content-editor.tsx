"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { ApiContentItem, ContentStatus, ContentType } from "@/lib/api/contracts/content";
import { Button } from "@/components/ui/button";
import { MarkdownPreview } from "@/components/dashboard/markdown-preview";
import { contentCollections } from "@/lib/content/registry";
import { localeConfigs, type Locale } from "@/lib/i18n/config";

type EditorMode = "create" | "edit";

type MetadataEntry = {
  id: string;
  key: string;
  value: string;
};

type ApiErrorPayload = {
  detail?: string | Array<{
    type?: string;
    loc?: Array<string | number>;
    msg?: string;
    input?: unknown;
  }>;
};

type EditorFormState = {
  type: ContentType;
  status: ContentStatus;
  locale: Locale;
  title: string;
  slug: string;
  description: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  tags: string;
  categories: string;
  aiIndexable: boolean;
  metadata: MetadataEntry[];
  publishedAt: string;
};

const emptyFormState: EditorFormState = {
  type: "project",
  status: "draft",
  locale: "en",
  title: "",
  slug: "",
  description: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  tags: "",
  categories: "",
  aiIndexable: true,
  metadata: [],
  publishedAt: "",
};

function createMetadataEntry(key = "", value = ""): MetadataEntry {
  return {
    id: `${key}-${Math.random().toString(36).slice(2, 9)}`,
    key,
    value,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapItemToForm(item: ApiContentItem): EditorFormState {
  return {
    type: item.type,
    status: item.status,
    locale: item.locale,
    title: item.title,
    slug: item.slug,
    description: item.description,
    body: item.body ?? "",
    seoTitle: item.seo_title ?? "",
    seoDescription: item.seo_description ?? "",
    canonicalUrl: item.canonical_url ?? "",
    tags: item.tags.join(", "),
    categories: item.categories.join(", "),
    aiIndexable: item.ai_indexable,
    metadata: Object.entries(item.metadata ?? {}).map(([key, value]) =>
      createMetadataEntry(key, String(value ?? ""))
    ),
    publishedAt: item.published_at ?? "",
  };
}

function readDraftFromStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const savedDraft = localStorage.getItem(key);
  if (!savedDraft) {
    return null;
  }

  try {
    return JSON.parse(savedDraft) as EditorFormState;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function getApiErrorMessage(payload: ApiErrorPayload | null) {
  if (!payload?.detail) {
    return "Save failed.";
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  const messages = payload.detail
    .map((issue) => {
      const path = issue.loc?.slice(1).join(".");
      return path ? `${path}: ${issue.msg ?? "Invalid value"}` : issue.msg;
    })
    .filter(Boolean);

  return messages.join("; ") || "Save failed.";
}

export function ContentEditor({ mode }: { mode: EditorMode }) {
  const params = useParams<{ itemId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemId = mode === "edit" ? params.itemId : null;
  const initialType = searchParams.get("type");
  const initialContentType =
    contentCollections.find((item) => item.type === initialType)?.type ??
    emptyFormState.type;
  const initialStorageKey = itemId
    ? `dashboard:draft:${itemId}`
    : `dashboard:draft:new:${initialContentType}`;
  const [form, setForm] = useState<EditorFormState>(() => ({
    ...(readDraftFromStorage(initialStorageKey) ?? emptyFormState),
    type: (readDraftFromStorage(initialStorageKey)?.type ?? initialContentType) as ContentType,
  }));
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [localDraftAt, setLocalDraftAt] = useState<string | null>(null);

  const storageKey = useMemo(() => {
    return itemId ? `dashboard:draft:${itemId}` : `dashboard:draft:new:${form.type}`;
  }, [form.type, itemId]);

  useEffect(() => {
    if (mode !== "edit" || !itemId) {
      return;
    }

    let cancelled = false;

    async function loadItem() {
      setIsLoading(true);
      const response = await fetch(`/api/dashboard/content/items/${itemId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        if (!cancelled) {
          setError("Unable to load content item.");
          setIsLoading(false);
        }
        return;
      }

      const payload = (await response.json()) as ApiContentItem;
      if (!cancelled) {
        setForm(mapItemToForm(payload));
        setIsLoading(false);
      }

      const savedDraft = localStorage.getItem(`dashboard:draft:${itemId}`);
      if (savedDraft && !cancelled) {
        try {
          const parsed = JSON.parse(savedDraft) as EditorFormState;
          setForm(parsed);
          setLocalDraftAt(new Date().toISOString());
        } catch {
          localStorage.removeItem(`dashboard:draft:${itemId}`);
        }
      }
    }

    void loadItem();
    return () => {
      cancelled = true;
    };
  }, [itemId, mode, storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(form));
      setLocalDraftAt(new Date().toISOString());
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [form, storageKey]);

  const metadataObject = useMemo(() => {
    return Object.fromEntries(
      form.metadata
        .filter((item) => item.key.trim())
        .map((item) => [item.key.trim(), item.value.trim()])
    );
  }, [form.metadata]);

  function updateForm<K extends keyof EditorFormState>(key: K, value: EditorFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const payload = {
      type: form.type,
      status: form.status,
      locale: form.locale,
      slug: form.slug || slugify(form.title),
      title: form.title,
      description: form.description,
      body: form.body || null,
      seo_title: form.seoTitle || null,
      seo_description: form.seoDescription || null,
      canonical_url: form.canonicalUrl || null,
      tags: splitCsv(form.tags),
      categories: splitCsv(form.categories),
      metadata: metadataObject,
      ai_indexable: form.aiIndexable,
      published_at: form.publishedAt || null,
    };

    startTransition(async () => {
      const response = await fetch(
        mode === "create"
          ? `/api/dashboard/content/${form.type}`
          : `/api/dashboard/content/items/${itemId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | ApiErrorPayload
          | null;
        setError(getApiErrorMessage(result));
        setIsSaving(false);
        return;
      }

      const item = (await response.json()) as ApiContentItem;
      localStorage.removeItem(storageKey);
      setIsSaving(false);
      router.replace(`/dashboard/content/${item.id}`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
            Editorial flow
          </p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)]">
            {mode === "create" ? "Create content" : "Edit content"}
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[var(--color-secondary)]">
            Markdown-first editing with preview, locale-aware metadata, and local draft persistence so autosave can evolve without reworking the editor surface.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/dashboard/content">Back to list</Link>
          </Button>
          <Button onClick={() => void handleSave()} disabled={isSaving || isLoading}>
            {isSaving ? "Saving..." : mode === "create" ? "Create entry" : "Save changes"}
          </Button>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
          {error}
        </p>
      ) : null}

      {localDraftAt ? (
        <p className="text-[12px] text-[var(--color-muted)]">
          Local draft updated {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(localDraftAt))}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 text-center text-[14px] text-[var(--color-muted)]">
          Loading editor…
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex flex-wrap gap-2">
              <Button variant={view === "edit" ? "primary" : "secondary"} size="sm" onClick={() => setView("edit")}>
                Edit
              </Button>
              <Button variant={view === "preview" ? "primary" : "secondary"} size="sm" onClick={() => setView("preview")}>
                Preview
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Type
                <select
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                  value={form.type}
                  onChange={(event) =>
                    updateForm("type", event.target.value as ContentType)
                  }
                  disabled={mode === "edit"}
                >
                  {contentCollections.map((collection) => (
                    <option key={collection.type} value={collection.type}>
                      {collection.type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Status
                <select
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                  value={form.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value as ContentStatus)
                  }
                >
                  {(["draft", "review", "published", "archived"] as ContentStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Locale
                <select
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                  value={form.locale}
                  onChange={(event) => updateForm("locale", event.target.value as Locale)}
                >
                  {Object.values(localeConfigs).map((locale) => (
                    <option key={locale.code} value={locale.code}>
                      {locale.nativeLabel}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              Title
              <input
                className="h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[15px] outline-none"
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;
                  updateForm("title", title);
                  if (!slugTouched) {
                    updateForm("slug", slugify(title));
                  }
                }}
                placeholder="Designing a preview-safe publishing pipeline"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Slug
                <input
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateForm("slug", slugify(event.target.value));
                  }}
                  placeholder="preview-safe-publishing"
                />
              </label>

              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Published at
                <input
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                  value={form.publishedAt}
                  onChange={(event) => updateForm("publishedAt", event.target.value)}
                  placeholder="2026-05-08T10:00:00Z"
                />
              </label>
            </div>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              Description
              <textarea
                className="min-h-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] outline-none"
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="One crisp summary for list views, cards, and search previews."
              />
            </label>

            {view === "edit" ? (
              <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
                Body
                <textarea
                  className="min-h-[420px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 font-mono text-[13px] leading-7 text-[var(--color-foreground)] outline-none"
                  value={form.body}
                  onChange={(event) => updateForm("body", event.target.value)}
                  placeholder="# Heading\n\nWrite in markdown or MDX-compatible text."
                />
              </label>
            ) : (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
                <MarkdownPreview value={form.body} />
              </div>
            )}
          </section>

          <aside className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Metadata
              </p>
              <h2 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
                SEO and structure
              </h2>
            </div>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              SEO title
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.seoTitle}
                onChange={(event) => updateForm("seoTitle", event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              SEO description
              <textarea
                className="min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] outline-none"
                value={form.seoDescription}
                onChange={(event) => updateForm("seoDescription", event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              Canonical URL
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.canonicalUrl}
                onChange={(event) => updateForm("canonicalUrl", event.target.value)}
                placeholder="https://example.com/architecture/preview-safe-publishing"
              />
            </label>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              Tags
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.tags}
                onChange={(event) => updateForm("tags", event.target.value)}
                placeholder="cms, markdown, publishing"
              />
            </label>

            <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
              Categories
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.categories}
                onChange={(event) => updateForm("categories", event.target.value)}
                placeholder="engineering platform, architecture"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[13px] text-[var(--color-secondary)]">
              <input
                type="checkbox"
                checked={form.aiIndexable}
                onChange={(event) => updateForm("aiIndexable", event.target.checked)}
              />
              Future AI indexing eligible
            </label>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-[var(--color-secondary)]">Structured metadata</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    updateForm("metadata", [...form.metadata, createMetadataEntry()])
                  }
                >
                  Add row
                </Button>
              </div>

              {form.metadata.map((entry) => (
                <div key={entry.id} className="grid gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                  <input
                    className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-[13px] outline-none"
                    value={entry.key}
                    onChange={(event) =>
                      updateForm(
                        "metadata",
                        form.metadata.map((item) =>
                          item.id === entry.id
                            ? { ...item, key: event.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="heroImageUrl"
                  />
                  <input
                    className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-[13px] outline-none"
                    value={entry.value}
                    onChange={(event) =>
                      updateForm(
                        "metadata",
                        form.metadata.map((item) =>
                          item.id === entry.id
                            ? { ...item, value: event.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="/media/2026/05/hero-asset.png"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateForm(
                        "metadata",
                        form.metadata.filter((item) => item.id !== entry.id)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <p className="text-[12px] leading-6 text-[var(--color-muted)]">
                Use metadata rows for cover images, social images, diagram references, or other collection-specific fields without changing the editor structure.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}