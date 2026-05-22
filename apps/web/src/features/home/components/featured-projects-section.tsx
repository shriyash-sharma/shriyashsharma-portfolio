import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import type { HomeProjectCard } from "@/lib/content/home-cards";
import { cn } from "@/lib/utils/cn";

// ─── SVG color constants (match design tokens exactly) ─────────────
const C = {
  surface2:     "#161616",
  surface3:     "#1c1c1c",
  border:       "#232323",
  borderSubtle: "#181818",
  muted:        "#909090",
  muted2:       "#696969",
  secondary:    "#b8b8b8",
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

/** Observability surface: services → traces → alert budget */
function ObservabilityPanelSvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      <rect x="8" y="12" width="264" height="84" rx="6" fill={C.surface2} stroke={C.border} strokeWidth="0.75" />

      {/* Service list */}
      <rect x="18" y="24" width="66" height="60" rx="4" fill={C.surface3} stroke={C.borderSubtle} strokeWidth="0.75" />
      {["api-gateway", "worker", "billing"].map((label, index) => (
        <g key={label}>
          <circle cx="28" cy={36 + index * 16} r="2.5" fill={index === 1 ? C.secondary : C.muted2} />
          <text x="36" y={39 + index * 16} fontSize="6.8" fill={C.muted} fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* Trace bars */}
      <rect x="100" y="24" width="92" height="60" rx="4" fill={C.surface3} stroke={C.borderSubtle} strokeWidth="0.75" />
      {[24, 44, 32, 58, 38].map((width, index) => (
        <rect
          key={index}
          x="112"
          y={34 + index * 9}
          width={width}
          height="3"
          rx="1.5"
          fill={index === 3 ? C.secondary : C.muted2}
        />
      ))}
      <text x="146" y="77" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">p95 trace latency</text>

      {/* SLO budget */}
      <rect x="208" y="24" width="46" height="60" rx="4" fill={C.surface3} stroke={C.borderSubtle} strokeWidth="0.75" />
      <text x="231" y="38" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">SLO</text>
      <text x="231" y="55" textAnchor="middle" fontSize="13" fill={C.secondary} fontFamily="monospace">99.9</text>
      <text x="231" y="70" textAnchor="middle" fontSize="6.5" fill={C.muted2} fontFamily="monospace">error budget</text>
    </svg>
  );
}

/** CMS workflow: authoring → review → edge cache */
function CmsWorkflowSvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      {[
        ["Draft", 16, 22],
        ["Review", 106, 22],
        ["Publish", 196, 22],
      ].map(([label, x, y], index) => (
        <g key={label}>
          <rect x={Number(x)} y={Number(y)} width="68" height="28" rx="5" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
          <text x={Number(x) + 34} y={Number(y) + 17} textAnchor="middle" fontSize="8" fill={index === 2 ? C.secondary : C.muted} fontFamily="monospace">{label}</text>
          {index < 2 && (
            <>
              <line x1={Number(x) + 69} y1="36" x2={Number(x) + 88} y2="36" stroke={C.border} strokeWidth="0.75" />
              <polygon points={`${Number(x) + 88},33 ${Number(x) + 94},36 ${Number(x) + 88},39`} fill={C.muted2} />
            </>
          )}
        </g>
      ))}

      <rect x="36" y="72" width="208" height="16" rx="3" fill={C.surface2} stroke={C.borderSubtle} strokeWidth="0.75" strokeDasharray="2,2" />
      <text x="140" y="83" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">schema validation · preview token · edge revalidate</text>
    </svg>
  );
}

/** Deployment topology: queue → deploy workers → regions */
function DeploymentTopologySvg() {
  return (
    <svg viewBox="0 0 280 108" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      <rect x="12" y="42" width="48" height="24" rx="4" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="36" y="57" textAnchor="middle" fontSize="8" fill={C.muted} fontFamily="monospace">Queue</text>

      <line x1="61" y1="54" x2="88" y2="54" stroke={C.border} strokeWidth="0.75" />
      <polygon points="88,51 94,54 88,57" fill={C.muted2} />

      <rect x="95" y="29" width="74" height="50" rx="5" fill={C.surface3} stroke={C.border} strokeWidth="0.75" />
      <text x="132" y="47" textAnchor="middle" fontSize="8.5" fill={C.secondary} fontFamily="monospace">Deploy</text>
      <text x="132" y="59" textAnchor="middle" fontSize="7" fill={C.muted2} fontFamily="monospace">worker pool</text>
      <text x="132" y="70" textAnchor="middle" fontSize="6.5" fill={C.muted2} fontFamily="monospace">canary 5%</text>

      {[["iad1", 212, 24], ["fra1", 212, 52], ["sin1", 212, 80]].map(([label, x, y]) => (
        <g key={label}>
          <line x1="170" y1="54" x2={Number(x) - 8} y2={Number(y)} stroke={C.border} strokeWidth="0.75" strokeDasharray="2,2" />
          <rect x={Number(x)} y={Number(y) - 11} width="42" height="20" rx="4" fill={C.surface2} stroke={C.border} strokeWidth="0.75" />
          <text x={Number(x) + 21} y={Number(y) + 2} textAnchor="middle" fontSize="7.5" fill={C.muted} fontFamily="monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

const VISUALS = {
  "rendering-pipeline": RenderingPipelineSvg,
  "collab-topology":    CollabTopologySvg,
  "retrieval-pipeline": RetrievalPipelineSvg,
  "observability-panel": ObservabilityPanelSvg,
  "cms-workflow":        CmsWorkflowSvg,
  "deployment-topology": DeploymentTopologySvg,
} as const;

type FeaturedProjectsSectionProps = {
  /** From getProjects() → mapFeaturedProjectsToHomeCards (featured metadata first). */
  projects: HomeProjectCard[];
  backendConfigured?: boolean;
};

// ─── Component ─────────────────────────────────────────────────────
export function FeaturedProjectsSection({
  projects,
  backendConfigured = true,
}: FeaturedProjectsSectionProps) {
  return (
    <Section
      aria-labelledby="projects-heading"
      className="border-t border-[var(--color-border)]"
      fullWidth
    >
      <MaxWidthWrapper>
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
            <p className="max-w-[58ch] text-[14px] leading-[1.72] text-[var(--color-muted)] sm:text-[15px]">
              Representative systems work, written as real engineering
              briefs: constraints, decisions, runtime behavior, and the
              tradeoffs that shaped each build.
            </p>
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

      {projects.length === 0 ? (
        <FadeIn>
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-[14px] leading-relaxed text-[var(--color-muted)]">
            {!backendConfigured ? (
              <>
                Content API is not configured. Set{" "}
                <code className="text-[13px]">NEXT_PUBLIC_API_URL</code> and{" "}
                <code className="text-[13px]">API_INTERNAL_URL</code>, then
                redeploy.
              </>
            ) : (
              "No published projects yet. Mark items as featured in the CMS metadata to highlight them here."
            )}
          </div>
        </FadeIn>
      ) : (
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const Visual = VISUALS[project.visual];
          return (
            <StaggerItem key={project.id}>
              <Link
                href={project.href}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-xl",
                  "border border-[var(--color-border)] bg-[var(--color-surface)]",
                  // Lift + color — physical, snappy
                  "transition-[transform,border-color,background-color] duration-[150ms] ease-out",
                  "hover:-translate-y-[3px]",
                  "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
                )}
              >
                {/* Architecture visual */}
                <div
                  className={cn(
                    "relative h-[112px] overflow-hidden border-b border-[var(--color-border)]",
                    "bg-[var(--color-surface-2)] p-4",
                    "transition-colors duration-[200ms] group-hover:bg-[var(--color-surface-3)]"
                  )}
                >
                  <span className="sr-only">{project.visualLabel}</span>
                  <Visual />
                  {/* Signature interaction — scan shimmer sweeps across the diagram on hover */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-y-0 left-0 w-[55%]",
                      "-translate-x-full transition-[transform] duration-[650ms] ease-in-out",
                      "group-hover:translate-x-[200%]",
                      "bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                    )}
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[14px] font-medium leading-snug tracking-[-0.01em] text-[var(--color-foreground)]">
                      {project.title}
                    </h3>
                    <span className={cn(
                      "shrink-0 rounded-full border border-[var(--color-border)] px-2 py-0.5",
                      "text-[10.5px] font-medium uppercase tracking-[0.07em] text-[var(--color-muted)]"
                    )}>
                      {project.label}
                    </span>
                  </div>

                  {/* Short description */}
                  <p className="text-[14px] leading-[1.68] text-[var(--color-muted)]">
                    {project.description}
                  </p>

                  {/* Key decision — left-border callout */}
                  <div className="border-l-2 border-[var(--color-border-strong)] pl-3">
                    <p className="text-[13px] leading-[1.62] text-[var(--color-secondary)]">
                      {project.keyDecision}
                    </p>
                  </div>

                  {/* Operational detail */}
                  <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted-2)]">
                      runtime note
                    </span>
                    <p className="font-mono text-[12px] leading-relaxed text-[var(--color-muted)]">
                      {project.systemDetail}
                    </p>
                  </div>

                  {/* Architecture annotation */}
                  <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3 py-2.5">
                    <p className="font-mono text-[12px] leading-relaxed text-[var(--color-muted-2)] transition-colors duration-[140ms] group-hover:text-[var(--color-muted)]">
                      {project.architecture}
                    </p>
                  </div>

                  {/* Footer: stack + arrow */}
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[12px] tracking-wide text-[var(--color-muted-2)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ArrowRight
                      size={13}
                      strokeWidth={1.75}
                      className="shrink-0 text-[var(--color-muted-2)] transition-[transform,color] duration-[120ms] ease-out group-hover:translate-x-1 group-hover:text-[var(--color-secondary)]"
                    />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
      )}

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
      </MaxWidthWrapper>
    </Section>
  );
}
