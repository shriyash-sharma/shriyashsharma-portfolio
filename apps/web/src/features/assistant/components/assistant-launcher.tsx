"use client";

/**
 * Floating assistant launcher.
 *
 * Always-mounted entry point to the assistant. Lives in the bottom-right
 * corner on every public surface (suppressed on the dashboard and on the
 * dedicated `/assistant` page where the panel is already first-class).
 *
 * UX intent:
 * - Subtle. Dark surface, single thin border, no glow, no badge animation.
 * - Premium. Reuses platform motion tokens; reduces motion when requested.
 * - Discoverable. Keyboard shortcut hint surfaces on hover only.
 *
 * The component is intentionally headless about *what* opens — it just flips
 * the shared `isOpen` flag. `AssistantDrawer` listens for that flag.
 */

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useAssistant } from "@/features/assistant/context";
import { cn } from "@/lib/utils/cn";

export function AssistantLauncher({ className }: { className?: string }) {
  const { isOpen, openDrawer } = useAssistant();
  const reduced = useReducedMotion();

  // Detect platform so the shortcut chip uses the right glyph.
  const [shortcutLabel, setShortcutLabel] = React.useState("Ctrl K");
  React.useEffect(() => {
    const isMac =
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    setShortcutLabel(isMac ? "⌘ K" : "Ctrl K");
  }, []);

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          key="assistant-launcher"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          data-assistant-launcher
          className={cn(
            "fixed z-40",
            "bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-5",
            "sm:bottom-6 sm:right-6",
            "pointer-events-none transition-opacity duration-200",
            className
          )}
        >
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Open AI assistant"
            aria-haspopup="dialog"
            className={cn(
              "group pointer-events-auto",
              "inline-flex h-11 items-center gap-2 rounded-full pl-3 pr-3.5",
              "border border-[var(--color-border)] bg-[var(--color-surface-2)]/90 backdrop-blur",
              "text-[12.5px] font-medium text-[var(--color-secondary)]",
              "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]",
              "transition-[border-color,background-color,color,box-shadow] duration-[180ms] ease-out",
              "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            )}
          >
            <Sparkles
              size={14}
              className="text-[var(--color-muted)] transition-colors duration-[180ms] group-hover:text-[var(--color-foreground)]"
              aria-hidden="true"
            />
            <span>Ask AI</span>
            <span
              aria-hidden="true"
              className={cn(
                "ml-1 hidden h-5 items-center rounded border border-[var(--color-border)] px-1.5 text-[10.5px] tracking-wide text-[var(--color-muted)]",
                "sm:inline-flex"
              )}
            >
              {shortcutLabel}
            </span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
