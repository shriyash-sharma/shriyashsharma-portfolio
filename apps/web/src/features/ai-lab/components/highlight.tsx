import * as React from "react";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "your",
  "with",
  "what",
  "why",
  "how",
  "does",
  "did",
  "this",
  "that",
  "from",
  "have",
  "has",
  "was",
  "were",
  "can",
  "will",
  "into",
  "about",
  "explain",
  "simple",
  "words",
  "work",
  "works",
]);

/** Meaningful terms from the question, used to highlight matches in chunks. */
export function questionTerms(question: string): string[] {
  const terms = new Set<string>();
  for (const raw of question.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
    if (raw.length >= 4 && !STOPWORDS.has(raw)) {
      terms.add(raw);
    }
  }
  return Array.from(terms);
}

/**
 * Highlight any question terms found in `text` with a <mark>. Case-insensitive,
 * matches word stems (so "embedding" highlights "embeddings").
 */
export function highlightTerms(
  text: string,
  terms: string[]
): React.ReactNode {
  if (!terms.length) return text;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;
    if (pattern.test(part)) {
      pattern.lastIndex = 0;
      return (
        <mark
          key={index}
          className="rounded bg-[var(--color-foreground)]/15 px-0.5 text-[var(--color-foreground)]"
        >
          {part}
        </mark>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
