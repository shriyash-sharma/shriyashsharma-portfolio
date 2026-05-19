import { cn } from "@/lib/utils/cn";

/**
 * HeroSystemPanel — server component, zero JS.
 *
 * A deployment / system metadata snapshot: communicates infrastructure
 * awareness without decoration. All figures are representative.
 * Hidden on mobile — this is intentional desktop-only depth.
 *
 * Temporarily not rendered (commented out in hero-section.tsx): metrics were
 * illustrative, not live. Re-enable after simplifying to factual stack copy only.
 */
export function HeroSystemPanel() {
  return (
    <aside
      aria-label="Deployment information"
      className="hidden lg:flex lg:flex-col lg:justify-center"
    >
      <div
        className={cn(
          "rounded-xl border border-[var(--color-border)]",
          "bg-[var(--color-surface)]",
          "p-5 font-mono text-[11px] leading-[1.7]"
        )}
      >
        {/* Status header */}
        <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              live · production
            </span>
          </div>
          <span className="text-[10px] text-[var(--color-muted-2)]">
            shriyashsharma.dev
          </span>
        </div>

        {/* Deployment metrics */}
        <div className="mb-4 flex flex-col gap-1.5">
          <Row label="branch"  value="main" />
          <Row label="build"   value="#312  ✓  1.8s" />
          <Row label="deploy"  value="38s ago · iad1" />
          <Row label="edge"    value="fra1 · sfo1 · sin1 · iad1" />
          <Row label="cache"   value="94.2% hit rate" />
          <Row label="lcp"     value="0.81s · p75" />
          <Row label="uptime"  value="99.97% · 90d" />
        </div>

        {/* Stack */}
        <div
          className={cn(
            "rounded-md border border-[var(--color-border-subtle)]",
            "bg-[var(--color-surface-2)] px-3 py-2.5",
            "mb-3 flex flex-col gap-1"
          )}
        >
          <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
            stack
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[var(--color-muted)]">
            <span>Next.js 15</span>
            <span>TypeScript strict</span>
            <span>Tailwind v4</span>
            <span>App Router</span>
            <span>Edge Runtime</span>
          </div>
        </div>

        {/* Release checks */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ["a11y", "pass"],
            ["i18n", "en / hi"],
            ["bundle", "188kb"],
            ["routes", "static"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2.5 py-2"
            >
              <span className="block text-[9px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                {label}
              </span>
              <span className="text-[10px] text-[var(--color-muted)]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-14 shrink-0 text-[var(--color-muted-2)]">{label}</span>
      <span className="text-[var(--color-secondary)]">{value}</span>
    </div>
  );
}
