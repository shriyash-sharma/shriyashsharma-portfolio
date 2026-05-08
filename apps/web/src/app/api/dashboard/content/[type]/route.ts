import { proxyBackendRequest } from "@/lib/api/route-utils";

type RouteContext = {
  params: Promise<{ type: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { type } = await context.params;
  const url = new URL(request.url);
  const search = url.search || "";
  return proxyBackendRequest(`/admin/content/${type}${search}`);
}

export async function POST(request: Request, context: RouteContext) {
  const { type } = await context.params;
  return proxyBackendRequest(`/admin/content/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}