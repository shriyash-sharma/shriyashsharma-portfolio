export type ContextModel = {
  id: string;
  name: string;
  contextWindow: number;
  bestFor: string;
};

export const CONTEXT_WINDOW_MODELS: ContextModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    contextWindow: 128_000,
    bestFor: "General multimodal production assistants",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    contextWindow: 200_000,
    bestFor: "Long-form reasoning and document-heavy workflows",
  },
  {
    id: "gemini-2-5",
    name: "Gemini 2.5",
    contextWindow: 1_000_000,
    bestFor: "Very large context and long corpus analysis",
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    contextWindow: 128_000,
    bestFor: "Open-model deployments and controllable infra",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    contextWindow: 128_000,
    bestFor: "Low-latency enterprise generation workloads",
  },
];

export const CONTEXT_WINDOW_FAQ = [
  {
    question: "What is a context window?",
    answer:
      "A context window is the maximum number of tokens an LLM can consider in one request. It includes system prompts, user input, retrieved context, chat history, and tool output. Anything beyond this limit is not visible to the model.",
  },
  {
    question: "What happens when a context window is exceeded?",
    answer:
      "When the prompt exceeds the model limit, content is truncated. Usually the oldest or tail content is dropped depending on the orchestration strategy. The model then answers using only the visible portion, which can reduce accuracy.",
  },
  {
    question: "How are tokens calculated?",
    answer:
      "Tokens are subword units, not words or characters. Different tokenizers split text differently. A common rough estimate in English is around 1 token per 4 characters, but exact counts depend on model-specific tokenization.",
  },
  {
    question: "Why does RAG help with large documents?",
    answer:
      "RAG avoids sending an entire large document to the model. It chunks and indexes source content, retrieves only the most relevant passages for a query, and sends those smaller excerpts. This preserves context budget while improving grounding.",
  },
  {
    question: "Can context windows replace RAG?",
    answer:
      "Larger context windows reduce truncation risk but do not replace retrieval architecture. Very large prompts are expensive, slower, and still include irrelevant text. RAG keeps prompts focused, cheaper, and better grounded in specific evidence.",
  },
] as const;

export const CONTEXT_WINDOW_SAMPLE_TEXT = `Modern AI assistants are constrained by a finite context window. This is the total number of tokens a model can see in a single request, including system instructions, user input, retrieved context, memory, and output budget. Teams often assume a larger window means they can skip retrieval design, but the economics and reliability story is more nuanced.

In production, long prompts can become expensive quickly. If a workflow repeatedly sends large documents, token spend grows linearly with each turn. Latency also increases because the model must process more input before generation starts. As prompts grow, irrelevant context can distract generation, reducing answer quality even when truncation does not occur.

This is where retrieval-augmented generation helps. Instead of stuffing whole documents into the prompt, the system chunks source content, embeds chunks into vector space, retrieves only the most relevant passages, and builds a focused prompt around them. The context window is used for high-signal evidence rather than low-value noise.

Context budgeting is therefore a systems design problem, not just a model selection problem. Engineers need to reserve room for: system rules, tool instructions, conversation memory, retrieved chunks, and expected answer length. If any component dominates the budget, the model may lose essential details.

A robust architecture measures token usage continuously, visualizes utilization by model, simulates truncation scenarios, and enforces safety limits before requests are sent. This makes behavior predictable, costs easier to manage, and responses more reliable under real workloads.`;
