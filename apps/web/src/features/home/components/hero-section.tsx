"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { HeroSystemPanel } from "./hero-system-panel";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPathLocale, localizePath } from "@/lib/i18n/config";
import { slideInRight } from "@/styles/motion";
import { cn } from "@/lib/utils/cn";

/**
 * Hero section — server component.
 * Desktop: 2-column grid (text + system panel).
 * Mobile: single column, panel hidden, tight vertical rhythm.
 */
export function HeroSection() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const dictionary = getDictionary(locale);
  const home = dictionary.home;
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative",
        // Full-width section — padding matches navbar and project grid
        "px-5 sm:px-6 lg:px-10 xl:px-16",
        // Mobile: full-height feel, content sits in the upper-middle third
        "flex min-h-[86dvh] flex-col justify-center",
        "pt-12 pb-10",
        // Tablet+
        "sm:min-h-[80dvh] sm:pt-16 sm:pb-14",
        // Desktop+
        "lg:min-h-[88dvh] lg:pt-20 lg:pb-16"
      )}
    >
      {/* Ambient — barely perceptible, spans full section width */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[480px] w-[480px] rounded-full bg-white/[0.012] blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] h-[280px] w-[280px] rounded-full bg-white/[0.008] blur-[90px]" />
      </div>

      {/* Inner grid — fills section, anchored by section padding */}
      <div className={cn(
        "relative z-10 w-full",
        "grid grid-cols-1 items-center gap-12",
        "lg:grid-cols-[1fr_300px] lg:gap-16",
        "xl:grid-cols-[1fr_320px] xl:gap-20"
      )}>

        {/* Left — primary content */}
        <div className="flex flex-col">
          <Stagger>
            {/* Status */}
            <StaggerItem>
              <div className="mb-6 inline-flex items-center gap-2 sm:mb-8">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  {home.status}
                </span>
              </div>
            </StaggerItem>

            {/* Heading */}
            <StaggerItem>
              <h1
                id="hero-heading"
                className={cn(
                  "font-semibold tracking-[-0.03em] text-[var(--color-foreground)]",
                  "text-[2.1rem] leading-[1.1]",
                  "sm:text-[2.6rem]",
                  "lg:text-[3.2rem]",
                  "xl:text-[3.6rem]"
                )}
              >
                {home.heading}
                <br />
                <span className="text-[var(--color-muted)]">
                  {home.headingAccent}
                </span>
              </h1>
            </StaggerItem>

            {/* Sub-copy — warmer, more personal */}
            <StaggerItem>
              <p className={cn(
                "mt-5 text-[15px] leading-[1.75] text-[var(--color-secondary)]",
                "max-w-[42ch]",
                "sm:mt-6 sm:text-[16px]",
                "lg:max-w-[46ch]"
              )}>
                {home.intro}
              </p>
            </StaggerItem>

            {/* CTAs — stack on mobile, row on sm+ */}
            <StaggerItem>
              <div className={cn(
                "mt-7 flex flex-col gap-2.5",
                "sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
              )}>
                <Button asChild size="lg" className="w-full justify-center sm:w-auto">
                  <Link href={localizePath("/projects", locale)}>
                    {home.primaryCta}
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                  <Link href={localizePath("/about", locale)}>{home.secondaryCta}</Link>
                </Button>
              </div>
            </StaggerItem>

            {/* Meta line */}
            <StaggerItem>
              <div className={cn("mt-8 flex flex-wrap items-center sm:mt-10")}>
                {home.meta.map((item, i) => (
                  <span key={item} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mx-3 text-[var(--color-muted-2)]"
                      >
                        /
                      </span>
                    )}
                    <span className="text-[12px] tracking-wide text-[var(--color-muted)]">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        {/* Right — system panel, enters after hero text begins */}
        <motion.div
          variants={slideInRight}
          initial={reduced ? false : "hidden"}
          animate={reduced ? false : "visible"}
        >
          <HeroSystemPanel />
        </motion.div>
      </div>
    </section>
  );
}
