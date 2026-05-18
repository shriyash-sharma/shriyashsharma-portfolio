export type AiCapabilityStatus = "planned" | "designed" | "blocked";

export type AiCapability = {
  id: string;
  label: string;
  status: AiCapabilityStatus;
  boundary: "frontend" | "bff" | "fastapi" | "data";
  description: string;
};

export const aiCapabilities: AiCapability[] = [
  {
    id: "semantic-search",
    label: "Semantic search",
    status: "designed",
    boundary: "fastapi",
    description:
      "Hybrid retrieval endpoint over indexed project, case study, and writing content.",
  },
  {
    id: "assistant-streaming",
    label: "Assistant streaming",
    status: "planned",
    boundary: "bff",
    description:
      "Next.js route handler forwards authenticated SSE responses from FastAPI.",
  },
  {
    id: "content-ingestion",
    label: "Content ingestion",
    status: "designed",
    boundary: "data",
    description:
      "Normalize multilingual content into chunks that can later be embedded and evaluated.",
  },
  {
    id: "ai-observability",
    label: "AI observability",
    status: "planned",
    boundary: "fastapi",
    description:
      "Track retrieval quality, latency, source coverage, and assistant failure modes.",
  },
];
