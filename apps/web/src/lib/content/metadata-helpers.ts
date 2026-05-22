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
