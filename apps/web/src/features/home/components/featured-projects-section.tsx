import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { cn } from "@/lib/utils/cn";

/** Placeholder project data – will be replaced by real data from project-service */
const PLACEHOLDER_PROJECTS = [
  {
    id: "1",
    title: "Project Alpha",
    description:
      "A production-grade platform built for scale. TypeScript, Next.js, PostgreSQL.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "/projects/alpha",
    status: "Production",
  },
  {
    id: "2",
    title: "Project Beta",
    description:
      "Real-time collaborative tooling with WebSockets and optimistic UI.",
    tags: ["React", "WebSockets", "Redis"],
    href: "/projects/beta",
    status: "Open Source",
  },
  {
    id: "3",
    title: "Project Gamma",
    description:
      "AI-powered semantic search with LLM integration and vector retrieval.",
    tags: ["Python", "FastAPI", "pgvector"],
    href: "/projects/gamma",
    status: "In Progress",
  },
];

export function FeaturedProjectsSection() {
  return (
    <Section aria-labelledby="projects-heading">
      <FadeIn>
        <SectionHeading
          id="projects-heading"
          eyebrow="Selected work"
          heading="Projects"
          subheading="A curated selection of things I have built, shipped, or contributed to."
          className="mb-12"
        />
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_PROJECTS.map((project) => (
          <StaggerItem key={project.id}>
            <Link
              href={project.href}
              className={cn(
                "group flex flex-col gap-4 rounded-xl p-5",
                "border border-[var(--color-border)] bg-[var(--color-surface)]",
                "transition-all duration-200",
                "hover:border-[var(--color-muted-2)] hover:bg-[var(--color-surface-2)]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-[var(--color-foreground)]">
                  {project.title}
                </h3>
                <Badge variant="outline">{project.status}</Badge>
              </div>

              <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-muted-2)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span
                className={cn(
                  "flex items-center gap-1 text-xs text-[var(--color-muted)]",
                  "transition-colors group-hover:text-[var(--color-foreground)]"
                )}
              >
                View project
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn delay={0.2}>
        <div className="mt-10">
          <Link
            href="/projects"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)]",
              "transition-colors hover:text-[var(--color-foreground)]"
            )}
          >
            All projects
            <ArrowRight size={13} />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
}
