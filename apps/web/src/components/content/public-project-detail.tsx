import Link from "next/link";
import { ArrowUpRight, Boxes, CircuitBoard, GitBranch, Globe, Layers3 } from "lucide-react";
import { MarkdownContent } from "@/components/content/markdown-content";
import type { Project } from "@/lib/services/project-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(value: Project["status"]) {
  return value.replace(/-/g, " ");
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function ProjectMetaBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
        {label}
      </p>
      <p className="mt-2 text-[14px] leading-7 text-[var(--color-secondary)]">{value}</p>
    </div>
  );
}

function ProjectLinkItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const content = (
    <>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
          Project link
        </span>
        <span className="mt-1 block text-[14px] text-[var(--color-foreground)]">{label}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
    </>
  );

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
    >
      {content}
    </Link>
  );
}

type PublicProjectDetailProps = {
  project: Project;
};

export function PublicProjectDetail({ project }: PublicProjectDetailProps) {
  const projectBody = project.body.trim() ? project.body : project.description;
  const projectLinks = [
    project.links.github
      ? {
          href: project.links.github,
          label: "GitHub repository",
          icon: <GitBranch className="h-4 w-4" aria-hidden="true" />,
        }
      : null,
    project.links.live
      ? {
          href: project.links.live,
          label: "Live product",
          icon: <Globe className="h-4 w-4" aria-hidden="true" />,
        }
      : null,
    project.links.caseStudy
      ? {
          href: project.links.caseStudy,
          label: "Related case study",
          icon: <Layers3 className="h-4 w-4" aria-hidden="true" />,
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: React.ReactNode }>;

  return (
    <div className="grid gap-8 lg:gap-10">
      <header className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 lg:p-10">
        <Link
          href="/projects"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Back to projects
        </Link>
        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_320px] xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              {project.featured ? (
                <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1 text-[var(--color-foreground)]">
                  {project.cardLabel ?? "Featured project"}
                </span>
              ) : null}
              <span>{formatStatus(project.status)}</span>
              <span>·</span>
              <span>{formatDate(project.publishedAt)}</span>
            </div>

            <h1 className="mt-5 max-w-4xl text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[52px]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[var(--color-secondary)]">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.stack.length ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.stack.map((technology) => (
                  <div
                    key={technology}
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                      Stack
                    </p>
                    <p className="mt-2 text-[14px] text-[var(--color-foreground)]">{technology}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-background)] p-5">
            <ProjectMetaBlock label="Published" value={formatDate(project.publishedAt)} />
            <ProjectMetaBlock label="Updated" value={formatDate(project.updatedAt)} />
            <ProjectMetaBlock
              label="Categories"
              value={project.categories.join(" · ") || "Product engineering"}
            />
            {project.visualLabel ? (
              <ProjectMetaBlock label="System framing" value={project.visualLabel} />
            ) : null}
            <ProjectMetaBlock
              label="AI indexing"
              value={project.aiIndexable ? "Eligible for assistant indexing" : "Excluded from assistant indexing"}
            />
          </aside>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
            Overview
          </p>
          <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
            Product direction and engineering scope
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-[var(--color-secondary)]">
            {project.description}
          </p>
        </section>

        <aside className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Related links
            </p>
            <h2 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
              Project surfaces
            </h2>
          </div>

          {projectLinks.length ? (
            <div className="grid gap-3">
              {projectLinks.map((item) => (
                <ProjectLinkItem key={`${item.label}-${item.href}`} {...item} />
              ))}
            </div>
          ) : (
            <p className="rounded-[20px] border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-5 text-[14px] text-[var(--color-muted)]">
              No public project links have been attached yet.
            </p>
          )}
        </aside>
      </div>

      {project.keyDecision ? (
        <section className="rounded-[28px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]">
              <CircuitBoard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Key engineering decision
              </p>
              <div className="mt-4 text-[18px] leading-8 text-[var(--color-foreground)]">
                <MarkdownContent value={project.keyDecision} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="grid gap-6">
          {project.architectureSummary ? (
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                Architecture
              </p>
              <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                System topology and platform shape
              </h2>
              <div className="mt-5">
                <MarkdownContent value={project.architectureSummary} />
              </div>
            </section>
          ) : null}

          {project.systemDetail ? (
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                System details
              </p>
              <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                Delivery notes and implementation specifics
              </h2>
              <div className="mt-5">
                <MarkdownContent value={project.systemDetail} />
              </div>
            </section>
          ) : null}

          <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Full writeup
            </p>
            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
              Implementation notes
            </h2>
            <div className="mt-6">
              <MarkdownContent value={projectBody} />
            </div>
          </section>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-24">
          <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]">
                <Boxes className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                  Tech stack
                </p>
                <h3 className="mt-1 text-[18px] font-medium text-[var(--color-foreground)]">
                  Tooling and runtime choices
                </h3>
              </div>
            </div>

            {project.stack.length ? (
              <ul className="mt-5 grid gap-3">
                {project.stack.map((technology) => (
                  <li
                    key={technology}
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[14px] text-[var(--color-secondary)]"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 text-[14px] text-[var(--color-muted)]">
                Stack metadata has not been filled for this project yet.
              </p>
            )}
          </section>

          <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
              Taxonomy
            </p>
            <h3 className="mt-2 text-[18px] font-medium text-[var(--color-foreground)]">
              Content context
            </h3>

            <div className="mt-5 grid gap-4">
              <ProjectMetaBlock
                label="Categories"
                value={project.categories.join(" · ") || "Uncategorized"}
              />
              <ProjectMetaBlock
                label="Tags"
                value={project.tags.join(" · ") || "No tags attached"}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}