import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

type ContentMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
};

export function buildContentMetadata(input: ContentMetadataInput): Metadata {
  return buildMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    image: input.image,
    canonicalUrl: input.canonicalUrl,
    noIndex: input.noIndex,
    openGraphType: input.openGraphType ?? "article",
  });
}
