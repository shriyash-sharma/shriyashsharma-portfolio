import { aiCapabilities } from "@/lib/ai/capabilities";
import { contentCollections } from "@/lib/content/registry";

const platformModules = [
  {
    label: "Content system",
    status: "Foundation",
    description:
      "Typed collections for projects, case studies, writing, architecture notes, experiments, and research logs.",
  },
  {
    label: "FastAPI integration",
    status: "Boundary",
    description:
      "Typed HTTP client, API envelopes, endpoint wrappers, auth token slot, and timeout strategy.",
  },
  {
    label: "AI readiness",
    status: "Contracts",
    description:
      "Semantic search, streaming assistant, ingestion, and observability contracts without UI coupling.",
  },
  {
    label: "Protected tooling",
    status: "Prepared",
    description:
      "Dashboard shell and auth boundary are ready for real session validation once backend auth exists.",
  },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <section className="grid gap-4">
        <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--color-secondary)]">
          This route is a platform foundation, not a fake dashboard. It defines
          where authenticated engineering tools will live once FastAPI, auth,
          ingestion, and analytics services are connected.
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {platformModules.map((module) => (
            <article
              key={module.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                {module.status}
              </span>
              <h2 className="mt-3 text-[15px] font-medium text-[var(--color-foreground)]">
                {module.label}
              </h2>
              <p className="mt-2 text-[13px] leading-[1.65] text-[var(--color-muted)]">
                {module.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-[15px] font-medium text-[var(--color-foreground)]">
            Content collections
          </h2>
          <div className="mt-4 grid gap-3">
            {contentCollections.map((collection) => (
              <div
                key={collection.type}
                className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] text-[var(--color-secondary)]">
                    {collection.type}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-2)]">
                    {collection.aiIndexable ? "indexable" : "local only"}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-muted)]">
                  {collection.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-[15px] font-medium text-[var(--color-foreground)]">
            AI capability boundaries
          </h2>
          <div className="mt-4 grid gap-3">
            {aiCapabilities.map((capability) => (
              <div
                key={capability.id}
                className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] text-[var(--color-secondary)]">
                    {capability.label}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-2)]">
                    {capability.boundary}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-muted)]">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
