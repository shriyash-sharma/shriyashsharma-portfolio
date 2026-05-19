"use client";

/**
 * Floating assistant drawer.
 *
 * Radix Dialog with a right-side sheet on desktop and a bottom sheet on
 * mobile. Owns the chrome (title, dismiss) and embeds the shared
 * `AssistantPanel` so the conversation, suggested prompts, and citation list
 * all match the dedicated `/assistant` page.
 *
 * A11y:
 * - Radix manages focus trap, ESC dismissal, and `aria-modal` semantics.
 * - The motion respects `prefers-reduced-motion` by collapsing to fades.
 */

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { AssistantPanel } from "@/features/assistant/components/assistant-panel";
import { useAssistant } from "@/features/assistant/context";
import { cn } from "@/lib/utils/cn";

const DRAWER_PROMPTS = [
  "Explain the RAG architecture.",
  "What backend systems are in this portfolio?",
  "How does the CMS architecture work?",
  "What AI technologies power this platform?",
] as const;

export function AssistantDrawer() {
  const { isOpen, closeDrawer, openDrawer } = useAssistant();
  const reduced = useReducedMotion();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(next) => (next ? openDrawer() : closeDrawer())}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content asChild>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "fixed z-[61] flex flex-col gap-3 bg-[var(--color-background)]",
              "border-[var(--color-border)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)]",
              // Mobile: bottom sheet — bounded so internal scroller activates
              "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t p-4",
              // Desktop: right rail — full viewport height, scrolls inside
              "sm:inset-y-0 sm:right-0 sm:bottom-auto sm:h-dvh sm:max-h-dvh sm:w-[420px] sm:rounded-none sm:rounded-l-2xl sm:border-l sm:border-t-0 sm:p-5",
              "focus:outline-none"
            )}
          >
            <header className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Dialog.Title className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
                  <Sparkles
                    size={14}
                    className="text-[var(--color-muted)]"
                    aria-hidden="true"
                  />
                  Portfolio AI guide
                </Dialog.Title>
                <Dialog.Description className="text-[12px] leading-[1.55] text-[var(--color-muted)]">
                  Grounded answers about projects, architecture, and
                  engineering decisions in this portfolio.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close assistant"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md",
                  "text-[var(--color-muted)] transition-colors duration-[140ms]",
                  "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                )}
              >
                <X size={14} aria-hidden="true" />
              </Dialog.Close>
            </header>

            {/* min-h-0 lets this flex child shrink so the panel's inner scroller activates. */}
            <div className="min-h-0 flex-1">
              <AssistantPanel
                density="compact"
                hideHeader
                suggestedPrompts={DRAWER_PROMPTS}
                className="h-full"
              />
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
