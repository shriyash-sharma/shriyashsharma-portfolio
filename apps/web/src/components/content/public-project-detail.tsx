import Link from "next/link";
import { MarkdownPreview } from "@/components/dashboard/markdown-preview";
import type { Project } from "@/lib/services/project-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type PublicProjectDetailProps = {
  project: Project;
};

export function PublicProjectDetail({ project }: PublicProjectDetailProps) {
  return (
    <div className="grid gap-10">
      <div>
        <Link
          href="/projects"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Back to projects
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
          <span>{project.status}</span>
          <span>·</span>
          <span>{formatDate(project.publishedAt)}</span>
        </div>
        <h1 className="mt-4 max-w-4xl text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[52px]">
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
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <MarkdownPreview value={project.body || project.description} />
        </article>

        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
            Project metadata
          </p>
          <div className="mt-4 grid gap-4 text-[13px] text-[var(--color-secondary)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                Updated
              </p>
              <p className="mt-1">{formatDate(project.updatedAt)}</p>
            </div>
            {project.links.github ? (
              <a href={project.links.github} className="text-[var(--color-foreground)] underline underline-offset-4">
                GitHub
              </a>
            ) : null}
            {project.links.live ? (
              <a href={project.links.live} className="text-[var(--color-foreground)] underline underline-offset-4">
                Live URL
              </a>
            ) : null}
            {project.links.caseStudy ? (
              <Link href={project.links.caseStudy} className="text-[var(--color-foreground)] underline underline-offset-4">
                Related case study
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}