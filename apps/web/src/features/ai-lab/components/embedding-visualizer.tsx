"use client";

import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  Boxes,
  Filter,
  GitCompareArrows,
  Layers,
  MousePointer2,
  Search,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  EMBEDDING_CATEGORIES,
  EMBEDDING_DATA_BOUNDS,
  EMBEDDING_VISUALIZER_DATA,
  nearestNeighbors,
  projectionSimilarity,
  similarityLabel,
  type EmbeddingCategory,
  type EmbeddingConcept,
} from "@/lib/ai-lab/embedding-visualizer";

const SVG_SIZE = 100;
const PADDING = 10;
const MIN_SCALE = 0.6;
const MAX_SCALE = 3.5;

function toSvgCoords(x: number, y: number): { cx: number; cy: number } {
  const rangeX = EMBEDDING_DATA_BOUNDS.maxX - EMBEDDING_DATA_BOUNDS.minX;
  const rangeY = EMBEDDING_DATA_BOUNDS.maxY - EMBEDDING_DATA_BOUNDS.minY;
  const cx =
    PADDING +
    ((x - EMBEDDING_DATA_BOUNDS.minX) / rangeX) * (SVG_SIZE - PADDING * 2);
  const cy =
    SVG_SIZE -
    PADDING -
    ((y - EMBEDDING_DATA_BOUNDS.minY) / rangeY) * (SVG_SIZE - PADDING * 2);
  return { cx, cy };
}

function formatPercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function EmbeddingVisualizer() {
  const [selected, setSelected] = React.useState<EmbeddingConcept>(
    EMBEDDING_VISUALIZER_DATA[0]
  );
  const [compareWith, setCompareWith] = React.useState<EmbeddingConcept>(
    EMBEDDING_VISUALIZER_DATA[1]
  );
  const [hovered, setHovered] = React.useState<EmbeddingConcept | null>(null);
  const [activeCategories, setActiveCategories] = React.useState<
    Set<EmbeddingCategory>
  >(() => new Set(EMBEDDING_CATEGORIES));
  const [view, setView] = React.useState({ scale: 1, tx: 0, ty: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const panStart = React.useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = React.useRef<SVGSVGElement>(null);

  const visibleConcepts = React.useMemo(
    () =>
      EMBEDDING_VISUALIZER_DATA.filter((item) =>
        activeCategories.has(item.category)
      ),
    [activeCategories]
  );

  const neighbors = React.useMemo(
    () => nearestNeighbors(selected, 4, visibleConcepts),
    [selected, visibleConcepts]
  );

  const comparisonScore = React.useMemo(
    () => projectionSimilarity(selected, compareWith),
    [selected, compareWith]
  );
  const comparisonTier = similarityLabel(comparisonScore);

  const toggleCategory = React.useCallback((category: EmbeddingCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        if (next.size === 1) return prev;
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const resetView = React.useCallback(() => {
    setView({ scale: 1, tx: 0, ty: 0 });
  }, []);

  const zoomBy = React.useCallback((factor: number) => {
    setView((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor)),
    }));
  }, []);

  const handleWheel = React.useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.92 : 1.08;
      zoomBy(factor);
    },
    [zoomBy]
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (event.button !== 0) return;
      setIsPanning(true);
      panStart.current = {
        x: event.clientX,
        y: event.clientY,
        tx: view.tx,
        ty: view.ty,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [view.tx, view.ty]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!isPanning) return;
      const dx = event.clientX - panStart.current.x;
      const dy = event.clientY - panStart.current.y;
      setView((prev) => ({
        ...prev,
        tx: panStart.current.tx + dx,
        ty: panStart.current.ty + dy,
      }));
    },
    [isPanning]
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      setIsPanning(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    []
  );

  const selectConcept = React.useCallback((concept: EmbeddingConcept) => {
    setSelected(concept);
    setCompareWith((prev) =>
      prev.text === concept.text ? EMBEDDING_VISUALIZER_DATA[1] : prev
    );
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="flex flex-col gap-3 lg:col-span-3">
          <Panel
            icon={Filter}
            title="Concept list"
            hint="Browse curated concepts grouped by semantic category. Click to inspect."
          >
            <div className="flex flex-wrap gap-1.5">
              {EMBEDDING_CATEGORIES.map((category) => {
                const active = activeCategories.has(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                      active
                        ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                        : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)]"
                    )}
                  >
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[category] }}
                    />
                    {CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
            <div className="max-h-[420px] space-y-1.5 overflow-auto pr-1">
              {visibleConcepts.map((concept) => (
                <button
                  key={concept.text}
                  type="button"
                  onClick={() => selectConcept(concept)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
                    selected.text === concept.text
                      ? "border-[var(--color-border-strong)] bg-[var(--color-surface-3)]"
                      : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-border-strong)]"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[concept.category] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-[var(--color-foreground)]">
                      {concept.text}
                    </span>
                    <span className="text-[10.5px] text-[var(--color-muted)]">
                      {concept.category}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </section>

        <section className="flex flex-col gap-3 lg:col-span-6">
          <Panel
            icon={Boxes}
            title="Embedding space"
            hint="Pre-projected 2D map of semantic clusters. Scroll to zoom, drag to pan, click a point to select."
            action={
              <div className="flex items-center gap-1.5">
                <MiniButton onClick={() => zoomBy(1.15)}>
                  <ZoomIn size={11} />
                </MiniButton>
                <MiniButton onClick={() => zoomBy(0.87)}>
                  <ZoomOut size={11} />
                </MiniButton>
                <MiniButton onClick={resetView}>Reset</MiniButton>
              </div>
            }
          >
            <div className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                className={cn(
                  "aspect-square w-full touch-none select-none",
                  isPanning ? "cursor-grabbing" : "cursor-grab"
                )}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                role="img"
                aria-label="Embedding space scatter plot showing semantic clusters"
              >
                <rect
                  x={0}
                  y={0}
                  width={SVG_SIZE}
                  height={SVG_SIZE}
                  fill="transparent"
                />
                <g
                  transform={`translate(${view.tx / 4} ${view.ty / 4}) scale(${view.scale})`}
                  style={{ transformOrigin: "50px 50px" }}
                >
                  {[20, 40, 60, 80].map((pos) => (
                    <g key={pos} className="text-[var(--color-border)]">
                      <line
                        x1={pos}
                        y1={PADDING}
                        x2={pos}
                        y2={SVG_SIZE - PADDING}
                        stroke="currentColor"
                        strokeWidth={0.15}
                        strokeDasharray="1 1"
                        opacity={0.5}
                      />
                      <line
                        x1={PADDING}
                        y1={pos}
                        x2={SVG_SIZE - PADDING}
                        y2={pos}
                        stroke="currentColor"
                        strokeWidth={0.15}
                        strokeDasharray="1 1"
                        opacity={0.5}
                      />
                    </g>
                  ))}
                  {visibleConcepts.map((concept) => {
                    const { cx, cy } = toSvgCoords(concept.x, concept.y);
                    const isSelected = selected.text === concept.text;
                    const isHovered = hovered?.text === concept.text;
                    const isNeighbor = neighbors.some(
                      (n) => n.text === concept.text
                    );
                    const radius = isSelected ? 2.2 : isHovered ? 1.9 : 1.5;
                    return (
                      <g key={concept.text}>
                        {isNeighbor && !isSelected ? (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={3.2}
                            fill={CATEGORY_COLORS[concept.category]}
                            opacity={0.15}
                          />
                        ) : null}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius}
                          fill={CATEGORY_COLORS[concept.category]}
                          stroke={
                            isSelected
                              ? "var(--color-foreground)"
                              : "transparent"
                          }
                          strokeWidth={0.5}
                          className="transition-all duration-150"
                          onMouseEnter={() => setHovered(concept)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={(event) => {
                            event.stopPropagation();
                            selectConcept(concept);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                        {(isSelected || isHovered) && (
                          <text
                            x={cx}
                            y={cy - 3}
                            textAnchor="middle"
                            fontSize={2.4}
                            fill="var(--color-foreground)"
                            className="pointer-events-none font-medium"
                          >
                            {concept.text}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
              {hovered && hovered.text !== selected.text ? (
                <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[11px] text-[var(--color-foreground)] shadow-sm">
                  {hovered.text} · {hovered.category}
                </div>
              ) : null}
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
              <MousePointer2 size={12} />
              {visibleConcepts.length} concepts visible · clusters emerge by
              category
            </p>
          </Panel>
        </section>

        <section className="flex flex-col gap-3 lg:col-span-3">
          <Panel
            icon={Sparkles}
            title="Selected concept"
            hint="Nearest neighbors reveal how embeddings group meaning."
          >
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              <p className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Concept
              </p>
              <p className="text-[15px] font-medium text-[var(--color-foreground)]">
                {selected.text}
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-secondary)]">
                Category: {selected.category}
              </p>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Nearest concepts
              </p>
              <ul className="space-y-1.5">
                {neighbors.map((neighbor) => (
                  <li key={neighbor.text}>
                    <button
                      type="button"
                      onClick={() => selectConcept(neighbor)}
                      className="flex w-full items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1.5 text-left hover:border-[var(--color-border-strong)]"
                    >
                      <span className="text-[12px] text-[var(--color-foreground)]">
                        {neighbor.text}
                      </span>
                      <span className="font-mono text-[10.5px] text-[var(--color-muted)]">
                        {formatPercent(
                          projectionSimilarity(selected, neighbor)
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--color-secondary)]">
              These concepts appear close together because embeddings capture
              semantic meaning—not spelling. Animals cluster with animals;
              databases cluster with infrastructure tools.
            </p>
          </Panel>
        </section>
      </div>

      <Panel
        icon={GitCompareArrows}
        title="Similarity demonstration"
        hint="Pick two concepts to compare semantic proximity in the projected vector space."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ConceptPicker
            label="Concept A"
            value={selected}
            onChange={setSelected}
            exclude={compareWith.text}
          />
          <ConceptPicker
            label="Concept B"
            value={compareWith}
            onChange={setCompareWith}
            exclude={selected.text}
          />
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[14px] font-medium text-[var(--color-foreground)]">
              {selected.text}
            </span>
            <span className="text-[var(--color-muted)]">↔</span>
            <span className="text-[14px] font-medium text-[var(--color-foreground)]">
              {compareWith.text}
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-medium",
                comparisonTier.colorClass
              )}
            >
              {comparisonTier.label}
            </span>
            <span className="font-mono text-[12px] text-[var(--color-muted)]">
              {formatPercent(comparisonScore)} similarity
            </span>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
            {comparisonTier.explanation}
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          icon={Layers}
          title="What is an embedding?"
          hint="From raw text to searchable vectors."
        >
          <FlowDiagram
            steps={[
              "Text",
              "Embedding Model",
              "Vector Representation",
              "Similarity Search",
            ]}
          />
          <p className="text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
            An embedding model reads text and outputs a list of numbers—a
            vector. Each dimension encodes learned patterns about meaning,
            context, and relationships. Similar texts produce vectors that sit
            near each other, which is what you see in the scatter plot above.
          </p>
        </Panel>

        <Panel
          icon={Search}
          title="Why embeddings matter"
          hint="Keyword search vs. semantic search."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <CompareCard
              title="Keyword search: Car"
              misses={["Vehicle", "Automobile", "Sedan"]}
              tone="limit"
            />
            <CompareCard
              title="Semantic search: Car"
              hits={["Vehicle", "Automobile", "Transport"]}
              tone="win"
            />
          </div>
          <p className="text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
            Keyword search only matches literal terms. Semantic search uses
            embeddings to understand intent and return conceptually relevant
            results—even when vocabulary differs.
          </p>
        </Panel>
      </div>

      <Panel
        icon={ArrowDown}
        title="RAG connection"
        hint="How embeddings power retrieval before generation."
      >
        <FlowDiagram
          steps={[
            "Documents",
            "Chunking",
            "Embeddings",
            "Vector Search",
            "Retrieved Chunks",
            "LLM",
          ]}
        />
        <p className="text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
          RAG pipelines embed document chunks once, then retrieve the closest
          vectors at query time. The LLM receives only high-signal excerpts—
          grounded answers without sending entire corpora into the context
          window.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/ai-lab/semantic-search-playground">
              Try Semantic Search Playground →
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/ai-lab/rag-explorer">Try RAG Explorer →</Link>
          </Button>
        </div>
      </Panel>

      <Panel
        icon={Boxes}
        title="Vector space explained"
        hint="This map is a simplified 2D projection of much larger vectors."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Semantics",
            "Context",
            "Relationships",
            "Latent meaning",
          ].map((dimension) => (
            <div
              key={dimension}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5"
            >
              <p className="text-[12px] font-medium text-[var(--color-foreground)]">
                {dimension}
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                Encoded across hundreds or thousands of dimensions
              </p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] leading-relaxed text-[var(--color-secondary)]">
          Production embedding models output vectors with 384, 768, 1,536, or more
          dimensions. Humans cannot visualize that many axes, so tools like this
          one project vectors into 2D for intuition. Distances here approximate
          real semantic similarity—the clustering pattern is what matters, not
          the exact coordinates.
        </p>
      </Panel>
    </div>
  );
}

function ConceptPicker({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: EmbeddingConcept;
  onChange: (concept: EmbeddingConcept) => void;
  exclude: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {label}
      </span>
      <select
        value={value.text}
        onChange={(event) => {
          const concept = EMBEDDING_VISUALIZER_DATA.find(
            (item) => item.text === event.target.value
          );
          if (concept) onChange(concept);
        }}
        className={cn(
          "rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2",
          "text-[13px] text-[var(--color-foreground)]",
          "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none"
        )}
      >
        {EMBEDDING_VISUALIZER_DATA.filter((item) => item.text !== exclude).map(
          (concept) => (
            <option key={concept.text} value={concept.text}>
              {concept.text} ({concept.category})
            </option>
          )
        )}
      </select>
    </label>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--color-foreground)]">
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span className="text-[var(--color-muted)]">↓</span>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function CompareCard({
  title,
  misses,
  hits,
  tone,
}: {
  title: string;
  misses?: string[];
  hits?: string[];
  tone: "limit" | "win";
}) {
  const items = misses ?? hits ?? [];
  const label = misses ? "Misses" : "Finds";
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
      <p className="text-[12px] font-medium text-[var(--color-foreground)]">
        {title}
      </p>
      <p className="mt-2 text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "text-[12px]",
              tone === "limit"
                ? "text-[#ffb4a8]"
                : "text-[#b8f7d0]"
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-[1px] inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]">
            <Icon size={14} />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-[14px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
              {title}
            </h2>
            <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
              {hint}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function MiniButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-[11px]",
        "text-[var(--color-secondary)] transition-colors",
        "hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
      )}
    >
      {children}
    </button>
  );
}
