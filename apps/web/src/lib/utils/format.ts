/**
 * Small, pure formatting helpers.
 * Keep this file minimal – only add functions that are genuinely reused.
 */

/** Format a date string into a human-readable form, e.g. "May 2026" */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  );
}

/** Clamp a string to a max character length and add ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/** Convert a slug to a readable title */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
