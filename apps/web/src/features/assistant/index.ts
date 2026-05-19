// Public surface of the assistant feature.
export { AssistantPanel } from "./components/assistant-panel";
export { AssistantLauncher } from "./components/assistant-launcher";
export { AssistantDrawer } from "./components/assistant-drawer";
export { AssistantPromptChip } from "./components/assistant-prompt-chip";
export { ContextualAssistantCta } from "./components/contextual-assistant-cta";
export { AssistantProvider, useAssistant } from "./context";
export type {
  AssistantMessage,
  AssistantSession,
  AssistantSource,
  AssistantQueryPayload,
  AssistantStreamChunk,
} from "./types";
