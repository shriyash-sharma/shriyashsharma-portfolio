"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { ApiContentItem, ContentStatus, ContentType } from "@/lib/api/contracts/content";
import { Button } from "@/components/ui/button";
import { MarkdownPreview } from "@/components/dashboard/markdown-preview";
import { getMetadataFieldSpecs } from "@/lib/content/project-metadata";
import {
  ASSISTANT_QUESTIONS_METADATA_KEY,
  metadataAssistantQuestions,
  metadataString,
} from "@/lib/content/metadata-helpers";
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
  intro: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  tags: string;
  categories: string;
  aiIndexable: boolean;
  assistantQuestions: string;
  metadata: MetadataEntry[];
  publishedAt: string;
};

type StoredDraft = {
  form: EditorFormState;
  savedAt: string | null;
};

const emptyFormState: EditorFormState = {
  type: "project",
  status: "draft",
  locale: "en",
  title: "",
  slug: "",
  description: "",
  intro: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  tags: "",
  categories: "",
  aiIndexable: true,
  assistantQuestions: "",
  metadata: [],
  publishedAt: "",
};

const assistantQuestionContentTypes: ContentType[] = ["project", "case-study"];

function isAssistantQuestionsMetadataKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  return normalized === "assistant_questions" || normalized === "assistantquestions";
}

function isIntroMetadataKey(key: string): boolean {
  return key.trim().toLowerCase() === "intro";
}

function supportsProjectIntro(type: ContentType): boolean {
  return type === "project" || type === "case-study";
}

function isReservedMetadataKey(key: string): boolean {
  return isAssistantQuestionsMetadataKey(key) || isIntroMetadataKey(key);
}

function supportsAssistantQuestions(type: ContentType): boolean {
  return assistantQuestionContentTypes.includes(type);
}

const markdownEnabledContentTypes: ContentType[] = [
  "project",
  "case-study",
  "architecture-note",
  "article",
];

const markdownSyntaxExamples = [
  "# Heading",
  "## Subheading",
  "**Bold**",
  "*Italic*",
  "`Inline Code`",
  "```ts\nconst answer = 42;\n```",
  "- Bullet Lists",
  "1. Numbered Lists",
  "| Column | Value |",
  "> Blockquotes",
  "[Links](https://example.com)",
  "![Images](future support)",
];

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
  const assistantQuestions = metadataAssistantQuestions(item.metadata ?? {});

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
    assistantQuestions: assistantQuestions.join("\n"),
    intro: metadataString(item.metadata ?? {}, "intro") ?? "",
    metadata: Object.entries(item.metadata ?? {})
      .filter(([key]) => !isReservedMetadataKey(key))
      .map(([key, value]) => createMetadataEntry(key, String(value ?? ""))),
    publishedAt: item.published_at ?? "",
  };
}

function applyMetadataDefaults(
  type: ContentType,
  metadata: MetadataEntry[]
): MetadataEntry[] {
  const supportedFields = getMetadataFieldSpecs(type).filter(
    (field) => !isReservedMetadataKey(field.key)
  );
  if (!supportedFields.length) {
    return metadata;
  }

  const remainingEntries = [...metadata];
  const defaultEntries = supportedFields.flatMap((field) => {
    const candidateKeys = [field.key, ...(field.aliases ?? [])].map((key) =>
      key.trim().toLowerCase()
    );
    const matchIndex = remainingEntries.findIndex((entry) =>
      candidateKeys.includes(entry.key.trim().toLowerCase())
    );

    if (matchIndex >= 0) {
      return [remainingEntries.splice(matchIndex, 1)[0]];
    }

    return [];
  });

  return [...defaultEntries, ...remainingEntries];
}

function withMetadataDefaults(form: EditorFormState): EditorFormState {
  return {
    ...form,
    metadata: applyMetadataDefaults(form.type, form.metadata),
  };
}

function isEditorFormState(value: unknown): value is EditorFormState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<EditorFormState>;
  return (
    typeof candidate.type === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.locale === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.intro === "string" &&
    typeof candidate.body === "string" &&
    typeof candidate.seoTitle === "string" &&
    typeof candidate.seoDescription === "string" &&
    typeof candidate.canonicalUrl === "string" &&
    typeof candidate.tags === "string" &&
    typeof candidate.categories === "string" &&
    typeof candidate.aiIndexable === "boolean" &&
    typeof candidate.assistantQuestions === "string" &&
    Array.isArray(candidate.metadata) &&
    typeof candidate.publishedAt === "string"
  );
}

function readDraftFromStorage(key: string): StoredDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedDraft = localStorage.getItem(key);
  if (!savedDraft) {
    return null;
  }

  try {
    const parsed = JSON.parse(savedDraft) as unknown;

    if (
      parsed &&
      typeof parsed === "object" &&
      "form" in parsed &&
      isEditorFormState((parsed as { form?: unknown }).form)
    ) {
      const storedDraft = parsed as { form: EditorFormState; savedAt?: unknown };
      const savedAt =
        typeof storedDraft.savedAt === "string"
          ? storedDraft.savedAt
          : null;

      return {
        form: storedDraft.form,
        savedAt,
      };
    }

    if (isEditorFormState(parsed)) {
      return { form: parsed, savedAt: null };
    }

    localStorage.removeItem(key);
    return null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function writeDraftToStorage(key: string, form: EditorFormState) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      form,
      savedAt: new Date().toISOString(),
    })
  );
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
  const initialDraft =
    mode === "create" ? readDraftFromStorage(`dashboard:draft:new:${initialContentType}`) : null;
  const initialStorageKey = itemId
    ? `dashboard:draft:${itemId}`
    : `dashboard:draft:new:${initialContentType}`;
  const [form, setForm] = useState<EditorFormState>(() =>
    withMetadataDefaults({
      ...(initialDraft?.form ?? emptyFormState),
      type: (initialDraft?.form.type ?? initialContentType) as ContentType,
    })
  );
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [localDraftAt, setLocalDraftAt] = useState<string | null>(initialDraft?.savedAt ?? null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [recoverableDraft, setRecoverableDraft] = useState<StoredDraft | null>(null);

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
      setRecoverableDraft(null);
      const response = await fetch(`/api/dashboard/content/items/${itemId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        if (!cancelled) {
          const savedDraft = readDraftFromStorage(`dashboard:draft:${itemId}`);

          if (savedDraft) {
            setForm(withMetadataDefaults(savedDraft.form));
            setLocalDraftAt(savedDraft.savedAt ?? new Date().toISOString());
            setError("Unable to load the saved CMS entry. Loaded your local draft instead.");
          } else {
            setError("Unable to load content item.");
          }

          setIsLoading(false);
        }
        return;
      }

      const payload = (await response.json()) as ApiContentItem;
      if (!cancelled) {
        setForm(withMetadataDefaults(mapItemToForm(payload)));
        setLocalDraftAt(null);
        setIsLoading(false);
      }

      const savedDraft = readDraftFromStorage(`dashboard:draft:${itemId}`);
      if (savedDraft && !cancelled) {
        setRecoverableDraft(savedDraft);
      }
    }

    void loadItem();
    return () => {
      cancelled = true;
    };
  }, [itemId, mode, storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      writeDraftToStorage(storageKey, form);
      setLocalDraftAt(new Date().toISOString());
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [form, storageKey]);

  const metadataObject = useMemo(() => {
    const entries = Object.fromEntries(
      form.metadata
        .filter(
          (item) =>
            item.key.trim() &&
            item.value.trim() &&
            !isReservedMetadataKey(item.key)
        )
        .map((item) => [item.key.trim(), item.value.trim()])
    );

    const assistantQuestions = form.assistantQuestions
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (supportsAssistantQuestions(form.type) && assistantQuestions.length > 0) {
      entries[ASSISTANT_QUESTIONS_METADATA_KEY] = assistantQuestions.join("\n");
    }

    const intro = form.intro.trim();
    if (supportsProjectIntro(form.type) && intro) {
      entries.intro = intro;
    }

    return entries;
  }, [form.assistantQuestions, form.intro, form.metadata, form.type]);
  const previewTags = useMemo(() => splitCsv(form.tags), [form.tags]);
  const previewCategories = useMemo(() => splitCsv(form.categories), [form.categories]);
  const previewMetadata = useMemo(
    () =>
      form.metadata.filter(
        (entry) => entry.key.trim() && entry.value.trim()
      ),
    [form.metadata]
  );
  const supportedMetadataFields = useMemo(
    () =>
      getMetadataFieldSpecs(form.type).filter(
        (field) => !isReservedMetadataKey(field.key)
      ),
    [form.type]
  );
  const hasStructuredMetadataGuide = supportedMetadataFields.length > 0;
  const metadataValueUsesTextarea =
    form.type === "project" || form.type === "case-study";
  const supportsMarkdownBody = markdownEnabledContentTypes.includes(form.type);
  const showAssistantQuestions = supportsAssistantQuestions(form.type);
  const showProjectIntro = supportsProjectIntro(form.type);

  function updateForm<K extends keyof EditorFormState>(key: K, value: EditorFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleRestoreDraft() {
    if (!recoverableDraft) {
      return;
    }

    setForm(withMetadataDefaults(recoverableDraft.form));
    setLocalDraftAt(recoverableDraft.savedAt ?? new Date().toISOString());
    setRecoverableDraft(null);
    setError(null);
  }

  function handleDismissDraft() {
    setRecoverableDraft(null);
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

    startTransition(() => {
      void (async () => {
        try {
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
            return;
          }

          const item = (await response.json()) as ApiContentItem;
          localStorage.removeItem(storageKey);
          setLastSavedAt(new Date().toISOString());

          if (mode === "create") {
            router.replace(`/dashboard/content/${item.id}`);
            return;
          }

          setForm(withMetadataDefaults(mapItemToForm(item)));
          setSlugTouched(true);
        } catch (saveError) {
          setError(
            saveError instanceof Error
              ? saveError.message
              : "Save failed unexpectedly."
          );
        } finally {
          setIsSaving(false);
        }
      })();
    });
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
            Editorial flow
          </p>
          <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[30px]">
            {mode === "create" ? "Create content" : "Edit content"}
          </h1>
          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[var(--color-secondary)] sm:text-[15px] sm:leading-8">
            Markdown-first editing with preview, locale-aware metadata, and local draft persistence so autosave can evolve without reworking the editor surface.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/dashboard/content">Back to list</Link>
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : mode === "create" ? "Create entry" : "Save changes"}
          </Button>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
          {error}
        </p>
      ) : null}

      {recoverableDraft ? (
        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-4 text-[13px] text-[var(--color-secondary)]">
          <p className="text-[var(--color-foreground)]">
            A local draft is available for this item.
            {recoverableDraft.savedAt
              ? ` Saved ${new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(recoverableDraft.savedAt))}.`
              : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={handleRestoreDraft}>
              Restore local draft
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleDismissDraft}>
              Keep CMS version
            </Button>
          </div>
        </div>
      ) : null}

      {localDraftAt ? (
        <p className="text-[12px] text-[var(--color-muted)]">
          Local draft updated {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(localDraftAt))}
        </p>
      ) : null}

      {lastSavedAt ? (
        <p className="text-[12px] text-[var(--color-muted)]">
          Saved {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lastSavedAt))}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 text-center text-[14px] text-[var(--color-muted)]">
          Loading editor…
        </div>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid w-full content-start gap-4 self-start rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:rounded-[24px] sm:p-5">
            <div className="flex flex-wrap gap-2">
              <Button variant={view === "edit" ? "primary" : "secondary"} size="sm" onClick={() => setView("edit")}>
                Edit
              </Button>
              <Button variant={view === "preview" ? "primary" : "secondary"} size="sm" onClick={() => setView("preview")}>
                Preview
              </Button>
            </div>

            {view === "edit" ? (
              <>
                <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                    Type
                    <select
                      className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                      value={form.type}
                      onChange={(event) => {
                        const nextType = event.target.value as ContentType;
                        setForm((current) =>
                          withMetadataDefaults({
                            ...current,
                            type: nextType,
                          })
                        );
                      }}
                      disabled={mode === "edit"}
                    >
                      {contentCollections.map((collection) => (
                        <option key={collection.type} value={collection.type}>
                          {collection.type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
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

                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
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

                <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
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

                <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
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

                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                    Published at
                    <input
                      className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                      value={form.publishedAt}
                      onChange={(event) => updateForm("publishedAt", event.target.value)}
                      placeholder="2026-05-08T10:00:00Z"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                  Description
                  <textarea
                    className="min-h-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] outline-none"
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    placeholder="One crisp summary for list views, cards, and search previews."
                  />
                </label>

                {showProjectIntro ? (
                  <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                    Intro
                    <textarea
                      className="min-h-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] outline-none"
                      value={form.intro}
                      onChange={(event) => updateForm("intro", event.target.value)}
                      placeholder="Lead paragraph shown under the project title on the detail page."
                    />
                    <span className="text-[12px] leading-6 text-[var(--color-muted)]">
                      Separate from Description. Used only on the project detail hero, not on cards or SEO.
                    </span>
                  </label>
                ) : null}

                <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                  {supportsMarkdownBody ? "Body (Markdown)" : "Body"}
                  <textarea
                    className="min-h-[240px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 font-mono text-[13px] leading-7 text-[var(--color-foreground)] outline-none sm:min-h-[320px] sm:px-4 sm:py-4 lg:min-h-[420px]"
                    value={form.body}
                    onChange={(event) => updateForm("body", event.target.value)}
                    placeholder="# Heading\n\nWrite in markdown or MDX-compatible text."
                  />
                </label>

                {supportsMarkdownBody ? (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                      Markdown help
                    </p>
                    <p className="mt-3 text-[13px] leading-6 text-[var(--color-muted)]">
                      Supported syntax uses GitHub Flavored Markdown. Raw markdown is stored in the CMS and rendered on the frontend. HTML editing and arbitrary scripts are not supported.
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {markdownSyntaxExamples.map((example) => (
                        <div
                          key={example}
                          className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-[12px] text-[var(--color-secondary)]"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="grid gap-5">
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                    <span>{form.type}</span>
                    <span>·</span>
                    <span>{form.status}</span>
                    <span>·</span>
                    <span>{form.locale}</span>
                    {form.publishedAt ? (
                      <>
                        <span>·</span>
                        <span>{form.publishedAt}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[34px]">
                    {form.title || "Untitled entry"}
                  </h2>
                  <p className="mt-3 font-mono text-[12px] text-[var(--color-muted)]">
                    /{form.slug || "draft-slug"}
                  </p>
                  <p className="mt-5 text-[16px] leading-8 text-[var(--color-secondary)]">
                    {form.description || "Description preview will appear here once you add one."}
                  </p>

                  {previewTags.length || previewCategories.length ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                          Tags
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {previewTags.length ? previewTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
                            >
                              {tag}
                            </span>
                          )) : <span className="text-[13px] text-[var(--color-muted)]">No tags</span>}
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                          Categories
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {previewCategories.length ? previewCategories.map((category) => (
                            <span
                              key={category}
                              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
                            >
                              {category}
                            </span>
                          )) : <span className="text-[13px] text-[var(--color-muted)]">No categories</span>}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                        Body preview
                      </p>
                      <h3 className="mt-2 text-[20px] font-medium text-[var(--color-foreground)]">
                        Rendered content
                      </h3>
                    </div>
                  </div>
                  <div className="mt-5">
                    <MarkdownPreview value={form.body || form.description} />
                  </div>
                </div>

                {previewMetadata.length ? (
                  <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                      Structured metadata preview
                    </p>
                    <div className="mt-5 grid gap-4">
                      {previewMetadata.map((entry) => (
                        <article
                          key={entry.id}
                          className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                        >
                          <h3 className="text-[16px] font-medium text-[var(--color-foreground)]">
                            {entry.key}
                          </h3>
                          <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-[var(--color-secondary)]">
                            {entry.value}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <aside className="grid w-full content-start gap-4 self-start rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:rounded-[24px] sm:p-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Metadata
              </p>
              <h2 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
                SEO and structure
              </h2>
            </div>

            <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
              SEO title
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.seoTitle}
                onChange={(event) => updateForm("seoTitle", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
              SEO description
              <textarea
                className="min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] outline-none"
                value={form.seoDescription}
                onChange={(event) => updateForm("seoDescription", event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
              Canonical URL
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.canonicalUrl}
                onChange={(event) => updateForm("canonicalUrl", event.target.value)}
                placeholder="https://example.com/architecture/preview-safe-publishing"
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
              Tags
              <input
                className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
                value={form.tags}
                onChange={(event) => updateForm("tags", event.target.value)}
                placeholder="cms, markdown, publishing"
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
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

            {showAssistantQuestions ? (
              <label className="flex flex-col gap-2 text-[13px] text-[var(--color-secondary)]">
                AI assistant questions
                <textarea
                  className="min-h-32 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px] leading-7 outline-none"
                  value={form.assistantQuestions}
                  onChange={(event) =>
                    updateForm("assistantQuestions", event.target.value)
                  }
                  placeholder={
                    "One question per line.\nWhat problem does this project solve?\nHow is the backend structured?"
                  }
                />
                <span className="text-[12px] leading-6 text-[var(--color-muted)]">
                  These prompts appear in the Ask AI block on the public detail page. Only the questions you enter here are shown.
                </span>
              </label>
            ) : null}

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
                <div key={entry.id} className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
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
                    placeholder={hasStructuredMetadataGuide ? "Known key or custom heading" : "metadata key"}
                  />
                  {metadataValueUsesTextarea ? (
                    <textarea
                      className="min-h-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-[13px] leading-7 outline-none"
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
                      placeholder={
                        hasStructuredMetadataGuide
                          ? "Description, markdown, or multiline value"
                          : "metadata value"
                      }
                    />
                  ) : (
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
                      placeholder={
                        hasStructuredMetadataGuide
                          ? "Description, markdown, URL, or short value"
                          : "metadata value"
                      }
                    />
                  )}
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
                {hasStructuredMetadataGuide
                  ? "Known keys render in their built-in page slots. Any other key/value pair becomes a standalone section on the public detail page, using the first field as the heading and the second as the description. Empty fields stay in the editor for guidance but are not saved or rendered publicly."
                  : "Use metadata rows for cover images, social images, diagram references, or other collection-specific fields without changing the editor structure."}
              </p>

              {hasStructuredMetadataGuide ? (
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                    Supported metadata keys
                  </p>
                  <div className="mt-4 grid gap-3">
                    {supportedMetadataFields.map((field) => (
                      <div
                        key={field.key}
                        className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--color-border)] px-2 py-1 font-mono text-[11px] text-[var(--color-foreground)]">
                            {field.key}
                          </span>
                          {field.aliases?.length ? (
                            <span className="text-[11px] text-[var(--color-muted)]">
                              Aliases: {field.aliases.join(", ")}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-[13px] text-[var(--color-foreground)]">
                          {field.label}
                        </p>
                        <p className="mt-1 text-[12px] leading-6 text-[var(--color-muted)]">
                          {field.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}