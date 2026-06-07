"use client";

import * as React from "react";
import Link from "next/link";
import { Database, GitCompareArrows, Network, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  clamp01,
  deterministicEmbedding,
  keywordSearch,
  semanticSearch,
  SEMANTIC_SEARCH_DATASET,
  SEMANTIC_SEARCH_DEFAULT_QUERY,
  SEMANTIC_SEARCH_QUERY_MAX_CHARS,
  similarityTier,
  type KeywordResult,
  type SemanticResult,
} from "@/lib/ai-lab/semantic-search";

type SearchStatus = "idle" | "loading" | "done" | "error";

type EmbedApiResponse = {
  embedding?: number[];
  mode?: "openai" | "deterministic";
  model?: string;
  error?: string;
};

const TOP_K = 5;

export function SemanticSearchPlayground() {
  const [query, setQuery] = React.useState(SEMANTIC_SEARCH_DEFAULT_QUERY);
  const [keywordResults, setKeywordResults] = React.useState<KeywordResult[]>(() =>
    keywordSearch(SEMANTIC_SEARCH_DEFAULT_QUERY, TOP_K)
  );
  const [semanticResults, setSemanticResults] = React.useState<SemanticResult[]>(() =>
    semanticSearch(deterministicEmbedding(SEMANTIC_SEARCH_DEFAULT_QUERY), TOP_K)
  );
  const [status, setStatus] = React.useState<SearchStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [embedMode, setEmbedMode] = React.useState<"openai" | "deterministic">(
    "deterministic"
  );
  const [embedModel, setEmbedModel] = React.useState("deterministic-hash-v1");

  const runSearch = React.useCallback(async () => {
    const normalized = query.trim().slice(0, SEMANTIC_SEARCH_QUERY_MAX_CHARS);
    if (normalized.length < 2) {
      setError("Query must be at least 2 characters.");
      return;
    }

    setStatus("loading");
    setError(null);
    setKeywordResults(keywordSearch(normalized, TOP_K));

    try {
      const response = await fetch("/api/ai-lab/semantic-search/embed-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: normalized }),
      });

      const body = (await response.json()) as EmbedApiResponse;
      if (!response.ok || !Array.isArray(body.embedding)) {
        throw new Error(body.error ?? "Failed to create query embedding.");
      }

      setSemanticResults(semanticSearch(body.embedding, TOP_K));
      setEmbedMode(body.mode ?? "deterministic");
      setEmbedModel(body.model ?? "unknown");
      setStatus("done");
    } catch (caught) {
      setSemanticResults([]);
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "Semantic retrieval failed. Please try again."
      );
    }
  }, [query]);

  const bestKeyword = keywordResults[0];
  const bestSemantic = semanticResults[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:col-span-4">
          <header className="mb-3 flex items-center gap-2">
            <Database size={15} className="text-[var(--color-muted)]" />
            <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Dataset Viewer
            </h2>
          </header>
          <p className="mb-3 text-[12px] text-[var(--color-secondary)]">
            {SEMANTIC_SEARCH_DATASET.length} curated records about FastAPI,
            Next.js, PostgreSQL, Redis, RAG, embeddings, vector search, AI
            agents, TeamShastra, SaaS architecture, and system design.
          </p>
          <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
            {SEMANTIC_SEARCH_DATASET.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-2"
              >
                <p className="mb-1 text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Doc {row.id}
                </p>
                <p className="text-[12px] leading-relaxed text-[var(--color-secondary)]">
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:col-span-4">
          <header className="mb-3 flex items-center gap-2">
            <Search size={15} className="text-[var(--color-muted)]" />
            <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Query Input
            </h2>
          </header>
          <label className="mb-1 block text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Search Query
          </label>
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, SEMANTIC_SEARCH_QUERY_MAX_CHARS))}
            maxLength={SEMANTIC_SEARCH_QUERY_MAX_CHARS}
            rows={5}
            placeholder="Try: backend api development"
            className={cn(
              "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[13px]",
              "text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]",
              "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
            )}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
            <span>{query.trim().length}/{SEMANTIC_SEARCH_QUERY_MAX_CHARS} characters</span>
            <span>Top {TOP_K} results</span>
          </div>

          <Button
            type="button"
            onClick={runSearch}
            disabled={status === "loading"}
            className="mt-3 w-full"
          >
            <Network size={15} />
            {status === "loading" ? "Searching..." : "Compare Searches"}
          </Button>

          <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[12px] text-[var(--color-secondary)]">
            <p>
              Runtime embedding mode: <strong>{embedMode}</strong>
            </p>
            <p>
              Model: <span className="font-mono">{embedModel}</span>
            </p>
            <p className="mt-1 text-[11px] text-[var(--color-muted)]">
              Precomputed dataset vectors are loaded from static JSON. Runtime
              cost is query embedding only.
            </p>
          </div>

          {error ? (
            <p className="mt-3 rounded-md border border-[#5a2c2c] bg-[#321d1d] px-3 py-2 text-[12px] text-[#ffc0c0]">
              {error}
            </p>
          ) : null}
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:col-span-4">
          <header className="mb-3 flex items-center gap-2">
            <GitCompareArrows size={15} className="text-[var(--color-muted)]" />
            <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Results
            </h2>
          </header>

          <div className="space-y-3">
            <ResultPanel title="Keyword Search" type="keyword" keywordResults={keywordResults} semanticResults={[]} />
            <ResultPanel title="Semantic Search" type="semantic" semanticResults={semanticResults} keywordResults={[]} />
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Comparison Section
          </h2>
          <p className="mt-2 text-[12px] text-[var(--color-secondary)]">
            Example query: <span className="font-mono">backend api development</span>
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Keyword Search
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-secondary)]">
                {bestKeyword
                  ? bestKeyword.text
                  : "No direct term overlap found."}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Semantic Search
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-secondary)]">
                {bestSemantic
                  ? bestSemantic.text
                  : "No semantic ranking available."}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Similarity Visualization
          </h2>
          <ul className="mt-3 space-y-2">
            {[
              { value: 0.95, label: "Very Similar" },
              { value: 0.8, label: "Strong Match" },
              { value: 0.6, label: "Related" },
              { value: 0.4, label: "Weak Match" },
              { value: 0.2, label: "Unrelated" },
            ].map((item) => {
              const tier = similarityTier(item.value);
              return (
                <li key={item.label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5">
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-mono text-[var(--color-foreground)]">{item.value.toFixed(2)}</span>
                    <span className={cn("rounded px-2 py-0.5 text-[10.5px] font-medium", tier.colorClass)}>
                      {item.label}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--color-surface-3)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-foreground)]"
                      style={{ width: `${clamp01(item.value) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Search Pipeline Visualization
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PipelineCard
              title="Keyword Search"
              steps={["Query", "Keyword Matching", "Results"]}
            />
            <PipelineCard
              title="Semantic Search"
              steps={[
                "Query",
                "Embedding",
                "Cosine Similarity",
                "Ranking",
                "Results",
              ]}
            />
          </div>
        </article>

        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            RAG Connection
          </h2>
          <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[12px] text-[var(--color-secondary)]">
            <p>Documents</p>
            <p>↓</p>
            <p>Chunking</p>
            <p>↓</p>
            <p>Embeddings</p>
            <p>↓</p>
            <p>Vector Search</p>
            <p>↓</p>
            <p>Retrieved Chunks</p>
            <p>↓</p>
            <p>LLM</p>
          </div>
          <Link
            href="/ai-lab/rag-explorer"
            className="mt-3 inline-flex text-[12.5px] font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
          >
            Try RAG Explorer →
          </Link>
        </article>
      </section>
    </div>
  );
}

function ResultPanel({
  title,
  type,
  keywordResults,
  semanticResults,
}: {
  title: string;
  type: "keyword" | "semantic";
  keywordResults: KeywordResult[];
  semanticResults: SemanticResult[];
}) {
  const items = type === "keyword" ? keywordResults : semanticResults;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
      <p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-[12px] text-[var(--color-muted)]">No results yet.</p>
        ) : null}
        {type === "keyword"
          ? keywordResults.map((row, index) => (
              <div key={row.id} className="rounded-md border border-[var(--color-border)] p-2">
                <p className="text-[11px] text-[var(--color-muted)]">Rank {index + 1}</p>
                <p className="text-[12px] text-[var(--color-secondary)]">{row.text}</p>
                <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                  Matched terms: {row.matchedTerms.length > 0 ? row.matchedTerms.join(", ") : "None"}
                </p>
              </div>
            ))
          : semanticResults.map((row, index) => {
              const tier = similarityTier(row.score);
              return (
                <div key={row.id} className="rounded-md border border-[var(--color-border)] p-2">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-[var(--color-muted)]">Rank {index + 1}</p>
                    <span className={cn("rounded px-1.5 py-0.5 text-[10.5px] font-medium", tier.colorClass)}>
                      {tier.label}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--color-secondary)]">{row.text}</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--color-muted)]">
                    Similarity: {row.score.toFixed(4)}
                  </p>
                  <div className="mt-1 h-1.5 rounded-full bg-[var(--color-surface-3)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-foreground)]"
                      style={{ width: `${clamp01(row.score) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

function PipelineCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
      <p className="mb-2 text-[12px] font-medium text-[var(--color-foreground)]">{title}</p>
      <div className="flex flex-col gap-1 text-[12px] text-[var(--color-secondary)]">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <p>{step}</p>
            {index < steps.length - 1 ? <p>↓</p> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
