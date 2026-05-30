import type { ApiContentItem } from "@/lib/api/contracts/content";

type Metadata = ApiContentItem["metadata"];

/** Read a string from CMS metadata (snake_case or camelCase keys). */
export function metadataString(
  metadata: Metadata,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

export function metadataBoolean(metadata: Metadata, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = metadata[key];
    if (value === true || value === "true" || value === 1) {
      return true;
    }
  }
  return false;
}

export const ASSISTANT_QUESTIONS_METADATA_KEY = "assistant_questions";

/** Parse assistant prompt suggestions (one per line, or JSON string array). */
export function metadataAssistantQuestions(metadata: Metadata): string[] {
  const raw = metadataString(
    metadata,
    ASSISTANT_QUESTIONS_METADATA_KEY,
    "assistantQuestions"
  );
  if (!raw) {
    return [];
  }

  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      // fall through to newline split
    }
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Split stack metadata (comma-separated string or JSON array string). */
export function metadataStack(metadata: Metadata): string[] {
  const raw = metadataString(metadata, "stack");
  if (!raw) {
    return [];
  }
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      // fall through to comma split
    }
  }
  return raw.split(",").map((part) => part.trim()).filter(Boolean);
}
