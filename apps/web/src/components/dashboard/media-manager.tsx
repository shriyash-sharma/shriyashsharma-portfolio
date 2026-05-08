"use client";

import Image from "next/image";
import { startTransition, useEffect, useState } from "react";
import type { MediaAsset, MediaListResponse, MediaUploadResponse } from "@/lib/api/contracts/admin";
import { Button } from "@/components/ui/button";

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MediaManager() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMedia() {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/media", { cache: "no-store" });

      if (!response.ok) {
        if (!cancelled) {
          setError("Unable to load media assets.");
          setIsLoading(false);
        }
        return;
      }

      const payload = (await response.json()) as MediaListResponse;

      if (!cancelled) {
        setItems(payload.items);
        setIsLoading(false);
      }
    }

    void loadMedia();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload() {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt_text", altText);

    startTransition(async () => {
      const response = await fetch("/api/dashboard/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        setError(payload?.detail ?? "Upload failed.");
        setIsUploading(false);
        return;
      }

      const payload = (await response.json()) as MediaUploadResponse;
      setItems((current) => [payload.item, ...current]);
      setFile(null);
      setAltText("");
      setIsUploading(false);
    });
  }

  return (
    <div className="grid gap-6">
      <section>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
          Media foundation
        </p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)]">
          Asset workspace
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-8 text-[var(--color-secondary)]">
          Local image storage with metadata, authenticated upload boundaries, and a shape that can be swapped to cloud storage later.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
            Image file
            <input
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-[14px]"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
            Alt text
            <input
              className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[14px] outline-none"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Architecture diagram of the ingestion flow"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
              {error}
            </p>
          ) : null}

          <Button onClick={() => void handleUpload()} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>

        <div className="grid gap-3">
          {isLoading ? (
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-[14px] text-[var(--color-muted)]">
              Loading media assets…
            </div>
          ) : null}

          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-[160px_minmax(0,1fr)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}${item.url}`}
                  alt={item.alt_text ?? item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 160px"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[16px] font-medium text-[var(--color-foreground)]">
                      {item.filename}
                    </h2>
                    <p className="mt-1 text-[13px] text-[var(--color-muted)]">
                      {item.alt_text || "No alt text"}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(item.url)}
                  >
                    Copy URL
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-[var(--color-muted-2)]">
                  <span>{item.content_type}</span>
                  <span>{formatBytes(item.size)}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>

                <p className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-[12px] text-[var(--color-secondary)]">
                  {item.url}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}