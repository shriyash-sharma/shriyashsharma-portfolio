import { proxyBackendRequest } from "@/lib/api/route-utils";

type RouteContext = {
  params: Promise<{ type: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { type } = await context.params;
  const url = new URL(request.url);
  const search = url.search || "";
  return proxyBackendRequest(`/admin/content/${type}/overview${search}`);
}