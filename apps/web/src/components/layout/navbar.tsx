"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { navItems } from "@/lib/constants/nav";
import { siteConfig } from "@/lib/constants/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPathLocale, localizePath, stripLocaleFromPath } from "@/lib/i18n/config";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { transitions, drawerVariants } from "@/styles/motion";

export function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isScrolled = scrollY > 12;
  const locale = getPathLocale(pathname);
  const dictionary = getDictionary(locale);
  const normalizedPathname = stripLocaleFromPath(pathname);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[border-color,background-color,backdrop-filter] duration-300 ease-out",
        isScrolled
          ? [
              "border-b border-[var(--color-border)]",
              "bg-[var(--color-background)]/80",
              "backdrop-blur-xl backdrop-saturate-150",
            ]
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[52px] max-w-5xl items-center justify-between px-6 lg:px-8">

        {/* Wordmark */}
        <Link
          href={localizePath("/", locale)}
          aria-label={`${siteConfig.name} ${dictionary.a11y.home}`}
          className={cn(
            "text-[13px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]",
            "rounded-sm transition-opacity duration-150 hover:opacity-60"
          )}
        >
          {siteConfig.author.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label={dictionary.a11y.primaryNavigation} className="hidden items-center md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? normalizedPathname === "/"
                : normalizedPathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[13px]",
                  "transition-colors duration-[140ms]",
                  isActive
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-secondary)]"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md bg-[var(--color-surface-3)]"
                    transition={transitions.spring}
                  />
                )}
                <span className="relative z-10">{dictionary.nav[item.key]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={
            mobileOpen
              ? dictionary.a11y.closeNavigation
              : dictionary.a11y.openNavigation
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-md md:hidden",
            "text-[var(--color-muted)] transition-colors duration-[140ms]",
            "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 10 }}
              transition={transitions.micro}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            aria-label={dictionary.a11y.mobileNavigation}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "overflow-hidden md:hidden",
              "border-t border-[var(--color-border)]",
              "bg-[var(--color-background)]/95 backdrop-blur-xl"
            )}
          >
            <ul className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? normalizedPathname === "/"
                    : normalizedPathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={localizePath(item.href, locale)}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-3 text-[13px]",
                        "transition-colors duration-[140ms]",
                        isActive
                          ? "bg-[var(--color-surface-3)] text-[var(--color-foreground)]"
                          : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]"
                      )}
                    >
                      {dictionary.nav[item.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
