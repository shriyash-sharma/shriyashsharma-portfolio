import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Brain,
  Layers,
  Network,
  Search,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";

/**
 * Config-driven AI Lab tool registry.
 *
 * The AI Lab landing page renders entirely from this array. Adding a new tool
 * is a config change here (plus its own route) — the landing page never needs
 * to be redesigned. Tools marked `coming-soon` render as disabled cards so the
 * roadmap is visible without a live route.
 */

export type AiLabToolStatus = "available" | "coming-soon";

export type AiLabTool = {
  slug: string;
  title: string;
  /** Short tagline shown under the title. */
  tagline: string;
  description: string;
  href?: string;
  status: AiLabToolStatus;
  icon: LucideIcon;
  /** Concept tags rendered as chips and reused for SEO keywords. */
  tags: string[];
};

export const aiLabTools: AiLabTool[] = [
  {
    slug: "rag-explorer",
    title: "RAG Explorer",
    tagline: "Retrieval-Augmented Generation, step by step",
    description:
      "Learn how Retrieval-Augmented Generation works step-by-step by exploring chunking, embeddings, vector search, retrieval, prompt construction, and answer generation.",
    href: "/ai-lab/rag-explorer",
    status: "available",
    icon: Workflow,
    tags: ["RAG", "Embeddings", "Vector Search", "Chunking", "Prompting"],
  },
  {
    slug: "prompt-engineering-lab",
    title: "Prompt Engineering Lab",
    tagline: "Compare prompts and see how outputs shift",
    description:
      "Experiment with system prompts, few-shot examples, and constraints to understand how prompt structure changes model behavior.",
    status: "coming-soon",
    icon: SlidersHorizontal,
    tags: ["Prompting", "LLM", "Few-shot"],
  },
  {
    slug: "embedding-visualizer",
    title: "Embedding Visualizer",
    tagline: "See text projected into vector space",
    description:
      "Project sentences into a 2D map to build intuition for how embeddings cluster semantically similar text.",
    status: "coming-soon",
    icon: Boxes,
    tags: ["Embeddings", "Dimensionality Reduction"],
  },
  {
    slug: "vector-search-explorer",
    title: "Vector Search Explorer",
    tagline: "Watch similarity ranking happen live",
    description:
      "Inspect cosine similarity, top-k retrieval, and how index parameters trade off recall against latency.",
    status: "coming-soon",
    icon: Search,
    tags: ["Vector Search", "pgvector", "ANN"],
  },
  {
    slug: "semantic-search-playground",
    title: "Semantic Search Playground",
    tagline: "Keyword vs. semantic retrieval",
    description:
      "Compare lexical and semantic search side by side to see where each one wins on real queries.",
    status: "coming-soon",
    icon: Network,
    tags: ["Semantic Search", "Hybrid Retrieval"],
  },
  {
    slug: "ai-agent-simulator",
    title: "AI Agent Simulator",
    tagline: "Trace tool-calling and reasoning loops",
    description:
      "Step through an agent's plan, tool calls, and observations to understand how multi-step reasoning is orchestrated.",
    status: "coming-soon",
    icon: Brain,
    tags: ["Agents", "Tool Calling", "Reasoning"],
  },
  {
    slug: "context-window-visualizer",
    title: "Context Window Visualizer",
    tagline: "Budget tokens across a prompt",
    description:
      "Visualize how system prompts, retrieved context, and history compete for a finite context window.",
    status: "coming-soon",
    icon: Layers,
    tags: ["Context Window", "Tokens", "LLM"],
  },
];

export const RAG_EXPLORER_KEYWORDS = [
  "What is RAG",
  "Retrieval Augmented Generation",
  "Embeddings",
  "Vector Search",
  "Semantic Search",
  "Chunking",
  "AI Retrieval Systems",
  "AI Architecture",
  "RAG Tutorial",
  "RAG Explained",
];

export function getAiLabTool(slug: string): AiLabTool | undefined {
  return aiLabTools.find((tool) => tool.slug === slug);
}
