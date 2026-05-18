export { seoConfig } from "@/lib/seo/config";
export {
  buildMetadata,
  pageMetadata,
  pageSeo,
  type MetadataOverrides,
  type PageSeoKey,
} from "@/lib/seo/metadata";
export { buildContentMetadata } from "@/lib/seo/content-metadata";
export { absoluteUrl, resolveSiteOrigin, resolveMetadataBase } from "@/lib/seo/urls";
export {
  homePageJsonLdGraph,
  personJsonLd,
  blogPostingJsonLd,
  techArticleJsonLd,
  creativeWorkJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo/json-ld";
export { buildSitemapEntries } from "@/lib/seo/sitemap-data";
