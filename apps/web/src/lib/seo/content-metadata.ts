import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

type ContentMetadataInput = {
  title: string;
  description: string;
  path: string;
  openGraphType?: "website" | "article";
};

export function buildContentMetadata(input: ContentMetadataInput): Metadata {
  return buildMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    openGraphType: input.openGraphType ?? "article",
  });
}
