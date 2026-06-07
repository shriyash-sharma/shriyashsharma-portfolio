import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RAG_EXPLORER_FAQ } from "@/lib/ai-lab/faq";

/**
 * Substantial, crawlable educational content rendered below the interactive
 * tool. Plain server-rendered HTML (no accordions) so search engines index it
 * for RAG / embeddings / vector-search queries.
 */
export function RagSeoContent() {
  return (
    <Section
      as="article"
      className="border-t border-[var(--color-border)] pt-12"
      aria-label="Learn about RAG"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Learn the concepts
          </span>
          <h2 className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)] sm:text-[28px]">
            Retrieval-Augmented Generation, explained
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
            A plain-English guide to the ideas behind the tool above — RAG,
            embeddings, vector search, and how modern AI assistants stay
            accurate.
          </p>
        </header>

        <Topic title="What Is Retrieval-Augmented Generation (RAG)?">
          <p>
            Retrieval-Augmented Generation (RAG) is an AI architecture that
            combines a search system with a large language model. Instead of
            answering only from what a model memorized during training, a RAG
            system first retrieves relevant passages from an external knowledge
            source and supplies them to the model as context. The model then
            generates an answer grounded in that evidence.
          </p>
          <p>
            RAG exists to solve two problems that language models have on their
            own. First, a model&apos;s knowledge is frozen at training time, so it
            cannot know about recent events or your private documents. Second,
            models hallucinate — they produce confident but incorrect answers when
            they don&apos;t actually know. By retrieving trustworthy text and asking
            the model to answer from it, RAG keeps responses current, accurate,
            and traceable to a source.
          </p>
          <p>
            This is why RAG has become the default pattern for documentation
            assistants, customer support bots, internal knowledge tools, and AI
            search. It turns a general-purpose model into a domain expert on your
            data — without expensive retraining.
          </p>
        </Topic>

        <Topic title="How Embeddings Work">
          <p>
            An embedding converts a piece of text into a list of numbers — a
            vector — that represents its meaning. Embedding models are trained so
            that texts with similar meanings get vectors pointing in similar
            directions, while unrelated texts point in different directions. The
            words &quot;car&quot; and &quot;automobile&quot; share no letters, but a
            good model places their vectors very close together.
          </p>
          <p>
            Embeddings exist because keyword search is brittle. Searching for the
            exact word &quot;refund&quot; misses a document that says &quot;money
            back guarantee,&quot; even though they mean the same thing. Because
            embeddings capture meaning rather than spelling, semantic search finds
            the right passage even when the wording is completely different.
          </p>
          <p>
            The tool above uses the open-source model{" "}
            <code className="rounded bg-[var(--color-surface-2)] px-1 py-0.5 font-mono text-[12.5px]">
              BAAI/bge-large-en-v1.5
            </code>
            , which produces 1024-dimensional vectors. Every chunk of your
            document and your question become one of these vectors, so they can be
            compared with simple math.
          </p>
        </Topic>

        <Topic title="What Is Vector Search?">
          <p>
            Vector search, also called semantic search, finds the stored vectors
            that are closest to a query vector. &quot;Closest&quot; is usually
            measured with cosine similarity, which compares the angle between two
            vectors: a score near 1.0 means a very strong match, while a score
            near 0 means they are unrelated.
          </p>
          <p>
            When you ask a question, the system embeds it with the same model used
            for the document chunks. Now the question and every chunk live in the
            same vector space, so a vector database can rank all chunks by
            similarity and return the top matches — typically the top three to
            six. Many systems also apply a minimum similarity threshold to discard
            weak, off-topic matches.
          </p>
          <p>
            Vector databases such as pgvector, Pinecone, Weaviate, and Qdrant use
            approximate nearest neighbor algorithms (like HNSW) to do this search
            in milliseconds, even across millions of vectors. That speed is what
            makes real-time RAG possible.
          </p>
        </Topic>

        <Topic title="Why Chunking and Overlap Matter">
          <p>
            Documents are often too long to embed or feed to a model in one piece,
            so RAG splits them into smaller passages called chunks. Good chunking
            keeps a single idea or section together. If chunks are too large,
            retrieval becomes vague; if they are too small, they lose the context
            that makes them meaningful.
          </p>
          <p>
            Chunk overlap solves a boundary problem: if a key sentence is split
            between two chunks, neither holds the full thought. By repeating a
            little text from the previous chunk, overlap ensures ideas that span a
            boundary still appear, in full, in at least one chunk — which improves
            retrieval recall.
          </p>
        </Topic>

        <Topic title="How Modern AI Assistants Use RAG">
          <p>
            A production AI assistant runs the pipeline you see in the tool above
            every time you ask a question. Ahead of time, it ingests documents:
            chunking them, embedding each chunk, and storing the vectors in a
            vector database. At query time, it embeds your question, retrieves the
            most similar chunks, and constructs a grounded prompt.
          </p>
          <p>
            That prompt combines a system instruction (&quot;answer only from the
            context below&quot;), the retrieved passages, and your question. The
            language model — here, Groq running{" "}
            <code className="rounded bg-[var(--color-surface-2)] px-1 py-0.5 font-mono text-[12.5px]">
              llama-3.3-70b-versatile
            </code>{" "}
            — then writes an answer using only that evidence, often citing which
            chunk it used.
          </p>
          <p>
            The result is an assistant that is accurate, up to date, and
            verifiable. Understanding each step — chunking, embeddings, vector
            search, retrieval, grounding, and generation — is the foundation for
            building reliable AI systems, and the RAG Explorer above lets you watch
            all of it happen on your own text.
          </p>
        </Topic>

        <section className="flex flex-col gap-3" aria-label="Related AI Lab tools">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Related AI Lab tools and reading
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <RelatedLink
              href="/ai-lab/semantic-search-playground"
              title="Semantic Search Playground"
              description="Compare keyword search with semantic retrieval, the core ranking step inside RAG."
            />
            <RelatedLink
              href="/ai-lab/embedding-visualizer"
              title="Embedding Visualizer"
              description="See how text becomes vectors before chunks can be searched semantically."
            />
            <RelatedLink
              href="/ai-lab/context-window-visualizer"
              title="Context Window Visualizer"
              description="Understand why RAG keeps prompts compact and avoids context overflow."
            />
            <RelatedLink
              href="/blog"
              title="AI engineering articles"
              description="Read related writing on RAG, search architecture, FastAPI, and production AI systems."
            />
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-label="Frequently asked questions">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Frequently asked questions
          </h3>
          <dl className="flex flex-col gap-5">
            {RAG_EXPLORER_FAQ.map((item) => (
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
