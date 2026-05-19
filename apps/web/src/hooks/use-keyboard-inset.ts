"use client";

import { useEffect, useState } from "react";

type KeyboardViewport = {
  /** Pixels the virtual keyboard (or browser chrome) shrinks the visible area from the bottom. */
  keyboardInset: number;
  /** Height of the visible layout viewport (`visualViewport.height`). */
  visualHeight: number;
  /** Top offset of the visible viewport (`visualViewport.offsetTop`). */
  offsetTop: number;
};

const DEFAULT_VIEWPORT: KeyboardViewport = {
  keyboardInset: 0,
  visualHeight: 0,
  offsetTop: 0,
};

/**
 * Tracks `visualViewport` so fixed bottom sheets can stay above the mobile keyboard.
 */
export function useKeyboardInset(enabled = true): KeyboardViewport {
  const [viewport, setViewport] = useState<KeyboardViewport>(DEFAULT_VIEWPORT);

  useEffect(() => {
    if (!enabled) return;

    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const update = () => {
      const { height, offsetTop } = visualViewport;
      const keyboardInset = Math.max(
        0,
        window.innerHeight - height - offsetTop
      );

      setViewport({
        keyboardInset,
        visualHeight: height,
        offsetTop,
      });
    };

    update();
    visualViewport.addEventListener("resize", update);
    visualViewport.addEventListener("scroll", update);
    window.addEventListener("orientationchange", update);

    return () => {
      visualViewport.removeEventListener("resize", update);
      visualViewport.removeEventListener("scroll", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [enabled]);

  return viewport;
}
