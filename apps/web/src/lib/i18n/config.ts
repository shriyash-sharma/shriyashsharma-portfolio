export const defaultLocale = "en";

export const locales = ["en", "hi"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "Hindi",
};

export const localeLanguageTags: Record<Locale, string> = {
  en: "en",
  hi: "hi-IN",
};

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
