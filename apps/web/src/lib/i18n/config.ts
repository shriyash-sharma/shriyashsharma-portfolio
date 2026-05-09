/**
 * Locale configuration and path helpers.
 *
 * The platform keeps one shared route tree and layers locale behavior around
 * it through path prefixes, cookies, and request rewriting. These helpers are
 * the source of truth for supported locales and how localized URLs map back to
 * canonical application paths.
 */

export const defaultLocale = "en";

export const locales = ["en", "es", "ar", "hi", "pt", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export type TextDirection = "ltr" | "rtl";

export type LocaleConfig = {
  code: Locale;
  languageTag: string;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  region: string;
  direction: TextDirection;
};

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    languageTag: "en-US",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    region: "United States",
    direction: "ltr",
  },
  es: {
    code: "es",
    languageTag: "es-ES",
    label: "Spanish",
    nativeLabel: "Español",
    shortLabel: "ES",
    region: "Spain",
    direction: "ltr",
  },
  ar: {
    code: "ar",
    languageTag: "ar-SA",
    label: "Arabic",
    nativeLabel: "العربية",
    shortLabel: "AR",
    region: "Saudi Arabia",
    direction: "rtl",
  },
  hi: {
    code: "hi",
    languageTag: "hi-IN",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    shortLabel: "HI",
    region: "India",
    direction: "ltr",
  },
  pt: {
    code: "pt",
    languageTag: "pt-BR",
    label: "Portuguese",
    nativeLabel: "Português",
    shortLabel: "PT",
    region: "Brazil",
    direction: "ltr",
  },
  de: {
    code: "de",
    languageTag: "de-DE",
    label: "German",
    nativeLabel: "Deutsch",
    shortLabel: "DE",
    region: "Germany",
    direction: "ltr",
  },
  fr: {
    code: "fr",
    languageTag: "fr-FR",
    label: "French",
    nativeLabel: "Français",
    shortLabel: "FR",
    region: "France",
    direction: "ltr",
  },
};

export const localeLanguageTags: Record<Locale, string> = {
  en: localeConfigs.en.languageTag,
  es: localeConfigs.es.languageTag,
  ar: localeConfigs.ar.languageTag,
  hi: localeConfigs.hi.languageTag,
  pt: localeConfigs.pt.languageTag,
  de: localeConfigs.de.languageTag,
  fr: localeConfigs.fr.languageTag,
};

export const localeLabels: Record<Locale, string> = {
  en: localeConfigs.en.label,
  es: localeConfigs.es.label,
  ar: localeConfigs.ar.label,
  hi: localeConfigs.hi.label,
  pt: localeConfigs.pt.label,
  de: localeConfigs.de.label,
  fr: localeConfigs.fr.label,
};

export const localeLanguageAlternates = Object.fromEntries(
  locales.map((locale) => [localeLanguageTags[locale], locale])
) as Record<string, Locale>;

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale];
}

export function getLocaleDirection(locale: Locale): TextDirection {
  return localeConfigs[locale].direction;
}

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getPathLocale(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : defaultLocale;
}

export function stripLocaleFromPath(pathname: string): string {
  const locale = pathname.split("/")[1];

  if (!isLocale(locale)) {
    return pathname;
  }

  const stripped = pathname.replace(`/${locale}`, "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function localizePath(pathname: string, locale: Locale): string {
  const basePath = stripLocaleFromPath(pathname);

  if (locale === defaultLocale) {
    return basePath;
  }

  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

export function getLocalizedPathname(pathname: string, locale: Locale): string {
  return localizePath(pathname, locale);
}
