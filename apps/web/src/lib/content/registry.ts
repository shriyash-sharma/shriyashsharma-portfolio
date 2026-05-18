/**
 * Frontend content collection registry.
 *
 * This mirrors the backend's collection vocabulary for routing, labeling, and
 * editorial UI decisions. It is intentionally capability-oriented rather than
 * item-oriented so views can reason about supported collection types without
 * coupling to persistence implementation details.
 */

import type { ContentType } from "@/lib/api/contracts/content";

export type ContentCollection = {
  type: ContentType;
  routeBase: string;
  directory: string;
  aiIndexable: boolean;
  description: string;
};

export const contentCollections: ContentCollection[] = [
  {
    type: "project",
    routeBase: "/projects",
    directory: "content/projects",
    aiIndexable: true,
    description: "Shipped work, system notes, architecture tradeoffs.",
  },
  {
    type: "case-study",
    routeBase: "/case-studies",
    directory: "content/case-studies",
    aiIndexable: true,
    description: "Long-form engineering breakdowns and production outcomes.",
  },
  {
    type: "article",
    routeBase: "/blog",
    directory: "content/blog",
    aiIndexable: true,
    description: "Engineering writing and implementation notes.",
  },
  {
    type: "architecture-note",
    routeBase: "/architecture",
    directory: "content/architecture",
    aiIndexable: true,
    description: "System topology, ADR-style decisions, and platform notes.",
  },
  {
    type: "experiment",
    routeBase: "/experiments",
    directory: "content/experiments",
    aiIndexable: false,
    description: "Prototype logs and early technical explorations.",
  },
  {
    type: "research-log",
    routeBase: "/research",
    directory: "content/research",
    aiIndexable: true,
    description: "AI/RAG investigation notes and evaluation logs.",
  },
];

export function getAiIndexableCollections() {
  return contentCollections.filter((collection) => collection.aiIndexable);
}
