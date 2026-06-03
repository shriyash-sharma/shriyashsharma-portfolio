/** True while `next build` is pre-rendering pages (including on Vercel). */
export function isProductionBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Resolve dynamic route params for CMS-backed slug pages.
 *
 * During production builds the Render API is often cold or slow; pre-rendering
 * every slug can fail the deploy on the default 10s fetch timeout. Returning
 * an empty list skips build-time pre-render while `dynamicParams` + ISR still
 * generate pages on first request after deploy.
 */
export async function contentStaticParams<T>(
  loader: () => Promise<T[]>,
  toSlug: (item: T) => string
): Promise<Array<{ slug: string }>> {
  if (isProductionBuildPhase()) {
    return [];
  }

  try {
    const items = await loader();
    return items.map((item) => ({ slug: toSlug(item) }));
  } catch {
    return [];
  }
}
