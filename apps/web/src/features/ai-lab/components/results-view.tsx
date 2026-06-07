"use client";

import {
  ArrowRight,
  Boxes,
  Layers,
  ListOrdered,
  MessageCircleQuestion,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { RagExplorerResponse } from "@/lib/api/contracts/ai-lab";
import { StepCard, StepConnector } from "./step-card";
import { MetricsBar } from "./metrics-bar";
import { highlightTerms, questionTerms } from "./highlight";

function formatVector(values: number[], withEllipsis = true): string {
  if (!values.length) return "[ ]";
  return `[${values.map((value) => value.toFixed(2)).join(", ")}${
    withEllipsis ? " …" : ""
  }]`;
}

export function ResultsView({ result }: { result: RagExplorerResponse }) {
  const terms = questionTerms(result.query);
  const topScore = result.retrieved[0]?.score ?? 0;
  const fullVector =
    result.embedding.query_vector_full ?? result.embedding.query_vector_preview;

  return (
    <div className="flex flex-col gap-4">
      <MetricsBar result={result} />

      <StepCard
        step={1}
        title="Query"
        icon={MessageCircleQuestion}
        summary="The question you want answered from the content."
        explainer={
          <p>
            Everything starts with the user&apos;s question. RAG never sends just
            this question to the model alone — it first finds supporting evidence
            so the answer is grounded in real text.
          </p>
        }
      >
        <blockquote className="rounded-lg border-l-2 border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-3 text-[13.5px] text-[var(--color-foreground)]">
          {result.query}
        </blockquote>
      </StepCard>

      <StepConnector />

      <StepCard
        step={2}
        title="Chunking"
        icon={Layers}
        summary={`${result.chunks.length} chunk${
          result.chunks.length === 1 ? "" : "s"
        } · size ${result.chunk_size} · overlap ${result.chunk_overlap}`}
        explainer={
          <>
            <p>
              <Term>What:</Term> The document is broken into smaller, overlapping
              pieces. Each chunk aims to hold a single idea.
            </p>
            <p>
              <Term>Why:</Term> Embedding models and context windows are
              size-limited, and retrieval is far more precise when each piece
              covers one topic — so the system can fetch just the relevant span.
            </p>
            <p>
              <Term>Overlap:</Term> Chunks repeat a little text from their
              neighbor so an idea split across a boundary still appears, in full,
              in at least one chunk. That protects recall.
            </p>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge label="Chunk size" value={`${result.chunk_size} chars`} />
          <Badge label="Overlap" value={`${result.chunk_overlap} chars`} />
          <Badge label="Total chunks" value={String(result.chunks.length)} />
        </div>
        <div className="flex flex-col gap-2">
          {result.chunks.map((chunk) => (
            <details
              key={chunk.index}
              className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]"
            >
              <summary className="flex cursor-pointer list-none flex-col gap-1.5 px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-3 text-[12.5px]">
                  <span className="flex items-center gap-2 font-medium text-[var(--color-foreground)]">
                    <span className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 font-mono text-[11px]">
                      #{chunk.index}
                    </span>
                    {chunk.heading_path ? (
                      <span className="text-[var(--color-muted)]">
                        {chunk.heading_path}
                      </span>
                    ) : (
                      <span className="text-[var(--color-muted)]">Chunk</span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-muted)]">
                    <span>{chunk.char_count} ch</span>
                    <span aria-hidden>·</span>
                    <span>~{chunk.token_estimate} tok</span>
                  </span>
                </div>
                <p className="line-clamp-2 font-mono text-[11.5px] leading-relaxed text-[var(--color-secondary)] group-open:hidden">
                  {chunk.content}
                </p>
              </summary>
              <p className="border-t border-[var(--color-border)] px-3.5 py-3 font-mono text-[11.5px] leading-relaxed text-[var(--color-secondary)] whitespace-pre-wrap">
                {chunk.content}
              </p>
            </details>
          ))}
        </div>
      </StepCard>

      <StepConnector />

      <StepCard
        step={3}
        title="Embeddings"
        icon={Boxes}
        summary={`${result.embedding.model} · ${result.embedding.dimensions} dimensions`}
        explainer={
          <>
            <p>
              <Term>What:</Term> An embedding converts text into numbers that
              represent meaning. Each chunk and the question become a vector — a
              list of {result.embedding.dimensions} numbers.
            </p>
            <p>
              <Term>Why:</Term> Vectors let a computer measure how similar two
              pieces of text are by how closely their vectors point — even when
              they share no exact words.
            </p>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Model" value={result.embedding.model} mono />
          <Stat label="Dimensions" value={String(result.embedding.dimensions)} />
          <Stat
            label="Generation time"
            value={`${Math.round(result.embedding.generation_ms)} ms`}
          />
        </div>

        <details className="group mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Vector preview
            </span>
            <span className="text-[11px] text-[var(--color-muted)]">
              {result.embedding.query_vector_preview.length} preview / {fullVector.length} full dims
            </span>
          </summary>

          <div className="border-t border-[var(--color-border)] px-3.5 py-3">
            <code className="block overflow-x-auto font-mono text-[12.5px] text-[var(--color-foreground)]">
              {formatVector(result.embedding.query_vector_preview)}
            </code>
            <VectorBars values={result.embedding.query_vector_preview} />

            <div className="mt-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Full preview values
              </p>
              <code className="mt-1.5 block overflow-x-auto whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-[var(--color-secondary)]">
                {formatVector(fullVector, false)}
              </code>
            </div>
          </div>
        </details>

        {/* Conceptual question-vs-chunk comparison */}
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <ConceptVector label="Question vector" tone="strong" />
          <div className="flex items-center justify-center text-[11px] font-medium text-[var(--color-muted)]">
            cosine similarity →
          </div>
          <ConceptVector label="Chunk vector" tone="muted" />
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--color-muted)]">
          The question and every chunk are embedded with the same model, so they
          live in the same space and can be compared directly.
        </p>

        {result.embedding.is_fallback ? (
          <p className="mt-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-2.5 text-[11.5px] text-[var(--color-muted)]">
            Note: the open-source model was unavailable in this environment, so a
            deterministic local fallback embedding was used. Similarity still
            tracks shared vocabulary.
          </p>
        ) : null}
      </StepCard>

      <StepConnector />

      <StepCard
        step={4}
        title="Vector Search"
        icon={Search}
        summary={`Top-${result.vector_search.top_k} of ${result.vector_search.total_chunks} chunks · ${result.vector_search.search_ms.toFixed(
          1
        )} ms`}
        explainer={
          <>
            <p>
              <Term>What:</Term> The question vector is compared against every
              chunk vector with cosine similarity, and the closest matches are
              kept.
            </p>
            <p>
              <Term>Why:</Term> This is semantic search — it finds passages that
              mean the same thing as the question, which is how RAG locates
              relevant evidence quickly, even across huge corpora.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {["Question", "Embedding", "Similarity Search", "Ranking", "Top Matches"].map(
            (label, index, arr) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[12px] font-medium",
                    index === arr.length - 1
                      ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]"
                  )}
                >
                  {label}
                </span>
                {index < arr.length - 1 ? (
                  <ArrowRight
                    size={13}
                    className="text-[var(--color-muted)]"
                    aria-hidden
                  />
                ) : null}
              </div>
            )
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {result.retrieved.map((item) => (
            <SimilarityRow
              key={item.rank}
              rank={item.rank}
              chunkIndex={item.chunk_index}
              score={item.score}
              topScore={topScore}
            />
          ))}
        </div>
      </StepCard>

      <StepConnector />

      <StepCard
        step={5}
        title="Retrieved Chunks"
        icon={ListOrdered}
        summary="Highest-scoring chunks become the grounding context."
        explainer={
          <p>
            These are the passages the search judged most relevant. Each score is
            the cosine similarity between the question and the chunk — higher
            means a closer semantic match. These chunks become the grounding
            context supplied to the language model. Matching terms are
            highlighted.
          </p>
        }
      >
        <div className="flex flex-col gap-2.5">
          {result.retrieved.map((item) => (
            <div
              key={item.rank}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--color-foreground)]">
                  <span className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 font-mono text-[11px]">
                    Rank {item.rank}
                  </span>
                  Chunk #{item.chunk_index}
                  <span className="font-mono text-[11px] text-[var(--color-muted)]">
                    ~{item.token_estimate} tok
                  </span>
                </span>
                <span className="font-mono text-[12px] font-medium text-[var(--color-foreground)]">
                  {Math.round(item.score * 100)}%
                </span>
              </div>
              <ScoreBar score={item.score} topScore={topScore} />
              <p className="mt-2 font-mono text-[11.5px] leading-relaxed text-[var(--color-secondary)]">
                {highlightTerms(item.content, terms)}
              </p>
            </div>
          ))}
        </div>
      </StepCard>

      <StepConnector />

      <StepCard
        step={6}
        title="Prompt Construction"
        icon={Terminal}
        summary={`Final prompt is ${result.prompt.total_chars.toLocaleString()} characters.`}
        explainer={
          <p>
            <Term>Grounding:</Term> the retrieved chunks are stitched together
            with a system prompt and the question into one final prompt. The
            model is instructed to answer only from this context, which sharply
            reduces hallucination.
          </p>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge
            label="Context size"
            value={`${result.prompt.context_block.length.toLocaleString()} ch`}
          />
          <Badge
            label="Prompt size"
            value={`${result.prompt.total_chars.toLocaleString()} ch`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <PromptPart label="System Prompt" body={result.prompt.system_prompt} />
          <PromptOperator symbol="+" />
          <PromptPart label="Retrieved Context" body={result.prompt.context_block} />
          <PromptOperator symbol="+" />
          <PromptPart label="User Question" body={result.prompt.user_question} />
          <PromptOperator symbol="=" />
          <PromptPart label="Final Prompt" body={result.prompt.final_prompt} emphasis />
        </div>
      </StepCard>

      <StepConnector />

      <StepCard
        step={7}
        title="Final Answer"
        icon={Sparkles}
        summary={`${result.answer.provider} · ${result.answer.model}`}
        explainer={
          <p>
            The grounded prompt is sent to the language model, which writes an
            answer using only the retrieved evidence. Because the facts come from
            your content, the response stays accurate and traceable.
          </p>
        }
      >
        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="Generation"
            value={`${Math.round(result.answer.response_ms)} ms`}
          />
          <Stat label="Length" value={`${result.answer.text.length} ch`} />
          <Stat label="Sources used" value={String(result.retrieved.length)} />
          <ConfidenceStat topScore={topScore} />
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[13.5px] leading-relaxed text-[var(--color-foreground)] whitespace-pre-wrap">
          {result.answer.text}
        </div>
        {!result.answer.implemented ? (
          <p className="mt-2 text-[11.5px] text-[var(--color-muted)]">
            The retrieval steps ran locally; only the final generation requires a
            configured model.
          </p>
        ) : null}
      </StepCard>
    </div>
  );
}

function Term({ children }: { children: React.ReactNode }) {
  return (
    <strong className="text-[var(--color-foreground)]">{children}</strong>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px]">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className="font-medium text-[var(--color-foreground)]">{value}</span>
    </span>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {label}
      </span>
      <p
        className={cn(
          "mt-1 truncate text-[13px] text-[var(--color-foreground)]",
          mono && "font-mono text-[12px]"
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function ConfidenceStat({ topScore }: { topScore: number }) {
  const { label, tone } = confidence(topScore);
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
        Confidence
      </span>
      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--color-foreground)]">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            tone === "high"
              ? "bg-emerald-400"
              : tone === "medium"
                ? "bg-amber-400"
                : "bg-[var(--color-muted)]"
          )}
        />
        {label}
      </p>
    </div>
  );
}

function confidence(topScore: number): {
  label: string;
  tone: "high" | "medium" | "low";
} {
  if (topScore >= 0.6) return { label: "High", tone: "high" };
  if (topScore >= 0.3) return { label: "Medium", tone: "medium" };
  return { label: "Low", tone: "low" };
}

function SimilarityRow({
  rank,
  chunkIndex,
  score,
  topScore,
}: {
  rank: number;
  chunkIndex: number;
  score: number;
  topScore: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 font-mono text-[11.5px] text-[var(--color-secondary)]">
        Chunk #{chunkIndex}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div
          className={cn(
            "h-full rounded-full",
            rank === 1
              ? "bg-[var(--color-foreground)]"
              : "bg-[var(--color-secondary)]"
          )}
          style={{ width: `${barWidth(score, topScore)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-[12px] font-medium text-[var(--color-foreground)]">
        {Math.round(score * 100)}%
      </span>
    </div>
  );
}

function ScoreBar({ score, topScore }: { score: number; topScore: number }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
      <div
        className="h-full rounded-full bg-[var(--color-foreground)]"
        style={{ width: `${barWidth(score, topScore)}%` }}
      />
    </div>
  );
}

/** Scale the bar to the top score so the ranking stays visually legible. */
function barWidth(score: number, topScore: number): number {
  if (topScore <= 0) return 0;
  return Math.max(4, Math.min(100, (score / topScore) * 100));
}

function VectorBars({ values }: { values: number[] }) {
  const max = Math.max(0.0001, ...values.map((v) => Math.abs(v)));
  return (
    <div className="mt-3 flex items-end gap-1" aria-hidden>
      {values.map((value, index) => {
        const height = Math.max(8, (Math.abs(value) / max) * 40);
        return (
          <div
            key={index}
            className={cn(
              "w-full rounded-sm",
              value >= 0
                ? "bg-[var(--color-foreground)]/70"
                : "bg-[var(--color-muted)]/70"
            )}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}

function ConceptVector({
  label,
  tone,
}: {
  label: string;
  tone: "strong" | "muted";
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {label}
      </span>
      <div className="mt-2 flex items-end gap-1" aria-hidden>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-full rounded-sm",
              tone === "strong"
                ? "bg-[var(--color-foreground)]/60"
                : "bg-[var(--color-muted)]/50"
            )}
            style={{
              height: 8 + ((index * (tone === "strong" ? 7 : 5)) % 30),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PromptPart({
  label,
  body,
  emphasis,
}: {
  label: string;
  body: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        emphasis
          ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)]"
      )}
    >
      <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {label}
      </span>
      <pre className="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-[var(--color-secondary)]">
        {body}
      </pre>
    </div>
  );
}

function PromptOperator({ symbol }: { symbol: string }) {
  return (
    <div className="flex justify-center" aria-hidden>
      <span className="font-mono text-[15px] text-[var(--color-muted)]">
        {symbol}
      </span>
    </div>
  );
}
