"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants/nav";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPathLocale, localizePath } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

/**
 * Footer internal navigation — locale-aware crawlable links to the primary
 * sections (Projects, Case Studies, AI Lab, Blog, About, Contact). Strengthens
 * site-wide internal linking for SEO.
 */
export function FooterNav() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const nav = getDictionary(locale).nav;

  return (
    <nav
      aria-label="Footer"
      className="flex flex-wrap items-center gap-x-5 gap-y-2"
    >
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={localizePath(item.href, locale)}
          className={cn(
            "inline-flex min-h-9 items-center text-[12px] text-[var(--color-muted)]",
            "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
          )}
        >
          {nav[item.key]}
        </Link>
      ))}
    </nav>
  );
}
