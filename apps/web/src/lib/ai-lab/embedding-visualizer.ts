import embeddingVisualizerData from "./embedding-visualizer-data.json";

export type EmbeddingCategory =
  | "Animal"
  | "Vehicle"
  | "Technology"
  | "AI"
  | "Business";

export type EmbeddingConcept = {
  text: string;
  category: EmbeddingCategory;
  x: number;
  y: number;
};

export const EMBEDDING_CATEGORIES: EmbeddingCategory[] = [
  "Animal",
  "Vehicle",
  "Technology",
  "AI",
  "Business",
];

export const CATEGORY_LABELS: Record<EmbeddingCategory, string> = {
  Animal: "Animals",
  Vehicle: "Vehicles",
  Technology: "Technology",
  AI: "AI",
  Business: "Business",
};

export const CATEGORY_COLORS: Record<EmbeddingCategory, string> = {
  Animal: "#6ee7a0",
  Vehicle: "#7eb8ff",
  Technology: "#c4a8ff",
  AI: "#ffd08a",
  Business: "#ffb8d0",
};

export const EMBEDDING_VISUALIZER_DATA: EmbeddingConcept[] =
  embeddingVisualizerData as EmbeddingConcept[];

/** Max pairwise distance in the curated 2D projection (for normalizing similarity). */
const MAX_PROJECTION_DISTANCE = 5;

export const EMBEDDING_VISUALIZER_FAQ = [
  {
    question: "What are embeddings?",
    answer:
      "Embeddings are numeric vector representations of text. An embedding model converts words, sentences, or documents into arrays of numbers that capture semantic meaning. Similar concepts produce vectors that point in similar directions in high-dimensional space.",
  },
  {
    question: "How do embeddings work?",
    answer:
      "Embedding models are trained on large text corpora to learn patterns of meaning. During training, the model adjusts weights so that texts with similar context end up with similar vector representations. At inference time, new text is passed through the model and returned as a fixed-length vector.",
  },
  {
    question: "What is semantic similarity?",
    answer:
      "Semantic similarity measures how closely two pieces of text relate in meaning, not spelling. In vector space, similarity is often computed with cosine similarity or Euclidean distance. Texts about related topics—like Dog and Cat—score high; unrelated pairs—like Dog and PostgreSQL—score low.",
  },
  {
    question: "Why are embeddings used in RAG?",
    answer:
      "RAG systems embed document chunks and user queries into the same vector space. At query time, vector search retrieves the most semantically relevant chunks before sending them to an LLM. This grounds answers in source material and avoids stuffing entire documents into the prompt.",
  },
  {
    question: "What is vector search?",
    answer:
      "Vector search finds the nearest items in embedding space using distance or similarity metrics. Instead of matching exact keywords, it returns results that are conceptually close to the query. Modern systems use approximate nearest-neighbor indexes for speed at scale.",
  },
  {
    question: "Can embeddings understand meaning?",
    answer:
      "Embeddings capture statistical patterns of meaning learned from training data. They do not truly understand language the way humans do, but they encode relationships—synonyms, topics, and context—well enough to power semantic search, clustering, and retrieval in production AI systems.",
  },
] as const;

export function distance2D(a: EmbeddingConcept, b: EmbeddingConcept): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Map 2D projection distance to a 0–1 similarity score. */
export function projectionSimilarity(
  a: EmbeddingConcept,
  b: EmbeddingConcept
): number {
  const distance = distance2D(a, b);
  return Math.max(0, 1 - distance / MAX_PROJECTION_DISTANCE);
}

export function nearestNeighbors(
  concept: EmbeddingConcept,
  k = 4,
  dataset = EMBEDDING_VISUALIZER_DATA
): EmbeddingConcept[] {
  return dataset
    .filter((item) => item.text !== concept.text)
    .map((item) => ({ item, score: projectionSimilarity(concept, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ item }) => item);
}

export function similarityLabel(score: number): {
  label: string;
  colorClass: string;
  explanation: string;
} {
  if (score >= 0.85) {
    return {
      label: "Very Similar",
      colorClass: "bg-[#1f4f3a] text-[#b8f7d0]",
      explanation:
        "These concepts sit close together in embedding space because they share strong semantic overlap—often the same topic, category, or usage context.",
    };
  }
  if (score >= 0.65) {
    return {
      label: "Related",
      colorClass: "bg-[#204a5a] text-[#bde8ff]",
      explanation:
        "These concepts are in the same broad neighborhood. They may share themes or appear in similar contexts, but are not as tightly aligned as near neighbors.",
    };
  }
  if (score >= 0.4) {
    return {
      label: "Weak Match",
      colorClass: "bg-[#4c4421] text-[#ffe4a8]",
      explanation:
        "Some distant relationship may exist, but these concepts belong to different semantic regions. Vector search would rarely rank them together.",
    };
  }
  return {
    label: "Low Similarity",
    colorClass: "bg-[#4a2733] text-[#ffc1cf]",
    explanation:
      "These concepts are far apart in embedding space. They describe unrelated domains—like animals vs. databases—so keyword overlap and semantic meaning diverge sharply.",
  };
}

export function findConcept(text: string): EmbeddingConcept | undefined {
  return EMBEDDING_VISUALIZER_DATA.find((item) => item.text === text);
}

export const EMBEDDING_DATA_BOUNDS = {
  minX: 1.4,
  maxX: 9.5,
  minY: 1.8,
  maxY: 7.6,
};
