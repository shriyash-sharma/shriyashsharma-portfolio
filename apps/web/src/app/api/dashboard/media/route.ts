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