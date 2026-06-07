import semanticSearchDataset from "./semantic-search-dataset.json";

export type SemanticDatasetRecord = {
  id: number;
  text: string;
  embedding: number[];
};

export type KeywordResult = {
  id: number;
  text: string;
  score: number;
  matchedTerms: string[];
};

export type SemanticResult = {
  id: number;
  text: string;
  score: number;
};

const SYNONYM_BUCKETS: Record<string, string[]> = {
  api: ["api", "apis", "backend", "service", "services", "endpoint", "endpoints"],
  semantic: ["semantic", "meaning", "intent", "concept", "conceptual"],
  search: ["search", "retrieval", "retrieve", "find", "ranking", "rank"],
  embedding: ["embedding", "embeddings", "vector", "vectors"],
  rag: ["rag", "grounded", "retrievalaugmented", "retrieval-augmented"],
  database: ["postgresql", "postgres", "database", "sql", "redis"],
  frontend: ["nextjs", "next", "frontend", "ui", "web"],
  backend: ["fastapi", "python", "backend", "server"],
  agent: ["agent", "agents", "tool", "tools", "planning"],
  saas: ["saas", "tenant", "multitenant", "architecture", "system", "design"],
};

const VARIANT_TO_CANONICAL = new Map<string, string>(
  Object.entries(SYNONYM_BUCKETS).flatMap(([canonical, variants]) =>
    variants.map((variant) => [variant, canonical] as const)
  )
);

const WORD_RE = /[a-z0-9]+/g;
const DEFAULT_QUERY = "backend api development";
const DEFAULT_TOP_K = 5;
const EMBEDDING_DIMENSION =
  semanticSearchDataset.length > 0
    ? semanticSearchDataset[0].embedding.length
    : 64;

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
]);

export const SEMANTIC_SEARCH_QUERY_MAX_CHARS = 240;
export const SEMANTIC_SEARCH_DATASET: SemanticDatasetRecord[] =
  semanticSearchDataset as SemanticDatasetRecord[];
export const SEMANTIC_SEARCH_DEFAULT_QUERY = DEFAULT_QUERY;

export const SEMANTIC_SEARCH_FAQ = [
  {
    question: "What is semantic search?",
    answer:
      "Semantic search retrieves results by meaning and intent, not only exact keyword overlap. It compares embedding vectors to find conceptually similar content.",
  },
  {
    question: "How is semantic search different from keyword search?",
    answer:
      "Keyword search depends on literal term matches. Semantic search maps text to vectors, so it can match related ideas even when vocabulary differs.",
  },
  {
    question: "What are embeddings?",
    answer:
      "Embeddings are numeric vectors representing text meaning. Similar texts are encoded as vectors pointing in similar directions in high-dimensional space.",
  },
  {
    question: "What is cosine similarity?",
    answer:
      "Cosine similarity measures the angle between vectors. A value near 1 means strong semantic alignment; lower values mean weaker relation.",
  },
  {
    question: "How does semantic search help RAG systems?",
    answer:
      "RAG uses semantic retrieval to fetch relevant chunks before generation. Better retrieval improves grounding, reduces hallucinations, and increases answer quality.",
  },
] as const;

function tokenize(text: string): string[] {
  const lower = text.toLowerCase();
  return lower.match(WORD_RE) ?? [];
}

function canonicalTokens(tokens: string[]): string[] {
  const expanded: string[] = [];
  for (const token of tokens) {
    expanded.push(token);
    const canonical = VARIANT_TO_CANONICAL.get(token);
    if (canonical && canonical !== token) {
      expanded.push(canonical);
    }
  }
  return expanded;
}

export function deterministicEmbedding(text: string, dimension = EMBEDDING_DIMENSION): number[] {
  const tokens = canonicalTokens(tokenize(text));
  const vector = new Array<number>(dimension).fill(0);

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const hash = hashString(token);
    const slot = hash[0] % dimension;
    const sign = hash[1] % 2 === 0 ? 1 : -1;
    const weight = 1 + ((token.length % 5) * 0.12);
    vector[slot] += sign * weight;

    if (i < tokens.length - 1) {
      const bigram = `${token}:${tokens[i + 1]}`;
      const bhash = hashString(bigram);
      const bslot = bhash[0] % dimension;
      const bsign = bhash[1] % 2 === 0 ? 1 : -1;
      vector[bslot] += bsign * 0.55;
    }
  }

  return normalize(vector);
}

function hashString(value: string): number[] {
  let h1 = 2166136261;
  let h2 = 16777619;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 16777619);
    h2 ^= code * 31;
    h2 = Math.imul(h2, 1099511627);
  }
  return [Math.abs(h1), Math.abs(h2)];
}

function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (norm <= 1e-12) {
    return vector;
  }
  return vector.map((value) => value / norm);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) {
    return 0;
  }

  let dot = 0;
  let an = 0;
  let bn = 0;

  for (let i = 0; i < n; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    an += av * av;
    bn += bv * bv;
  }

  if (an <= 1e-12 || bn <= 1e-12) {
    return 0;
  }

  return dot / (Math.sqrt(an) * Math.sqrt(bn));
}

export function keywordSearch(query: string, topK = DEFAULT_TOP_K): KeywordResult[] {
  const rawTerms = tokenize(query).filter((term) => !STOPWORDS.has(term));
  const terms = Array.from(new Set(canonicalTokens(rawTerms)));

  return SEMANTIC_SEARCH_DATASET
    .map((row) => {
      const haystack = row.text.toLowerCase();
      const matchedTerms = terms.filter((term) => haystack.includes(term));
      const score = matchedTerms.length;
      return {
        id: row.id,
        text: row.text,
        matchedTerms,
        score,
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, topK);
}

export function semanticSearch(
  queryEmbedding: number[],
  topK = DEFAULT_TOP_K
): SemanticResult[] {
  return SEMANTIC_SEARCH_DATASET
    .map((row) => ({
      id: row.id,
      text: row.text,
      score: cosineSimilarity(queryEmbedding, row.embedding),
    }))
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, topK);
}

export function similarityTier(score: number): {
  label: string;
  colorClass: string;
} {
  if (score >= 0.95) {
    return { label: "Very Similar", colorClass: "bg-[#1f4f3a] text-[#b8f7d0]" };
  }
  if (score >= 0.8) {
    return { label: "Strong Match", colorClass: "bg-[#204a5a] text-[#bde8ff]" };
  }
  if (score >= 0.6) {
    return { label: "Related", colorClass: "bg-[#4c4421] text-[#ffe4a8]" };
  }
  if (score >= 0.4) {
    return { label: "Weak Match", colorClass: "bg-[#5a3726] text-[#ffd0b7]" };
  }
  return { label: "Unrelated", colorClass: "bg-[#4a2733] text-[#ffc1cf]" };
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
