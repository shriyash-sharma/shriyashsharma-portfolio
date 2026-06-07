import {
  checkAssistantRateLimit,
  getRequestClientIp,
} from "@/lib/api/rate-limit";
import {
  deterministicEmbedding,
  SEMANTIC_SEARCH_QUERY_MAX_CHARS,
} from "@/lib/ai-lab/semantic-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENAI_EMBEDDING_URL = "https://api.openai.com/v1/embeddings";
const OPENAI_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

type QueryPayload = {
  query?: string;
};

export async function POST(request: Request) {
  let payload: QueryPayload;
  try {
    payload = (await request.json()) as QueryPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = payload.query?.trim() ?? "";
  if (query.length < 2) {
    return Response.json(
      { error: "`query` must be at least 2 characters." },
      { status: 400 }
    );
  }

  if (query.length > SEMANTIC_SEARCH_QUERY_MAX_CHARS) {
    return Response.json(
      {
        error: `\`query\` must be at most ${SEMANTIC_SEARCH_QUERY_MAX_CHARS} characters.`,
      },
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

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return Response.json({
      embedding: deterministicEmbedding(query),
      mode: "deterministic",
      model: "deterministic-hash-v1",
    });
  }

  try {
    const response = await fetch(OPENAI_EMBEDDING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: query,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return Response.json(
        {
          error: "OpenAI embedding request failed.",
          detail,
        },
        { status: 502 }
      );
    }

    const body = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };

    const embedding = body.data?.[0]?.embedding;
    if (!embedding || !Array.isArray(embedding)) {
      return Response.json(
        { error: "Embedding provider returned an invalid payload." },
        { status: 502 }
      );
    }

    return Response.json({
      embedding,
      mode: "openai",
      model: OPENAI_MODEL,
    });
  } catch {
    return Response.json(
      { error: "Embedding provider is unreachable." },
      { status: 502 }
    );
  }
}
