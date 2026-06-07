import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Concept = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

/**
 * Concise, server-rendered educational overview for the AI Lab landing page.
 * Intentionally high-level and uniquely worded — the in-depth explanations live
 * on the RAG Explorer page. This adds crawlable, GEO-friendly content to the hub
 * while linking through to the interactive deep dive.
 */
const CONCEPTS: Concept[] = [
  {
    title: "What is RAG?",
    body: "Retrieval-Augmented Generation (RAG) pairs a search system with a language model. Instead of answering only from memorized training data, the model first retrieves relevant passages from a knowledge source and answers from that evidence — keeping responses current, accurate, and traceable.",
    href: "/ai-lab/rag-explorer",
    linkLabel: "Run the RAG Explorer",
  },
  {
    title: "What are embeddings?",
    body: "An embedding turns text into a vector of numbers that captures meaning. Texts with similar meaning get similar vectors, which is why embeddings power semantic search: they match ideas rather than exact keywords, finding the right passage even when the wording is different.",
    href: "/ai-lab/embedding-visualizer",
    linkLabel: "Explore the Embedding Visualizer",
  },
  {
    title: "How vector search works",
    body: "Vector search ranks stored vectors by how close they are to a query vector, usually with cosine similarity. A vector database compares the question against every chunk and returns the closest matches in milliseconds — the retrieval step that makes real-time RAG possible.",
    href: "/ai-lab/semantic-search-playground",
    linkLabel: "Try the Semantic Search Playground",
  },
  {
    title: "How AI assistants use retrieval",
    body: "A production assistant ingests documents ahead of time — chunking, embedding, and storing them. At query time it embeds your question, retrieves the most relevant chunks, and builds a grounded prompt so the model answers from real sources instead of guessing.",
    href: "/ai-lab/context-window-visualizer",
    linkLabel: "See context window limits",
  },
];

export function AiLabConcepts() {
  return (
    <section
      aria-labelledby="ai-lab-concepts-heading"
      className="flex flex-col gap-8 border-t border-[var(--color-border)] pt-12"
    >
      <header className="flex max-w-3xl flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Concepts you&apos;ll explore
        </span>
        <h2
          id="ai-lab-concepts-heading"
          className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)] sm:text-[28px]"
        >
          The ideas behind modern AI systems
        </h2>
        <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
          A quick primer on the building blocks these tools make tangible. Go
          deeper with the{" "}
          <Link
            href="/ai-lab/rag-explorer"
            className="font-medium text-[var(--color-foreground)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:decoration-current"
          >
            RAG Explorer
          </Link>
          ,{" "}
          <Link
            href="/ai-lab/embedding-visualizer"
            className="font-medium text-[var(--color-foreground)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:decoration-current"
          >
            Embedding Visualizer
          </Link>
          , and other experiments below. Long-form reading lives in the{" "}
          <Link
            href="/blog"
            className="font-medium text-[var(--color-foreground)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:decoration-current"
          >
            blog
          </Link>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
        {CONCEPTS.map((concept) => (
          <article key={concept.title} className="flex flex-col gap-2">
            <h3 className="text-[16px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
              {concept.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
              {concept.body}
            </p>
            {concept.href && concept.linkLabel ? (
              <Link
                href={concept.href}
                className="inline-flex w-fit items-center gap-1 text-[12.5px] font-medium text-[var(--color-foreground)] opacity-80 transition-opacity hover:opacity-100"
              >
                {concept.linkLabel}
                <ArrowRight size={12} />
              </Link>
            ) : null}
          </article>
        ))}
      </div>

      <Link
        href="/ai-lab/rag-explorer"
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[var(--color-foreground)] opacity-80 transition-opacity hover:opacity-100"
      >
        See it run step by step in the RAG Explorer
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
