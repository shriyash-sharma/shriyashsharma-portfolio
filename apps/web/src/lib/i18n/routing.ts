import type { Locale } from "./config";
import { locales, defaultLocale, isLocale } from "./config";

export const localeCookieName = "portfolio-locale";

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const requestedLocales = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const requested of requestedLocales) {
    const exact = locales.find((locale) => requested === locale);

    if (exact) {
      return exact;
    }

    const language = requested.split("-")[0];

    if (isLocale(language)) {
      return language;
    }

    if (language === "pt") {
      return "pt";
    }
  }

  return defaultLocale;
}
