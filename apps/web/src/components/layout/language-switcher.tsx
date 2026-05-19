"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

// Fixed-position portal menu so RTL / narrow viewports do not clip the dropdown.
const MENU_WIDTH_PX = 220;
const MENU_OFFSET_PX = 8;
const VIEWPORT_GUTTER_PX = 12;

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

function computeMenuPosition(trigger: HTMLElement): MenuPosition {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(
    MENU_WIDTH_PX,
    window.innerWidth - VIEWPORT_GUTTER_PX * 2
  );

  // Prefer opening to the right of the trigger's left edge; flip if it overflows.
  let left = rect.left;
  if (left + width > window.innerWidth - VIEWPORT_GUTTER_PX) {
    left = rect.right - width;
  }

  left = Math.max(
    VIEWPORT_GUTTER_PX,
    Math.min(left, window.innerWidth - width - VIEWPORT_GUTTER_PX)
  );

  return {
    top: rect.bottom + MENU_OFFSET_PX,
    left,
    width,
  };
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentLocale = getPathLocale(pathname);
  const currentConfig = getLocaleConfig(currentLocale);
  const dictionary = getDictionary(currentLocale);
  const basePath = stripLocaleFromPath(pathname);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      if (rootRef.current) {
        setMenuPosition(computeMenuPosition(rootRef.current));
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [open]);

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
        const menu = document.getElementById("language-switcher-list");
        if (menu?.contains(event.target as Node)) {
          return;
        }
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

  const menu =
    open && menuPosition
      ? createPortal(
          <div
            id="language-switcher-list"
            role="listbox"
            aria-label={dictionary.a11y.languageSwitcher}
            className={cn(
              "z-[100] overflow-hidden rounded-xl border border-[var(--color-border)]",
              "bg-[var(--color-background)]/95 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            )}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
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
          </div>,
          document.body
        )
      : null;

  return (
    <>
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
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-[var(--color-muted-2)]"
          />
          <span className="hidden sm:inline">{currentConfig.nativeLabel}</span>
        </button>
      </div>
      {menu}
    </>
  );
}
