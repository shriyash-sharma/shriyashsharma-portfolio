import Link from "next/link";
import { Section } from "@/components/layout/section";
import { EMBEDDING_VISUALIZER_FAQ } from "@/lib/ai-lab/embedding-visualizer";

export function EmbeddingSeoContent() {
  return (
    <Section
      as="article"
      className="border-t border-[var(--color-border)] pt-12"
      aria-label="Learn about embeddings and vector search"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Learn the concepts
          </span>
          <h2 className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)] sm:text-[28px]">
            Embeddings Explained: Vector Representations, Semantic Similarity,
            and RAG Retrieval
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
            This guide explains what embeddings are, how semantic similarity
            works, why related concepts cluster in vector space, and how
            embedding-based retrieval powers modern RAG and semantic search
            systems.
          </p>
        </header>

        <Topic title="What Are Embeddings?">
          <p>
            Embeddings are numeric vector representations of text. When you pass a
            word, sentence, or document through an embedding model, the output
            is a fixed-length array of floating-point numbers—often hundreds or
            thousands of values. Each number is not meaningful on its own, but
            together the vector encodes semantic information learned from vast
            text corpora during model training.
          </p>
          <p>
            The core idea behind vector embeddings is simple: texts with similar
            meaning should map to nearby points in space. A sentence about dogs
            should sit closer to a sentence about cats than to a sentence about
            PostgreSQL. This geometric property is what makes embeddings useful
            for search, clustering, recommendation, and retrieval in AI
            systems.
          </p>
          <p>
            If you are new to the topic, think of embeddings as coordinates in a
            meaning landscape. Traditional search looks for exact word matches.
            Embedding search looks for conceptual proximity. That shift—from
            spelling to semantics—is one of the most important architectural
            changes in modern AI engineering.
          </p>
        </Topic>

        <Topic title="How Embeddings Work Under the Hood">
          <p>
            Embedding models are typically neural networks trained with
            self-supervised objectives. During training, the model sees billions
            of text pairs and learns to place related content near each other in
            vector space. Common training signals include predicting nearby
            words, contrasting positive and negative examples, or aligning
            multilingual sentences that express the same idea.
          </p>
          <p>
            At inference time, the trained model is frozen. You send new text
            through an encoder and receive a vector. The vector length is fixed
            regardless of input size—though very long documents are often
            chunked first. Popular embedding dimensions include 384, 768, and
            1,536, depending on the model family and latency budget.
          </p>
          <p>
            The embedding pipeline in production usually looks like this: raw
            text enters preprocessing (normalization, language detection,
            optional chunking), passes through the embedding model, and is stored
            in a vector index. At query time, the user question is embedded with
            the same model, and nearest-neighbor search retrieves the closest
            stored vectors. Consistency—using the same model for indexing and
            querying—is critical for quality.
          </p>
        </Topic>

        <Topic title="Semantic Similarity: Measuring Meaning in Vector Space">
          <p>
            Once text is embedded, you need a way to compare vectors. The most
            common metric is cosine similarity, which measures the angle between
            two vectors. A score near 1.0 indicates strong alignment; a score near
            0 indicates little relation. Euclidean distance is also used,
            especially when vectors are normalized to unit length.
          </p>
          <p>
            Semantic similarity is not the same as lexical overlap. Consider the
            query &quot;automobile maintenance&quot; against two documents: one
            mentions &quot;car repair schedules&quot; and another mentions
            &quot;database replication lag.&quot; Keyword search may miss the
            first document if it does not contain the word automobile. Semantic
            search, powered by embeddings, can still rank it highly because the
            underlying concepts align.
          </p>
          <p>
            In the Embedding Visualizer above, similarity is demonstrated with a
            curated 2D projection. Real systems operate in much higher
            dimensions, but the intuition is identical: close vectors imply
            related meaning. When you compare Dog and Cat, you see high
            similarity. When you compare Dog and PostgreSQL, similarity drops
            sharply—exactly the behavior you want in retrieval pipelines.
          </p>
        </Topic>

        <Topic title="Why Related Concepts Cluster Together">
          <p>
            Clustering is an emergent property of good embedding models. During
            training, the model repeatedly observes that certain words and
            phrases appear in similar contexts. Animals appear in pet-care
            articles, wildlife documentaries, and veterinary content. Database
            systems appear in backend architecture guides, DevOps runbooks, and
            data engineering blogs. The model internalizes these co-occurrence
            patterns as geometric neighborhoods.
          </p>
          <p>
            In the interactive map, you can see five clear clusters: animals,
            vehicles, technology tools, AI concepts, and business software terms.
            Within each cluster, nearest neighbors make intuitive sense. Dog is
            close to Cat, Wolf, and Fox. FastAPI sits near Next.js, Docker, and
            Redis. RAG aligns with Embeddings, Semantic Search, and Vector
            Database. These groupings are not hand-authored—they mirror how
            semantic models organize knowledge.
          </p>
          <p>
            Cluster structure also explains failure modes. If your embedding
            model is weak for a domain—legal text, medical jargon, or niche
            internal acronyms—clusters may blur and retrieval quality drops.
            Teams often evaluate embeddings by inspecting neighborhood quality
            on representative queries before committing to a production index.
          </p>
        </Topic>

        <Topic title="Embedding Visualization: Making High Dimensions Intuitive">
          <p>
            Humans cannot directly visualize 1,536-dimensional space. That is why
            embedding visualization tools project vectors into two or three
            dimensions using techniques like PCA, t-SNE, or UMAP. These
            projections sacrifice some fidelity to reveal global structure:
            clusters, outliers, and semantic boundaries.
          </p>
          <p>
            An embedding visualization is an educational instrument, not a
            literal map of production retrieval. Distances in 2D are
            approximations. Still, the pattern is what matters. When animals,
            vehicles, and databases occupy distinct regions, teams build intuition
            faster than reading abstract documentation alone.
          </p>
          <p>
            Good visualization workflows combine projection plots with
            nearest-neighbor tables and similarity scores. The plot gives the
            &quot;aha&quot; moment; the tables make the behavior auditable. This
            dual view helps engineers explain retrieval to stakeholders who do
            not work with vectors daily.
          </p>
        </Topic>

        <Topic title="Keyword Search vs. Semantic Search">
          <p>
            Keyword search indexes terms and matches queries with boolean or
            scoring rules—TF-IDF, BM25, or inverted indexes. It is fast,
            predictable, and excellent when users know exact vocabulary. But it
            struggles with paraphrase, synonymy, and cross-language intent.
          </p>
          <p>
            Semantic search replaces or augments keyword matching with vector
            retrieval. The query is embedded, compared against document
            embeddings, and ranked by similarity. This enables queries like
            &quot;how do I speed up API responses&quot; to retrieve content about
            caching, database indexing, and CDN configuration—even if those exact
            words never appear in the query.
          </p>
          <p>
            Most production systems use hybrid retrieval: keyword signals for
            precision, semantic signals for recall. The Embedding Visualizer
            focuses on the semantic side so you can see why vector search
            retrieves meaning instead of mere keywords. For a live keyword vs.
            semantic comparison, try the{" "}
            <Link
              href="/ai-lab/semantic-search-playground"
              className="font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Semantic Search Playground
            </Link>
            .
          </p>
        </Topic>

        <Topic title="Vector Search Explained">
          <p>
            Vector search is the process of finding nearest vectors in embedding
            space. Brute-force comparison works for small datasets: compute
            similarity between the query vector and every stored vector, then sort.
            At scale, teams use approximate nearest-neighbor (ANN) indexes such
            as HNSW, IVF, or product quantization variants inside engines like
            pgvector, Qdrant, Pinecone, or managed cloud offerings.
          </p>
          <p>
            A vector search pipeline has four recurring components: embedding
            generation, vector storage, index maintenance, and top-k retrieval at
            query time. Performance tuning involves index parameters, batch
            embedding throughput, memory footprint, and recall/latency tradeoffs.
            A faster index that misses relevant neighbors can be worse than a
            slower one with better recall.
          </p>
          <p>
            Vector search is not magic. It returns statistically similar content,
            which may still be wrong or outdated. That is why retrieval is only
            one layer in a full AI system. Ranking, filtering, freshness checks,
            and downstream LLM reasoning all shape the final user experience.
          </p>
        </Topic>

        <Topic title="Embeddings in RAG: The Retrieval Foundation">
          <p>
            Retrieval-Augmented Generation (RAG) combines search with language
            model generation. Instead of asking an LLM to answer from memory
            alone, RAG retrieves relevant source chunks and places them in the
            prompt as evidence. Embeddings are the bridge between user questions
            and document stores.
          </p>
          <p>
            A typical RAG ingestion flow: load documents, split into chunks,
            embed each chunk, store vectors with metadata (source URL, section,
            timestamp). Query flow: embed the user question, retrieve top-k
            chunks, assemble a grounded prompt, generate an answer with citations.
            If retrieval fails, generation quality collapses—no amount of prompt
            engineering fully compensates for missing evidence.
          </p>
          <p>
            This is why embeddings matter beyond academic curiosity. They
            determine what the model sees. Poor embeddings mean wrong chunks,
            which means hallucination risk rises and user trust falls. Strong
            embeddings keep prompts focused, reduce token waste, and improve
            answer fidelity.
          </p>
          <p>
            To walk through the full RAG pipeline interactively—chunking,
            retrieval, prompt construction, and answer generation—open the{" "}
            <Link
              href="/ai-lab/rag-explorer"
              className="font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              RAG Explorer
            </Link>
            .
          </p>
        </Topic>

        <Topic title="Practical Guidance for Engineering Teams">
          <p>
            When designing embedding-powered systems, start with evaluation data
            that reflects real user queries. Measure recall@k on labeled
            question–document pairs before optimizing infrastructure. A smaller
            model with better domain fit often beats a larger general model with
            weaker cluster structure for your content.
          </p>
          <p>
            Chunking strategy interacts directly with embedding quality.
            Overly large chunks dilute meaning; overly small chunks lose context.
            Many teams use 300–800 token chunks with light overlap, then store
            metadata for filtering by product, locale, or access level.
          </p>
          <p>
            Monitor drift. If product vocabulary changes—new feature names,
            rebrands, or regulatory terms—embedding neighborhoods shift. Schedule
            periodic re-embedding or hybrid fallback to keyword retrieval when
            confidence scores drop. Observability should include similarity
            distributions, empty-result rates, and human feedback on retrieved
            passages.
          </p>
          <p>
            Finally, communicate clearly with stakeholders. Embeddings encode
            statistical meaning, not guaranteed truth. Retrieval selects plausible
            evidence; the LLM still needs guardrails, citation formatting, and
            policy filters. Understanding vector space helps teams set realistic
            expectations and design better failure handling.
          </p>
        </Topic>

        <section
          className="flex flex-col gap-5"
          aria-label="Frequently asked questions"
        >
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Frequently asked questions
          </h3>
          <dl className="flex flex-col gap-5">
            {EMBEDDING_VISUALIZER_FAQ.map((item) => (
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
            <li>
              Embeddings convert text into vectors that capture semantic meaning.
            </li>
            <li>
              Semantic similarity measures conceptual closeness, not spelling
              overlap.
            </li>
            <li>
              Related concepts cluster in vector space—animals near animals, tools
              near tools.
            </li>
            <li>
              Vector search retrieves meaning; keyword search retrieves literal
              terms.
            </li>
            <li>
              RAG depends on embeddings to fetch the right evidence before LLM
              generation.
            </li>
            <li>
              2D visualizations are teaching tools; production systems operate in
              high-dimensional space.
            </li>
          </ul>
        </section>
      </div>
    </Section>
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
