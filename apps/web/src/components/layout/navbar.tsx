"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { navItems } from "@/lib/constants/nav";
import { siteConfig } from "@/lib/constants/site";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { transitions } from "@/styles/motion";

export function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isScrolled = scrollY > 8;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 lg:px-8">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className={cn(
            "text-sm font-semibold tracking-tight text-[var(--color-foreground)]",
            "transition-opacity duration-150 hover:opacity-70"
          )}
          aria-label={`${siteConfig.name} – home`}
        >
          {siteConfig.author.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
                  isActive
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-[var(--color-surface-2)]"
                    transition={transitions.spring}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md md:hidden",
            "text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          )}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.base}
            className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)] md:hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
                          : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      )}
                    >
                      {item.label}
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
