"use client";

/**
 * Shared assistant state.
 *
 * Lifts the chat conversation and "drawer open" state above any single mount
 * point so the floating launcher, the home-page panel, and the dedicated
 * `/assistant` page all read and write the same session. This keeps the
 * "premium product capability" feel: opening the drawer on a project page
 * after asking something on the home page preserves the conversation.
 *
 * Boundaries:
 * - This file owns transport (calling `/api/assistant`) and conversation state.
 * - UI components consume state via `useAssistant()` and never call the API
 *   directly.
 * - No persistence yet — state is per browser tab and lives in memory. Future
 *   work can layer `sessionStorage` here without touching consumers.
 */

import * as React from "react";

import type {
  AssistantMessage,
  AssistantSource,
} from "@/features/assistant/types";

type AssistantApiResponse = {
  message: string;
  sources: Array<{
    id: string;
    title: string;
    type: string;
    excerpt?: string | null;
    score?: number | null;
  }>;
  implemented: boolean;
};

type AssistantContextValue = {
  messages: AssistantMessage[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  /** Submit a question. Opens the drawer if it is closed. */
  ask: (query: string, options?: { openDrawer?: boolean }) => Promise<void>;
  reset: () => void;
};

const AssistantContext = React.createContext<AssistantContextValue | null>(null);

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const openDrawer = React.useCallback(() => setIsOpen(true), []);
  const closeDrawer = React.useCallback(() => setIsOpen(false), []);
  const toggleDrawer = React.useCallback(() => setIsOpen((v) => !v), []);

  const ask = React.useCallback(
    async (rawQuery: string, options?: { openDrawer?: boolean }) => {
      const query = rawQuery.trim();
      if (!query || isLoading) return;

      if (options?.openDrawer) {
        setIsOpen(true);
      }

      const userMessage: AssistantMessage = {
        id: generateId(),
        role: "user",
        content: query,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          const detail = await response.text();
          throw new Error(
            detail || `Assistant request failed with HTTP ${response.status}.`
          );
        }

        const data = (await response.json()) as AssistantApiResponse;
        const sources: AssistantSource[] = (data.sources ?? []).map(
          (source) => ({
            title: source.title,
            excerpt: source.excerpt ?? undefined,
          })
        );

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.message,
            createdAt: new Date(),
            sources,
          },
        ]);
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unknown error talking to the assistant.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const reset = React.useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Global keyboard shortcut: ⌘K / Ctrl+K opens the drawer. Bypasses when an
  // input or contenteditable surface is focused so it never steals the user's
  // typing context.
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.key === "k" || event.key === "K")) return;
      if (!(event.metaKey || event.ctrlKey)) return;

      const target = event.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isEditable) return;

      event.preventDefault();
      setIsOpen((v) => !v);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = React.useMemo<AssistantContextValue>(
    () => ({
      messages,
      isLoading,
      error,
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      ask,
      reset,
    }),
    [messages, isLoading, error, isOpen, openDrawer, closeDrawer, toggleDrawer, ask, reset]
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  const ctx = React.useContext(AssistantContext);
  if (!ctx) {
    throw new Error("useAssistant must be used inside <AssistantProvider>.");
  }
  return ctx;
}
