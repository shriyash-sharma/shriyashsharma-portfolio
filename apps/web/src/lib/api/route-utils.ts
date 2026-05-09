/**
 * Shared helpers for Next.js route handlers that proxy dashboard requests.
 *
 * These utilities implement the frontend BFF layer used by authenticated UI
 * workflows. The browser talks to same-origin `/api/...` routes, while these
 * helpers forward requests to the FastAPI backend with the dashboard token
 * attached.
 *
 * This keeps backend URLs and token forwarding out of client components and
 * preserves a single place to evolve request policy later.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { dashboardAuthCookieName } from "@/lib/auth/constants";

export function createBackendUrl(path: string): string {
  const baseUrl =
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";

  return new URL(path, baseUrl).toString();
}

export async function getDashboardToken() {
  const cookieStore = await cookies();
  return cookieStore.get(dashboardAuthCookieName)?.value ?? null;
}

export async function requireDashboardToken() {
  const token = await getDashboardToken();

  if (!token) {
    return {
      token: null,
      response: NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 }
      ),
    } as const;
  }

  return { token, response: undefined } as const;
}

export async function proxyBackendRequest(
  path: string,
  init: RequestInit = {}
) {
  const { token, response } = await requireDashboardToken();

  if (!token) {
    return response;
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const backendResponse = await fetch(createBackendUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const contentType = backendResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return NextResponse.json(await backendResponse.json(), {
      status: backendResponse.status,
    });
  }

  return new NextResponse(await backendResponse.text(), {
    status: backendResponse.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
}