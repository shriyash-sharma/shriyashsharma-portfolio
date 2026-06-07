import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SEMANTIC_SEARCH_FAQ } from "@/lib/ai-lab/semantic-search";

export function SemanticSearchSeoContent() {
  return (
    <Section
      as="article"
      className="border-t border-[var(--color-border)] pt-12"
      aria-label="Semantic search learning guide"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Learn the concepts
          </span>
          <h2 className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)] sm:text-[28px]">
            Semantic Search Explained: Keyword Search vs Vector Search in Real AI Systems
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
            This guide explains what semantic search is, how embeddings and cosine
            similarity work, and why retrieval quality is the foundation of reliable
            RAG systems.
          </p>
        </header>

        <Topic title="What Is Semantic Search?">
          <p>
            Semantic search is a retrieval approach that finds content by meaning,
            not just literal overlap. Traditional keyword search checks whether the
            same words appear in both query and document. Semantic retrieval maps
            text into vectors and compares geometric proximity. If two texts express
            related intent, they can match even when vocabulary differs.
          </p>
          <p>
            This difference is practical, not academic. People phrase the same idea
            in many ways. A user can ask about backend API development, while the
            source document may say modern Python service architecture. Keyword-only
            logic can miss that connection. Semantic ranking can recover it because
            it evaluates conceptual similarity.
          </p>
          <p>
            For engineers building AI products, semantic search is often the layer
            that turns a static knowledge base into a useful retrieval system.
            Without it, many queries fail unless users already know the exact terms
            used in your documents.
          </p>
        </Topic>

        <Topic title="Keyword Search vs Semantic Search">
          <p>
            Keyword search remains valuable. It is deterministic, cheap, and highly
            effective for exact identifiers: ticket numbers, function names, product
            codes, and literal phrase lookups. If your query is exact and the text
            uses the same words, lexical matching is hard to beat.
          </p>
          <p>
            Semantic search is stronger when users ask in natural language,
            paraphrase concepts, or use synonyms. Instead of requiring textual
            overlap, it retrieves by intent. In real systems, this is common:
            customers do not write queries using your documentation style guide.
          </p>
          <p>
            The strongest production pattern is often hybrid retrieval. Start with
            lexical and semantic candidates, then combine and rerank. This protects
            precision on exact terms while improving recall for conceptual matches.
            The playground on this page focuses on side-by-side intuition so teams
            can see why each method behaves differently.
          </p>
        </Topic>

        <Topic title="Embeddings Explained">
          <p>
            Embeddings are dense numeric vectors that represent text meaning. You
            can think of them as coordinates in a high-dimensional space where
            semantically similar texts are closer together. The exact dimensions and
            training objective depend on the embedding model, but the operational
            idea is consistent: convert language into vectors so math can compare
            intent.
          </p>
          <p>
            This vectorization is what enables semantic retrieval. At indexing time,
            you embed each document chunk and store the vector. At query time, you
            embed only the query, compute similarity against stored vectors, and
            rank the nearest neighbors. That is why this implementation precomputes
            dataset embeddings once and only embeds user queries at runtime.
          </p>
          <p>
            From a platform perspective, this architecture controls cost. Precompute
            static vectors offline, reuse them indefinitely, and keep runtime calls
            narrow. You avoid large local model downloads, avoid GPU requirements,
            and still teach the core retrieval pipeline used in modern AI systems.
          </p>
        </Topic>

        <Topic title="Cosine Similarity Explained">
          <p>
            Cosine similarity compares the angle between two vectors. Values range
            from about -1 to 1, but in embedding retrieval workflows you usually see
            non-negative values due to model behavior and normalization. Higher
            scores indicate stronger semantic alignment.
          </p>
          <p>
            Why cosine similarity instead of Euclidean distance? In many language
            vector spaces, direction is more informative than magnitude. Cosine
            focuses on orientation. If two embeddings point similarly, they are
            likely related in meaning even if absolute vector lengths differ.
          </p>
          <p>
            In this playground, similarity scores are translated into human labels:
            very similar, strong match, related, weak match, and unrelated. This
            interpretation layer is important in educational products because raw
            decimals alone are hard to reason about.
          </p>
        </Topic>

        <Topic title="Why Semantic Search Outperforms Keyword Search on Natural Language Queries">
          <p>
            Keyword search assumes language is rigid. Human queries are not. Users
            ask broad or incomplete questions, and they often avoid your internal
            terminology. Semantic retrieval handles this better because it models
            context and intent, not just word overlap.
          </p>
          <p>
            Consider a query like backend API development. A lexical matcher may
            overvalue rows that repeat backend and api, even if they provide little
            design context. A semantic matcher can elevate records about FastAPI,
            service architecture, request validation, and production reliability,
            because those concepts are close in vector space.
          </p>
          <p>
            This is exactly why semantic retrieval underpins enterprise assistants,
            support automation, and RAG chat systems. The goal is not to retrieve
            the most overlapping words; the goal is to retrieve the most useful
            meaning for the user intent.
          </p>
        </Topic>

        <Topic title="Vector Search Explained for Engineers">
          <p>
            Vector search means nearest-neighbor search over embeddings. At small
            scale, brute-force cosine comparison is enough for education and demos.
            At larger scale, approximate nearest-neighbor indexes reduce latency and
            compute cost. The logical pipeline remains unchanged.
          </p>
          <p>
            This demo intentionally uses static JSON vectors and in-memory ranking.
            That keeps infrastructure simple and transparent. You can inspect records,
            see similarity outputs, and understand ranking behavior without bringing
            in pgvector, Qdrant, or separate vector infrastructure.
          </p>
          <p>
            As a portfolio architecture, that is a strong tradeoff: low operational
            burden, clear educational value, and production-friendly deployment on
            serverless frontend plus lightweight backend.
          </p>
        </Topic>

        <Topic title="How Semantic Retrieval Connects to RAG">
          <p>
            Retrieval-Augmented Generation depends on one core capability: find the
            right evidence before generation. RAG quality is often retrieval quality.
            If retrieval returns weak chunks, the LLM response will be incomplete or
            off-target regardless of model size.
          </p>
          <p>
            The canonical RAG flow is straightforward: documents are chunked,
            chunk embeddings are stored, a query embedding is produced, nearest
            chunks are retrieved, then the model generates using that grounded
            context. Semantic search is the engine inside this flow.
          </p>
          <p>
            If you want to see the full pipeline in action, including chunking and
            answer synthesis, continue to the dedicated tool:
            <span> </span>
            <Link
              href="/ai-lab/rag-explorer"
              className="font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Try RAG Explorer
            </Link>
            .
          </p>
        </Topic>

        <Topic title="Cost-Efficient Semantic Search Architecture">
          <p>
            Many teams assume semantic search requires expensive infrastructure. In
            reality, architecture choices determine cost. This implementation keeps
            runtime spend small by precomputing dataset vectors once and reusing
            them. During requests, only the query is embedded.
          </p>
          <p>
            That means no local model downloads, no GPU nodes, and no vector
            database dependency for small educational corpora. You still expose the
            exact retrieval mechanics users need to learn: embedding, similarity,
            ranking, and interpretation.
          </p>
          <p>
            For portfolio demonstrations, this pattern is ideal. It communicates AI
            engineering literacy while staying deployable on common hosting setups
            such as Vercel for web and Render for services.
          </p>
        </Topic>

        <Topic title="When to Use Keyword Search, Semantic Search, or Hybrid Retrieval">
          <p>
            Use keyword search when exactness matters and terms are stable: IDs,
            error codes, specific class names, and strict field lookups. Use
            semantic search when users ask conceptually and language varies. Use
            hybrid retrieval when you need both precision and recall across mixed
            query types.
          </p>
          <p>
            In product systems, query intent changes by user and context. Support
            teams may paste exact logs, while end users ask broad questions.
            Hybrid retrieval helps serve both without forcing one method to solve
            all cases.
          </p>
          <p>
            The right strategy is empirical. Measure relevance metrics, inspect
            misses, and track user outcomes. Retrieval design is not a one-time
            decision; it is an iterative engineering loop.
          </p>
        </Topic>

        <Topic title="Operational Considerations for Production Semantic Search">
          <p>
            Reliable semantic retrieval needs guardrails: request limits, query size
            limits, observability, and graceful fallbacks when provider APIs are
            unavailable. Even educational tools should model these fundamentals.
          </p>
          <p>
            You also need data lifecycle discipline. If source content changes,
            embeddings must be regenerated. Version your dataset, record the model
            used, and verify dimensional consistency across indexing and query paths.
          </p>
          <p>
            Finally, treat retrieval quality as a product metric. Collect failed
            queries, test alternative chunking strategies, and calibrate top-k.
            Better retrieval is often the most cost-effective way to improve AI
            answer quality.
          </p>
        </Topic>

        <Topic title="Why This Playground Is Useful for Interviews and Portfolio Demos">
          <p>
            Interviewers and reviewers often ask whether a candidate understands AI
            systems beyond API integration. A semantic search playground gives a
            concrete answer. It demonstrates retrieval mechanics, ranking logic,
            architecture constraints, and cost-aware design choices.
          </p>
          <p>
            The side-by-side comparison between lexical and semantic outputs makes
            tradeoffs visible in seconds. The pipeline diagrams map implementation
            steps to conceptual understanding. The SEO section provides crawlable
            educational depth and schema markup for discoverability.
          </p>
          <p>
            Together, these elements show engineering maturity: not just building
            features, but choosing architecture that balances correctness,
            performance, maintainability, and cost.
          </p>
        </Topic>

        <section className="flex flex-col gap-5" aria-label="Frequently asked questions">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Frequently asked questions
          </h3>
          <dl className="flex flex-col gap-5">
            {SEMANTIC_SEARCH_FAQ.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="text-[14.5px] font-medium text-[var(--color-foreground)]">
                  {item.question}
                </dt>
                <dd className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Key takeaways
          </h3>
          <ul className="list-disc pl-5 text-[14px] leading-relaxed text-[var(--color-secondary)]">
            <li>Semantic search retrieves by meaning, not only literal overlap.</li>
            <li>Embeddings map text to vectors that preserve conceptual similarity.</li>
            <li>Cosine similarity ranks how closely query and document meaning align.</li>
            <li>Hybrid retrieval often combines lexical precision and semantic recall.</li>
            <li>RAG quality is tightly coupled to retrieval quality.</li>
            <li>Precomputed vectors plus query-only embedding is a cost-efficient architecture.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3" aria-label="Related AI Lab tools">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Related AI Lab tools and reading
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <RelatedLink
              href="/ai-lab/embedding-visualizer"
              title="Embedding Visualizer"
              description="Explore the vector-space intuition behind semantic search."
            />
            <RelatedLink
              href="/ai-lab/rag-explorer"
              title="RAG Explorer"
              description="Follow semantic retrieval into full retrieval-augmented generation."
            />
            <RelatedLink
              href="/ai-lab/context-window-visualizer"
              title="Context Window Visualizer"
              description="See why retrieval selects compact evidence instead of stuffing prompts."
            />
            <RelatedLink
              href="/blog"
              title="AI engineering articles"
              description="Read related articles on embeddings, RAG, FastAPI, and AI architecture."
            />
          </div>
        </section>
      </div>
    </Section>
  );
}

function RelatedLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-colors hover:border-[var(--color-border-strong)]"
    >
      <span className="block text-[13px] font-medium text-[var(--color-foreground)]">
        {title}
      </span>
      <span className="mt-1 block text-[12px] leading-relaxed text-[var(--color-secondary)]">
        {description}
      </span>
    </Link>
  );
}

function Topic({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
        {title}
      </h3>
      <div className="flex flex-col gap-3 text-[14px] leading-relaxed text-[var(--color-secondary)]">
        {children}
      </div>
    </section>
  );
}
