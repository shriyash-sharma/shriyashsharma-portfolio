import Link from "next/link";
import type { Project } from "@/lib/services/project-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value)
  );
}

type PublicProjectListProps = {
  projects: Project[];
};

export function PublicProjectList({ projects }: PublicProjectListProps) {
  return (
    <div className="grid gap-10">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Work
        </p>
        <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[46px]">
          Projects
        </h1>
        <p className="mt-4 text-[15px] leading-8 text-[var(--color-secondary)]">
          Published projects from the content system, including shipped work,
          architecture context, and linked case studies.
        </p>
      </div>

      {projects.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
            >
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted-2)]">
                <span>{project.status}</span>
                <span>{formatDate(project.publishedAt)}</span>
              </div>
              <h2 className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[var(--color-foreground)]">
                {project.title}
              </h2>
              <p className="mt-3 text-[15px] leading-8 text-[var(--color-secondary)]">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-[15px] text-[var(--color-muted)]">
          No published projects yet.
        </div>
      )}
    </div>
  );
}