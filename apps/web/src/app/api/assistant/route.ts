/**
 * AI assistant streaming endpoint stub.
 * When the FastAPI backend is ready:
 * 1. Parse the request body into AssistantQueryPayload
 * 2. Forward to FastAPI /assistant/query
 * 3. Pipe the SSE stream back to the client
 */

import type { AssistantRequest } from "@/lib/api/contracts/ai";

export const runtime = "edge";

export async function POST(request: Request) {
  // Stub – replace with real implementation
  const body = (await request.json()) as AssistantRequest;
  void body;

  return new Response(
    JSON.stringify({ error: "Assistant not yet implemented" }),
    {
      status: 501,
      headers: { "Content-Type": "application/json" },
    }
  );
}
