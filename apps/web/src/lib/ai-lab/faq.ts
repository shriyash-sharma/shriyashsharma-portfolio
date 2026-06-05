/**
 * RAG Explorer FAQ entries. Used both for the `FAQPage` JSON-LD (rich-result
 * eligibility) and the on-page FAQ section, so the structured data always
 * matches the visible content — a requirement of Google's FAQ guidelines.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const RAG_EXPLORER_FAQ: FaqItem[] = [
  {
    question: "What is Retrieval-Augmented Generation (RAG)?",
    answer:
      "Retrieval-Augmented Generation (RAG) is an AI architecture that combines a search system with a large language model. Instead of answering only from what it memorized during training, a RAG system first retrieves relevant passages from an external knowledge source and supplies them to the model as context. The model then generates an answer grounded in that evidence, which keeps responses current, accurate, and traceable to a source.",
  },
  {
    question: "How do embeddings work?",
    answer:
      "An embedding converts a piece of text into a vector — a list of numbers — that represents its meaning. Embedding models are trained so that texts with similar meanings get vectors pointing in similar directions. This lets semantic search find the right passage even when the wording is completely different, because embeddings capture meaning rather than exact spelling.",
  },
  {
    question: "What is vector search?",
    answer:
      "Vector search, also called semantic search, finds the stored vectors closest to a query vector. Closeness is usually measured with cosine similarity, where a score near 1.0 means a strong match and a score near 0 means unrelated. The question and document chunks are embedded with the same model, so a vector database can rank all chunks by similarity and return the top matches in milliseconds.",
  },
  {
    question: "Why do chunking and overlap matter in RAG?",
    answer:
      "Documents are split into smaller passages called chunks because they are often too long to embed or feed to a model at once. Good chunking keeps a single idea together: chunks that are too large make retrieval vague, while chunks that are too small lose context. Overlap repeats a little text between adjacent chunks so an idea that spans a boundary still appears in full in at least one chunk, improving retrieval recall.",
  },
  {
    question: "Does RAG reduce hallucinations?",
    answer:
      "Yes. Language models hallucinate when they answer from memory they don't actually have. By retrieving trustworthy text and instructing the model to answer only from that context, RAG grounds responses in real evidence. This reduces hallucination and lets the model cite which retrieved passage each part of its answer came from.",
  },
];
