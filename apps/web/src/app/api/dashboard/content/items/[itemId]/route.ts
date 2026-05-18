import { proxyBackendRequest } from "@/lib/api/route-utils";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return proxyBackendRequest(`/admin/content/items/${itemId}`);
}

export async function PUT(request: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return proxyBackendRequest(`/admin/content/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return proxyBackendRequest(`/admin/content/items/${itemId}`, {
    method: "DELETE",
  });
}