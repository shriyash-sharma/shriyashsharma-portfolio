/**
 * Project Service – server-side only.
 * Returns portfolio project data.
 * Swap implementation for API-backed data without changing callers.
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "production" | "open-source" | "in-progress" | "archived";
  featured: boolean;
  links: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
};

/** Returns all projects, sorted by featured first. */
export async function getProjects(): Promise<Project[]> {
  // TODO: replace with real data from content/projects/ or future API
  return [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
