"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";
import { getPathLocale, localizePath } from "@/lib/i18n/config";

type FocusArea = {
  title: string;
  description: string;
  technologies: string[];
  href: string;
  cta: string;
};

const FOCUS_AREAS: FocusArea[] = [
  {
    title: "Frontend Engineering",
    description:
      "Production interfaces built with Next.js, React, and TypeScript — accessible, fast, and designed for real product constraints.",
    technologies: ["Next.js", "React", "TypeScript"],
    href: "/projects",
    cta: "View projects",
  },
  {
    title: "Backend & APIs",
    description:
      "Reliable services and data layers using FastAPI and Python, backed by PostgreSQL and pragmatic system design.",
    technologies: ["FastAPI", "Python", "PostgreSQL"],
    href: "/case-studies",
    cta: "Read case studies",
  },
  {
    title: "AI Engineering",
    description:
      "Retrieval-Augmented Generation (RAG) pipelines, embeddings, and semantic search that keep AI features grounded and accurate.",
    technologies: ["RAG", "Embeddings", "Semantic Search"],
    href: "/ai-lab",
    cta: "Explore AI Lab",
  },
  {
    title: "System Design & Full-Stack",
    description:
      "End-to-end ownership across the stack — from architecture and APIs to deployment — focused on systems that scale.",
    technologies: ["System Design", "Full Stack", "Architecture"],
    href: "/about",
    cta: "About me",
  },
];

/**
 * SEO + GEO content section: server-rendered (SSR HTML) overview of the
 * technologies and areas of focus, with contextual internal links to the
 * Projects, Case Studies, AI Lab, and About pages. Strengthens crawlable
 * content depth and internal linking on the homepage.
 */
export function TechnologiesSection() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);

  return (
    <Section
      aria-labelledby="focus-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Technologies &amp; Areas of Focus
          </span>
          <h2
            id="focus-heading"
            className="max-w-3xl text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[28px]"
          >
            Full-stack engineering, from modern web architecture to applied AI
          </h2>
          <p className="max-w-3xl text-[14px] leading-[1.8] text-[var(--color-secondary)] sm:text-[15px]">
            I build across the full stack, combining modern frontend
            architecture with robust backend systems and applied AI. My core
            stack is <strong className="font-medium text-[var(--color-foreground)]">Next.js</strong>,{" "}
            <strong className="font-medium text-[var(--color-foreground)]">React</strong>, and{" "}
            <strong className="font-medium text-[var(--color-foreground)]">TypeScript</strong> on the
            frontend, with <strong className="font-medium text-[var(--color-foreground)]">FastAPI</strong> and{" "}
            <strong className="font-medium text-[var(--color-foreground)]">Python</strong> powering backend
            services and APIs. I design data layers on{" "}
            <strong className="font-medium text-[var(--color-foreground)]">PostgreSQL</strong>, build{" "}
            <strong className="font-medium text-[var(--color-foreground)]">semantic search</strong> and{" "}
            <strong className="font-medium text-[var(--color-foreground)]">Retrieval-Augmented Generation (RAG)</strong>{" "}
            pipelines, and focus on <strong className="font-medium text-[var(--color-foreground)]">system design</strong>{" "}
            that scales.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FOCUS_AREAS.map((area) => (
            <Link
              key={area.title}
              href={localizePath(area.href, locale)}
              className={cn(
                "group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6",
                "transition-[border-color,box-shadow] duration-[220ms] ease-out",
                "hover:border-[var(--color-border-strong)] hover:shadow-[0_0_40px_0_rgba(255,255,255,0.02)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-foreground)] sm:text-[16px]">
                  {area.title}
                </h3>
                <ArrowUpRight
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-foreground)]"
                />
              </div>
              <p className="text-[13px] leading-[1.7] text-[var(--color-secondary)]">
                {area.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {area.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[var(--color-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="mt-auto pt-2 text-[12.5px] font-medium text-[var(--color-foreground)] opacity-80 transition-opacity group-hover:opacity-100">
                {area.cta}
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
