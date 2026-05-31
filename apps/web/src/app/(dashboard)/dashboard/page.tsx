import { getAdminContentOverview, isUnauthorizedApiError } from "@/lib/api/endpoints/admin-api";
import { getDashboardAccessToken } from "@/lib/auth/session";
import { contentCollections } from "@/lib/content/registry";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const token = await getDashboardAccessToken();
  let overviewItems: Array<{
    collection: (typeof contentCollections)[number];
    total: number;
    published: number;
  }> = [];

  if (token) {
    try {
      overviewItems = await Promise.all(
        contentCollections.map(async (collection) => {
          const overview = await getAdminContentOverview({
            token,
            type: collection.type,
            locale: "en",
          });
          const published =
            overview.counts.find((item) => item.status === "published")?.total ?? 0;
          return {
            collection,
            total: overview.total,
            published,
          };
        })
      );
    } catch (error) {
      if (isUnauthorizedApiError(error)) {
        redirect("/login?next=%2Fdashboard");
      }

      throw error;
    }
  }

  return (
    <div className="grid gap-6 sm:gap-8">
      <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_320px]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
            Operational surface
          </p>
          <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[30px]">
            Publishing control, not placeholder chrome.
          </h1>
          <p className="mt-4 max-w-3xl text-[14px] leading-7 text-[var(--color-secondary)] sm:text-[15px] sm:leading-8">
            The dashboard now operates as a protected authoring system: session-aware routes, authenticated admin APIs, live content CRUD, markdown editing, and media upload boundaries ready for future platform expansion.
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
            Current focus
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
              <p className="text-[13px] text-[var(--color-secondary)]">Auth boundary</p>
              <p className="mt-2 text-[14px] text-[var(--color-foreground)]">
                JWT-backed admin session with protected dashboard routes.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
              <p className="text-[13px] text-[var(--color-secondary)]">Content ops</p>
              <p className="mt-2 text-[14px] text-[var(--color-foreground)]">
                Search, locale filtering, publish workflows, and metadata editing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {overviewItems.map(({ collection, total, published }) => (
          <article
            key={collection.type}
            className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                {collection.type}
              </span>
              <span className="text-[12px] text-[var(--color-muted)]">
                {published} published
              </span>
            </div>
            <p className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
              {total}
            </p>
            <p className="mt-2 text-[13px] leading-7 text-[var(--color-secondary)]">
              {collection.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-[18px] font-medium text-[var(--color-foreground)]">
            Managed collections
          </h2>
          <div className="mt-4 grid gap-3">
            {contentCollections.map((collection) => (
              <div
                key={collection.type}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] text-[var(--color-secondary)]">
                    {collection.type}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-2)]">
                    {collection.aiIndexable ? "AI-ready metadata" : "internal only"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-7 text-[var(--color-muted)]">
                  {collection.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-[18px] font-medium text-[var(--color-foreground)]">
            Workflow posture
          </h2>
          <div className="mt-4 grid gap-3">
            {[
              "Protected admin boundaries on both Next.js and FastAPI",
              "Markdown-first editor with local draft persistence",
              "Draft, review, published, and archived states with timestamps",
              "Media upload architecture prepared for cloud storage swap",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-3 text-[14px] text-[var(--color-secondary)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
