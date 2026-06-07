const DEFAULT_AI_LAB_MAX_CONTENT_CHARS = 9000;

export function getAiLabMaxContentChars(): number {
  const parsed = Number.parseInt(
    process.env.AI_LAB_MAX_CONTENT_CHARS ?? String(DEFAULT_AI_LAB_MAX_CONTENT_CHARS),
    10
  );

  if (!Number.isFinite(parsed)) {
    return DEFAULT_AI_LAB_MAX_CONTENT_CHARS;
  }

  return Math.max(20, parsed);
}
