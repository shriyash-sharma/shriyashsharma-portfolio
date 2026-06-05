"use client";

import { usePathname } from "next/navigation";
import { getPathLocale, localizePath } from "@/lib/i18n/config";
import { aiLabTools } from "@/lib/ai-lab/tools";
import { ToolCard } from "./tool-card";

/** Renders every tool from the config-driven registry as a card grid. */
export function ToolGrid() {
  const locale = getPathLocale(usePathname());

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {aiLabTools.map((tool) => (
        <ToolCard
          key={tool.slug}
          tool={tool}
          href={tool.href ? localizePath(tool.href, locale) : "#"}
        />
      ))}
    </div>
  );
}
