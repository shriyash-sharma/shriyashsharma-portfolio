/**
 * Maps CMS content into homepage card view models.
 * Teaser copy lives in content metadata (see seed_content.py); SVG visuals stay in UI.
 */
import type { CaseStudy } from "@/lib/services/content-service";
import type { Project } from "@/lib/services/project-service";
import {
  metadataStack,
  metadataString,
} from "@/lib/content/metadata-helpers";

export const PROJECT_VISUAL_KEYS = [
  "retrieval-pipeline",
  "rendering-pipeline",
  "collab-topology",
  "cms-workflow",
] as const;

export type ProjectVisualKey = (typeof PROJECT_VISUAL_KEYS)[number];

const DEFAULT_PROJECT_VISUAL: ProjectVisualKey = "retrieval-pipeline";

const SLUG_VISUAL_FALLBACK: Record<string, ProjectVisualKey> = {
  "ai-engineering-portfolio-platform": "retrieval-pipeline",
  "enterprise-booking-frontend-systems": "rendering-pipeline",
  "search-and-data-quality-tooling": "cms-workflow",
};

export type HomeProjectCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  keyDecision: string;
  architecture: string;
  systemDetail: string;
  stack: string[];
  href: string;
  label: string;
  visual: ProjectVisualKey;
  visualLabel: string;
};

export type HomeCaseStudyCard = {
  id: string;
  slug: string;
  title: string;
  challenge: string;
  decision: string;
  operations: string;
  outcome: string;
  tags: string[];
  href: string;
  readTime: string;
};

function resolveProjectVisual(
  slug: string,
  metadata: Project["metadata"]
): ProjectVisualKey {
  const fromMeta = metadataString(metadata, "home_visual", "homeVisual");
  if (
    fromMeta &&
    PROJECT_VISUAL_KEYS.includes(fromMeta as ProjectVisualKey)
  ) {
    return fromMeta as ProjectVisualKey;
  }
  return SLUG_VISUAL_FALLBACK[slug] ?? DEFAULT_PROJECT_VISUAL;
}

export function projectToHomeCard(project: Project): HomeProjectCard {
  const { metadata } = project;
  const stackFromMeta = metadataStack(metadata);
  const stack = stackFromMeta.length > 0 ? stackFromMeta : project.tags;

  const keyDecision =
    metadataString(metadata, "key_decision", "keyDecision") ??
    project.description;

  const architecture =
    metadataString(metadata, "architecture_summary", "architectureSummary") ??
    metadataString(metadata, "stack") ??
    project.tags.join(" · ");

  const systemDetail =
    metadataString(metadata, "system_detail", "systemDetail") ?? "";

  const label =
    metadataString(metadata, "card_label", "cardLabel") ??
    (project.featured ? "Featured" : "Project");

  const visual = resolveProjectVisual(project.slug, metadata);

  const visualLabel =
    metadataString(metadata, "visual_label", "visualLabel") ??
    `Architecture diagram for ${project.title}.`;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    keyDecision,
    architecture,
    systemDetail,
    stack,
    href: `/projects/${project.slug}`,
    label,
    visual,
    visualLabel,
  };
}

export function caseStudyToHomeCard(study: CaseStudy): HomeCaseStudyCard {
  const { metadata } = study;

  const challenge =
    metadataString(metadata, "challenge", "home_challenge", "homeChallenge") ??
    study.description;

  const decision =
    metadataString(metadata, "decision", "home_decision", "homeDecision") ??
    metadataString(metadata, "system_area", "systemArea") ??
    study.description;

  const operations =
    metadataString(metadata, "operations", "home_operations", "homeOperations") ??
    metadataString(metadata, "system_area", "systemArea") ??
    study.tags.join(" · ");

  const outcome =
    metadataString(metadata, "outcome", "home_outcome", "homeOutcome") ??
    study.description;

  return {
    id: study.id,
    slug: study.slug,
    title: study.title,
    challenge,
    decision,
    operations,
    outcome,
    tags: study.tags,
    href: `/case-studies/${study.slug}`,
    readTime: study.readTime,
  };
}

export function mapFeaturedProjectsToHomeCards(
  projects: Project[]
): HomeProjectCard[] {
  const featured = projects.filter((p) => p.featured);
  const source = featured.length > 0 ? featured : projects;
  return source.map(projectToHomeCard);
}

export function mapCaseStudiesToHomeCards(studies: CaseStudy[]): HomeCaseStudyCard[] {
  return studies.map(caseStudyToHomeCard);
}
