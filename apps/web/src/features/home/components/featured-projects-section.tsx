import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { cn } from "@/lib/utils/cn";

// ─── SVG color constants (match design tokens exactly) ─────────────
const C = {
  surface2:     "#161616",
  surface3:     "#1c1c1c",
  border:       "#232323",
  borderSubtle: "#181818",
  muted:        "#6b6b6b",
  muted2:       "#444444",
  secondary:    "#a1a1a1",
} as const;

// ─── Architecture SVG fragments ────────────────────────────────────

/** Rendering pipeline: Client → Edge → ISR / SSR split */
function RenderingPipelineSvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      {/* Client */}
      <rect x="4" y="40" width="52" height="22" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="30" y="54.5" textAnchor="middle" fontSize="8.5" fill={C.muted} fontFamily="monospace">Client</text>

      {/* → Edge */}
      <line x1="57" y1="51" x2="82" y2="51" stroke={C.border} strokeWidth="0.75" />
      <polygon points="82,48 88,51 82,54" fill={C.muted2} />

      {/* Edge node */}
      <rect x="89" y="36" width="60" height="30" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="119" y="49" textAnchor="middle" fontSize="8.5" fill={C.secondary} fontFamily="monospace">Edge</text>
      <text x="119" y="60" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">CDN</text>

      {/* Branch → ISR */}
      <line x1="149" y1="44" x2="174" y2="27" stroke={C.border} strokeWidth="0.75" strokeDasharray="2,2" />
      <rect x="175" y="14" width="64" height="22" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="207" y="25" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">ISR</text>
      <text x="207" y="34" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">static cache</text>

      {/* Branch → SSR */}
      <line x1="149" y1="58" x2="174" y2="74" stroke={C.border} strokeWidth="0.75" strokeDasharray="2,2" />
      <rect x="175" y="63" width="64" height="22" rx="4" fill={C.surface2} stroke={C.border} strokeWidth="0.75" />
      <text x="207" y="74" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">SSR</text>
      <text x="207" y="83" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">auth routes</text>

      {/* Redis layer */}
      <rect x="89" y="82" width="60" height="18" rx="3" fill={C.surface2} stroke={C.borderSubtle} strokeWidth="0.75" strokeDasharray="2,2" />
      <text x="119" y="94" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">Redis · cache</text>
    </svg>
  );
}

/** WebSocket topology: clients → WS server → Redis pub/sub */
function CollabTopologySvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      {/* Client A */}
      <circle cx="22" cy="22" r="10" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="22" y="25.5" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">A</text>

      {/* Client B */}
      <circle cx="22" cy="54" r="10" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="22" y="57.5" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">B</text>

      {/* Client C */}
      <circle cx="22" cy="86" r="10" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="22" y="89.5" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">C</text>

      {/* Lines → WS server */}
      <line x1="32" y1="22" x2="94" y2="44" stroke={C.border} strokeWidth="0.75" />
      <line x1="32" y1="54" x2="94" y2="54" stroke={C.border} strokeWidth="0.75" />
      <line x1="32" y1="86" x2="94" y2="64" stroke={C.border} strokeWidth="0.75" />

      {/* WS Server */}
      <rect x="95" y="34" width="72" height="40" rx="5" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="131" y="51" textAnchor="middle" fontSize="8.5" fill={C.secondary} fontFamily="monospace">WS Server</text>
      <text x="131" y="63" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">OT engine</text>

      {/* → Redis */}
      <line x1="168" y1="54" x2="192" y2="54" stroke={C.border} strokeWidth="0.75" />
      <polygon points="192,51 198,54 192,57" fill={C.muted2} />

      {/* Redis */}
      <rect x="199" y="38" width="62" height="32" rx="5" fill={C.surface2} stroke={C.border} strokeWidth="0.75" />
      <text x="230" y="52" textAnchor="middle" fontSize="8.5" fill={C.muted} fontFamily="monospace">Redis</text>
      <text x="230" y="62" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">pub/sub</text>

      {/* Presence label */}
      <text x="230" y="86" textAnchor="middle" fontSize="6.5" fill={C.muted2} fontFamily="monospace">TTL 8s · heartbeat</text>
    </svg>
  );
}

/** Hybrid retrieval: query → BM25 + pgvector → RRF → LLM stream */
function RetrievalPipelineSvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      {/* Query */}
      <text x="6" y="55" fontSize="8.5" fill={C.muted} fontFamily="monospace">query</text>

      {/* Fork line */}
      <line x1="42" y1="30" x2="42" y2="75" stroke={C.border} strokeWidth="0.75" />
      <line x1="42" y1="30" x2="60" y2="30" stroke={C.border} strokeWidth="0.75" />
      <line x1="42" y1="75" x2="60" y2="75" stroke={C.border} strokeWidth="0.75" />

      {/* BM25 */}
      <rect x="61" y="18" width="55" height="24" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="88" y="29" textAnchor="middle" fontSize="8" fill={C.secondary} fontFamily="monospace">BM25</text>
      <text x="88" y="38.5" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">keyword</text>

      {/* pgvector */}
      <rect x="61" y="63" width="55" height="24" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="88" y="74" textAnchor="middle" fontSize="8" fill={C.secondary} fontFamily="monospace">pgvector</text>
      <text x="88" y="83.5" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">cosine sim</text>

      {/* → RRF */}
      <line x1="116" y1="30" x2="140" y2="48" stroke={C.border} strokeWidth="0.75" />
      <line x1="116" y1="75" x2="140" y2="57" stroke={C.border} strokeWidth="0.75" />

      {/* RRF */}
      <rect x="141" y="38" width="42" height="28" rx="4" fill={C.surface2} stroke={C.border} strokeWidth="0.75" />
      <text x="162" y="51" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">RRF</text>
      <text x="162" y="61" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">fuse</text>

      {/* → LLM */}
      <line x1="184" y1="52" x2="202" y2="52" stroke={C.border} strokeWidth="0.75" />
      <polygon points="202,49 208,52 202,55" fill={C.muted2} />

      {/* LLM */}
      <rect x="209" y="38" width="42" height="28" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="230" y="51" textAnchor="middle" fontSize="8" fill={C.secondary} fontFamily="monospace">LLM</text>
      <text x="230" y="61" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">stream</text>

      {/* Stream indicator */}
      <text x="256" y="49" fontSize="9" fill={C.muted2} fontFamily="monospace">∿</text>

      {/* Redis embed cache */}
      <rect x="61" y="96" width="55" height="10" rx="2" fill={C.surface2} stroke={C.borderSubtle} strokeWidth="0.75" strokeDasharray="2,2" />
      <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill={C.muted2} fontFamily="monospace">embed cache · 7d</text>
    </svg>
  );
}

const VISUALS = {
  "rendering-pipeline": RenderingPipelineSvg,
  "collab-topology":    CollabTopologySvg,
  "retrieval-pipeline": RetrievalPipelineSvg,
} as const;

// ─── Project data ──────────────────────────────────────────────────
type ProjectVisualKey = keyof typeof VISUALS;

type Project = {
  id: string;
  title: string;
  description: string;
  /** The single most important architectural tradeoff */
  keyDecision: string;
  architecture: string;
  stack: string[];
  href: string;
  label: string;
  visual: ProjectVisualKey;
};

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Platform infrastructure rewrite",
    description:
      "Migrated a 3-year-old React SPA to Next.js App Router serving 200k MAU across 12 regions.",
    keyDecision:
      "ISR for content pages, SSR only for authenticated routes — a blanket SSR approach would have tripled egress costs and eliminated 94% cache efficiency.",
    architecture: "Next.js App Router · ISR + SSR hybrid · Turborepo · Vercel Edge",
    stack: ["Next.js", "TypeScript", "Turborepo", "Redis"],
    href: "/projects/platform-rewrite",
    label: "Production",
    visual: "rendering-pipeline",
  },
  {
    id: "2",
    title: "Real-time collaboration engine",
    description:
      "Collaborative editing layer for a B2B document editor supporting 50+ concurrent sessions.",
    keyDecision:
      "Operational transforms over CRDTs — server infrastructure already implemented OT and the product had no offline requirement to justify CRDT complexity.",
    architecture: "WebSockets · Redis pub/sub · OT · Optimistic UI + rollback",
    stack: ["React", "Node.js", "Redis", "WebSockets"],
    href: "/projects/collab-engine",
    label: "Open Source",
    visual: "collab-topology",
  },
  {
    id: "3",
    title: "Semantic document search",
    description:
      "RAG pipeline over a 400k-document enterprise knowledge base with streaming responses and source attribution.",
    keyDecision:
      "Hybrid BM25 + vector retrieval fused with RRF over pure embeddings — keyword matching outperforms vectors for product codes and proper nouns in this domain.",
    architecture: "FastAPI · pgvector · BM25 hybrid · RRF reranking · SSE",
    stack: ["Python", "FastAPI", "pgvector", "OpenAI"],
    href: "/projects/semantic-search",
    label: "In Progress",
    visual: "retrieval-pipeline",
  },
];

// ─── Component ─────────────────────────────────────────────────────
export function FeaturedProjectsSection() {
  return (
    <Section
      aria-labelledby="projects-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              <span className="mr-2 font-mono text-[var(--color-muted-2)]">01</span>
              Selected work
            </span>
            <h2
              id="projects-heading"
              className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-2xl lg:text-3xl"
            >
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className={cn(
              "hidden items-center gap-1.5 text-[13px] text-[var(--color-muted)] sm:flex",
              "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
            )}
          >
            All projects
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => {
          const Visual = VISUALS[project.visual];
          return (
            <StaggerItem key={project.id}>
              <Link
                href={project.href}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-xl",
                  "border border-[var(--color-border)] bg-[var(--color-surface)]",
                  "transition-[border-color,background-color] duration-[200ms] ease-out",
                  "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
                )}
              >
                {/* Architecture visual */}
                <div
                  className={cn(
                    "h-[112px] border-b border-[var(--color-border)]",
                    "bg-[var(--color-surface-2)] p-4",
                    "transition-colors duration-[200ms] group-hover:bg-[var(--color-surface-3)]"
                  )}
                >
                  <Visual />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-medium leading-snug tracking-[-0.01em] text-[var(--color-foreground)]">
                      {project.title}
                    </h3>
                    <span className={cn(
                      "shrink-0 rounded-full border border-[var(--color-border)] px-2 py-0.5",
                      "text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--color-muted)]"
                    )}>
                      {project.label}
                    </span>
                  </div>

                  {/* Short description */}
                  <p className="text-[13px] leading-[1.65] text-[var(--color-muted)]">
                    {project.description}
                  </p>

                  {/* Key decision — left-border callout */}
                  <div className="border-l-2 border-[var(--color-border-strong)] pl-3">
                    <p className="text-[12px] leading-[1.6] text-[var(--color-secondary)]">
                      {project.keyDecision}
                    </p>
                  </div>

                  {/* Architecture annotation */}
                  <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2">
                    <p className="font-mono text-[10.5px] leading-relaxed text-[var(--color-muted-2)] transition-colors duration-[140ms] group-hover:text-[var(--color-muted)]">
                      {project.architecture}
                    </p>
                  </div>

                  {/* Footer: stack + arrow */}
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] tracking-wide text-[var(--color-muted-2)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ArrowRight
                      size={13}
                      strokeWidth={1.75}
                      className="shrink-0 text-[var(--color-muted-2)] transition-all duration-[140ms] group-hover:translate-x-0.5 group-hover:text-[var(--color-muted)]"
                    />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <FadeIn delay={0.12}>
        <div className="mt-7 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-secondary)]"
          >
            All projects
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
}
