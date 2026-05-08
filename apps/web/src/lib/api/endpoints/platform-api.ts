import { httpClient } from "@/lib/api/http-client";
import type {
  ApiEnvelope,
  PlatformCapability,
  PlatformHealth,
} from "@/lib/api/contracts/platform";

export async function getPlatformHealth() {
  return httpClient.get<ApiEnvelope<PlatformHealth>>("/health", {
    next: { revalidate: 60 },
  });
}

export async function getPlatformCapabilities() {
  return httpClient.get<ApiEnvelope<PlatformCapability[]>>("/capabilities", {
    next: { revalidate: 300 },
  });
}
