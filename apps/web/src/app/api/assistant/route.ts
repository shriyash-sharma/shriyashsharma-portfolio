/**
 * Same-origin proxy for the portfolio AI assistant.
 *
 * The browser POSTs here so it can stay same-origin (no CORS preflight, no
 * exposure of the API base URL on the client). This route forwards the
 * payload to FastAPI's `/assistant` endpoint and returns the JSON response
 * verbatim.
 *
 * Streaming (`/assistant/stream`) is left for Phase 2 — once token-level
 * streaming is implemented in the LLM provider, this handler can swap to
 * piping the upstream SSE stream through.
 */

import { createBackendUrl } from "@/lib/api/backend-url";
import type { AssistantRequest } from "@/lib/api/contracts/ai";
import {
  checkAssistantRateLimit,
  getRequestClientIp,
} from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 45_000;

export async function POST(request: Request) {
  let payload: AssistantRequest;
  try {
    payload = (await request.json()) as AssistantRequest;
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!payload?.query || payload.query.trim().length < 2) {
    return Response.json(
      { error: "`query` is required (min length 2)." },
      { status: 400 }
    );
  }

  const clientIp = getRequestClientIp(request);
  const rateLimit = checkAssistantRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        error:
          "Too many assistant requests. Please wait before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(createBackendUrl("/assistant"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": clientIp,
      },
      body: JSON.stringify({
        query: payload.query,
        session_id: payload.sessionId ?? null,
        locale: payload.locale ?? null,
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
        ? "Assistant request timed out."
        : "Assistant backend is unreachable.";
    return Response.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}

