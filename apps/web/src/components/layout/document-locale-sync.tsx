"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getLocaleConfig,
  getPathLocale,
  localeLanguageTags,
} from "@/lib/i18n/config";

/**
 * Keeps document language and direction aligned with locale-prefixed routes
 * without making the root layout dynamic.
 */
export function DocumentLocaleSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getPathLocale(pathname);
    const config = getLocaleConfig(locale);
    const root = document.documentElement;

    root.lang = localeLanguageTags[locale];
    root.dir = config.direction;
    root.dataset.locale = locale;
  }, [pathname]);

  return null;
}
