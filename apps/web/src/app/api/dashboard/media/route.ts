/**
 * Dashboard media BFF routes.
 *
 * Uploads and listing requests pass through this same-origin Next.js layer so
 * the browser never needs direct awareness of backend hostnames or token
 * forwarding rules.
 */

import { proxyBackendRequest } from "@/lib/api/route-utils";

export async function GET() {
  return proxyBackendRequest("/admin/media");
}

export async function POST(request: Request) {
  return proxyBackendRequest("/admin/media", {
    method: "POST",
    body: await request.formData(),
  });
}