"use client";

/**
 * Code-split wrapper for `AssistantDrawer`.
 *
 * The drawer (Radix Dialog + chat panel) is not needed for first paint, so it
 * is fetched client-side only: preloaded once the browser is idle, and mounted
 * the first time the assistant is opened (via the launcher, a prompt chip, or
 * the keyboard shortcut). It then stays mounted so open/close animations keep
 * working.
 */

import * as React from "react";
import dynamic from "next/dynamic";

import { useAssistant } from "@/features/assistant/context";
import { useIdle } from "@/hooks/use-idle";

const loadAssistantDrawer = () =>
  import("@/features/assistant/components/assistant-drawer").then(
    (mod) => mod.AssistantDrawer
  );

const AssistantDrawer = dynamic(loadAssistantDrawer, { ssr: false });

export function LazyAssistantDrawer() {
  const { isOpen } = useAssistant();
  const [hasOpened, setHasOpened] = React.useState(isOpen);
  const isIdle = useIdle();

  // Warm the chunk so the first open is instant; mounting still waits for it.
  React.useEffect(() => {
    if (isIdle) {
      void loadAssistantDrawer();
    }
  }, [isIdle]);

  if (isOpen && !hasOpened) {
    setHasOpened(true);
  }

  return hasOpened ? <AssistantDrawer /> : null;
}
