/**
 * Same-origin proxy for the AI Lab RAG Explorer.
 *
 * Mirrors the assistant proxy: the browser POSTs here to stay same-origin and
 * avoid exposing the backend URL. This route forwards to FastAPI's
 * `/ai-lab/rag-explorer` endpoint and returns the JSON response verbatim.
 */

import { createBackendUrl } from "@/lib/api/backend-url";
import {
  checkAssistantRateLimit,
  getRequestClientIp,
} from "@/lib/api/rate-limit";
import type { RagExplorerRequest } from "@/lib/api/contracts/ai-lab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Local embedding + LLM generation can take longer than a chat turn.
const REQUEST_TIMEOUT_MS = 60_000;

export async function POST(request: Request) {
  let payload: RagExplorerRequest;
  try {
    payload = (await request.json()) as RagExplorerRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const content = payload?.content?.trim() ?? "";
  const question = payload?.question?.trim() ?? "";

  if (content.length < 20) {
    return Response.json(
      { error: "`content` must be at least 20 characters." },
      { status: 400 }
    );
  }
  if (question.length < 3) {
    return Response.json(
      { error: "`question` must be at least 3 characters." },
      { status: 400 }
    );
  }

  const clientIp = getRequestClientIp(request);
  const rateLimit = checkAssistantRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(createBackendUrl("/ai-lab/rag-explorer"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": clientIp,
      },
      body: JSON.stringify({
        content,
        question,
        top_k: payload.top_k ?? null,
        chunk_size: payload.chunk_size ?? null,
        chunk_overlap: payload.chunk_overlap ?? null,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "RAG Explorer request timed out."
        : "RAG Explorer backend is unreachable.";
    return Response.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
