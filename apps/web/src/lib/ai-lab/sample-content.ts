/**
 * Static data for the RAG Explorer: a high-quality sample document and a set of
 * starter questions. Kept out of the component so the interactive client bundle
 * stays lean and the copy is easy to maintain.
 */

export const RAG_EXPLORER_EXAMPLE_QUESTIONS = [
  "What is Retrieval-Augmented Generation?",
  "Why do embeddings exist?",
  "Explain vector search in simple words.",
  "How does chunking improve retrieval?",
  "Why does RAG reduce hallucinations?",
];

/** Default chunk size (characters). Matches the backend `rag_chunk_size`. */
export const RAG_EXPLORER_DEFAULT_CHUNK_SIZE = 800;
export const RAG_EXPLORER_MIN_CHUNK_SIZE = 200;
export const RAG_EXPLORER_MAX_CHUNK_SIZE = 1600;
export const RAG_EXPLORER_CHUNK_SIZE_STEP = 100;

/**
 * ~1,900-word primer covering every concept the pipeline visualizes. Written in
 * plain English so the retrieved answers are genuinely useful for learners.
 */
export const RAG_EXPLORER_SAMPLE_CONTENT = `# A Practical Guide to Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation, almost always shortened to RAG, is one of the
most important architectures in modern applied AI. It is the technique behind
most production "chat with your documents" features, internal knowledge
assistants, customer-support bots, and AI search experiences. This guide
explains what RAG is, why it exists, and how each part of the pipeline works,
using plain language and concrete examples.

## What Problem Does RAG Solve?

Large language models (LLMs) like GPT, Llama, and Claude are trained on enormous
amounts of text. That training gives them broad general knowledge, but it also
creates two stubborn problems.

First, their knowledge is frozen at training time. A model trained in 2024 does
not know what happened in 2025, and it certainly does not know the contents of
your company's private wiki, your product documentation, or the PDF you uploaded
five minutes ago.

Second, language models hallucinate. When a model does not know an answer, it
often produces a confident, fluent, and completely wrong response. This happens
because the model is fundamentally predicting plausible text, not looking up
verified facts.

RAG addresses both problems with a simple but powerful idea: instead of asking
the model to answer from memory, you first retrieve relevant, trustworthy text
from an external source and hand that text to the model as context. The model
then answers using the supplied evidence rather than its frozen, fallible
memory. This is called "grounding" the model.

## The RAG Pipeline at a Glance

A RAG system runs a sequence of steps every time a user asks a question:

1. Chunking — split source documents into smaller passages.
2. Embeddings — convert each chunk into a vector that captures its meaning.
3. Indexing — store those vectors in a vector database.
4. Retrieval — embed the user's question and find the most similar chunks.
5. Prompt construction — combine the retrieved chunks with the question.
6. Generation — the language model writes a grounded answer.

The first three steps usually happen ahead of time, when documents are ingested.
The last three happen live, every time someone asks a question. Let's walk
through each one.

## What Is Chunking?

Documents are often long — a single article or manual can run to thousands of
words. You cannot embed an entire book as one vector and expect precise results,
and you cannot stuff an entire document into a model's limited context window.
So the first step is to break documents into smaller pieces called chunks.

A chunk is typically a few hundred characters or a paragraph or two. Good
chunking respects the natural structure of a document: it tries to keep a single
idea, section, or heading together rather than cutting a sentence in half.

Chunking matters more than people expect. If chunks are too large, each one
covers many topics, and retrieval becomes vague — you pull in a lot of irrelevant
text alongside the part you actually needed. If chunks are too small, they lose
the surrounding context that makes them meaningful. Most systems tune chunk size
to a few hundred tokens as a balance.

### Why Chunk Overlap Exists

A subtle problem appears at chunk boundaries. Imagine a key sentence gets split
so that half of it lands at the end of chunk three and the other half at the
start of chunk four. Neither chunk now contains the complete thought, and
retrieval might miss it entirely.

The fix is overlap: each chunk repeats a small slice of the text from the end of
the previous chunk. This redundancy ensures that ideas spanning a boundary still
appear, in full, in at least one chunk. Overlap costs a little extra storage but
meaningfully improves recall, which is why almost every production RAG system
uses it.

## What Are Embeddings?

An embedding converts text into a list of numbers — a vector — that represents
the meaning of that text. This is the heart of how computers "understand"
language well enough to search by meaning.

Here is the key intuition: an embedding model is trained so that texts with
similar meanings get vectors that point in similar directions, while unrelated
texts get vectors pointing in different directions. The words "car" and
"automobile" share almost no letters, but a good embedding model places their
vectors very close together because they mean the same thing. The words "bank"
(money) and "bank" (river) might land in different regions depending on context.

A modern embedding model such as BAAI/bge-large-en-v1.5 produces vectors with
1024 dimensions. That means every piece of text becomes a list of 1024 numbers.
You will never read those numbers directly, but the computer uses them to
measure semantic distance with simple math.

Embeddings exist because keyword search is brittle. Searching for the exact word
"refund" will miss a document that says "money back guarantee," even though they
mean the same thing. Embeddings capture meaning, so semantic search finds the
right passage even when the wording is completely different.

## What Do Vector Databases Do?

Once you have embedded thousands or millions of chunks, you need somewhere to
store those vectors and a way to search them quickly. That is the job of a vector
database.

A vector database is optimized for one core operation: given a query vector,
find the stored vectors that are closest to it. "Closest" is usually measured
with cosine similarity, which compares the angle between two vectors. Vectors
pointing in nearly the same direction score close to 1.0; unrelated vectors score
near 0.

Doing this comparison naively against millions of vectors would be slow, so
vector databases use approximate nearest neighbor (ANN) algorithms and special
index structures like HNSW. These let the database return the top matches in
milliseconds, trading a tiny amount of accuracy for enormous speed. Popular
options include pgvector (a PostgreSQL extension), Pinecone, Weaviate, Qdrant,
and FAISS.

## What Is Retrieval?

Retrieval is the live search step. When a user asks a question, the system embeds
that question using the same embedding model used for the chunks. Now the
question and every chunk live in the same vector space, so they can be compared
directly.

The vector database finds the top-k most similar chunks — often the top three to
six. Each result comes with a similarity score that tells you how close the match
is. A score of 0.92 indicates a very strong semantic match; 0.55 is weak and may
be off-topic. Many systems apply a minimum similarity threshold to discard weak
matches so that loosely related text never reaches the model.

The output of retrieval is a small, ranked set of passages that are highly likely
to contain the answer. This is the "retrieval" in Retrieval-Augmented
Generation.

## What Is Prompt Grounding?

Now the system assembles the final prompt that goes to the language model. This
prompt has three parts:

- A system prompt that sets the rules: "Answer only from the context below. If
  the answer is not present, say so. Do not invent facts."
- The retrieved context: the top chunks, usually numbered so the model can cite
  them.
- The user's original question.

Combining these is called grounding. The model is explicitly instructed to base
its answer on the supplied evidence rather than its own memory. Because the facts
now come from your trusted documents, the answer is accurate, current, and
traceable back to a source. Good systems ask the model to cite which chunk it
used, so users can verify the claim.

Grounding is what makes RAG trustworthy. The same model that might hallucinate an
answer from memory will, when grounded, stick to the provided text and admit when
something is not covered.

## Generation: The Final Answer

Finally, the grounded prompt is sent to the language model — in many production
systems, a fast model served by an inference provider such as Groq running
llama-3.3-70b-versatile. The model reads the system instructions, the retrieved
context, and the question, then writes a concise answer using only the evidence
it was given.

Because the heavy lifting of finding facts was done by retrieval, the model's job
is narrow and reliable: read the supplied passages and explain them clearly. The
result is an answer that is grounded, current, and far less likely to hallucinate
than a raw model call.

## Why RAG Matters

RAG turns a general-purpose language model into a domain expert on your data
without retraining it. You can update the knowledge base simply by adding or
editing documents — no expensive fine-tuning required. It keeps answers current,
reduces hallucination, and provides citations for trust.

That combination is why RAG has become the default architecture for AI
assistants, documentation search, and enterprise knowledge tools. Understanding
each step — chunking, embeddings, vector search, retrieval, grounding, and
generation — is the foundation for building reliable AI systems.`;
