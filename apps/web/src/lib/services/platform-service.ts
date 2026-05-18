import { aiCapabilities } from "@/lib/ai/capabilities";
import { contentCollections } from "@/lib/content/registry";

export async function getPlatformReadiness() {
  return {
    contentCollections,
    aiCapabilities,
    backend: {
      fastApiBaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_API_URL),
      streamingPrepared: true,
      authPrepared: true,
    },
  };
}
