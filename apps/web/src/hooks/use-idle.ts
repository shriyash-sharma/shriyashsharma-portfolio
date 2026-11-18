"use client";

import { useEffect, useState } from "react";

/**
 * True once the browser has been idle after hydration. Used to defer
 * non-critical client code (e.g. the assistant chat) past first paint.
 * Falls back to a timeout where `requestIdleCallback` is missing (Safari).
 */
export function useIdle(timeout = 2000): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const done = () => setIsIdle(true);
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(done, { timeout });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(done, timeout);
    return () => window.clearTimeout(handle);
  }, [timeout]);

  return isIdle;
}
