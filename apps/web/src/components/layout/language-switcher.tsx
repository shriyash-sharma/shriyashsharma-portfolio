"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getLocaleConfig,
  getPathLocale,
  locales,
  localizePath,
  stripLocaleFromPath,
} from "@/lib/i18n/config";
import { localeCookieName } from "@/lib/i18n/routing";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentLocale = getPathLocale(pathname);
  const currentConfig = getLocaleConfig(currentLocale);
  const dictionary = getDictionary(currentLocale);
  const basePath = stripLocaleFromPath(pathname);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!pendingLocale) {
      return;
    }

    document.cookie = `${localeCookieName}=${pendingLocale}; path=/; max-age=31536000; samesite=lax`;
  }, [pendingLocale]);

  return (
    <div ref={rootRef} className="relative" data-direction-neutral="true">
      <button
        type="button"
        aria-label={`${dictionary.a11y.changeLanguage}. ${dictionary.a11y.currentLanguage}: ${currentConfig.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="language-switcher-list"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-border)]",
          "bg-[var(--color-surface)] px-3 text-[11px] font-medium tracking-[0.08em]",
          "text-[var(--color-muted)] transition-[border-color,background-color,color] duration-[140ms]",
          "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]"
        )}
      >
        <span className="font-mono">{currentConfig.shortLabel}</span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-muted-2)]" />
        <span className="hidden sm:inline">{currentConfig.nativeLabel}</span>
      </button>

      {open && (
        <div
          id="language-switcher-list"
          role="listbox"
          aria-label={dictionary.a11y.languageSwitcher}
          className={cn(
            "absolute right-0 top-11 z-50 w-[220px] overflow-hidden rounded-xl",
            "border border-[var(--color-border)] bg-[var(--color-background)]/95",
            "p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl"
          )}
        >
          {locales.map((locale) => {
            const config = getLocaleConfig(locale);
            const selected = locale === currentLocale;

            return (
              <Link
                key={locale}
                href={localizePath(basePath, locale)}
                hrefLang={config.languageTag}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setPendingLocale(locale);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-10 items-center justify-between gap-3 rounded-lg px-3",
                  "text-[12px] transition-colors duration-[140ms]",
                  selected
                    ? "bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]"
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{config.nativeLabel}</span>
                  <span className="truncate text-[10px] text-[var(--color-muted-2)]">
                    {config.label} · {config.region}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-[var(--color-muted-2)]">
                  {config.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
