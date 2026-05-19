"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
// import { HeroSystemPanel } from "./hero-system-panel";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPathLocale, localizePath } from "@/lib/i18n/config";
import { slideInRight, transitions } from "@/styles/motion";
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
        "grid grid-cols-1 items-start gap-12",
        "lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16",
        "xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-20"
      )}>

        {/* Left — primary content */}
        <div className="flex flex-col">
          <Stagger>
            <StaggerItem>
              <div className="flex items-start justify-between gap-4 sm:gap-6 lg:block">
                <div className="min-w-0 flex-1 max-w-[34rem] lg:max-w-none">
                  {/* Status */}
                  <div className="mb-6 inline-flex items-center gap-2 sm:mb-8">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[11.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      {home.status}
                    </span>
                  </div>

                  {/* Heading */}
                  <h1
                    id="hero-heading"
                    className={cn(
                      "font-semibold tracking-[-0.03em] text-[var(--color-foreground)]",
                      "text-[1.95rem] leading-[1.08]",
                      "sm:text-[2.45rem] sm:leading-[1.08]",
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

                </div>

                <div className="shrink-0 pt-0.5 lg:hidden">
                  <HeroPortraitCard compact />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className={cn(
                "mt-5 max-w-[46ch] text-[15px] leading-[1.8] text-[var(--color-secondary)]",
                "sm:mt-6 sm:text-[16px]",
                "lg:max-w-[46ch]"
              )}>
                {home.intro}
              </p>
            </StaggerItem>

            {/* CTAs — stack on mobile, row on sm+ */}
            <StaggerItem>
              <div className={cn(
                "mt-7 flex flex-col gap-2.5 py-2 sm:py-3",
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

        {/* Right — portrait (system panel disabled for now; see hero-system-panel.tsx) */}
        <motion.div
          className="hidden lg:flex lg:flex-col lg:items-end lg:gap-4"
          variants={slideInRight}
          initial={reduced ? false : "hidden"}
          animate={reduced ? false : "visible"}
        >
          <HeroPortraitCard />
          {/* <HeroSystemPanel /> */}
        </motion.div>
      </div>
    </section>
  );
}

function HeroPortraitCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]",
        "shadow-[0_24px_80px_rgba(0,0,0,0.22)]",
        compact
          ? "w-[92px] rounded-[20px] sm:w-[118px] sm:rounded-[22px]"
          : "w-full max-w-[320px] rounded-[30px] xl:max-w-[360px]"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-6 top-0 h-20 rounded-full bg-white/[0.05] blur-3xl",
          compact && "inset-x-4 h-14"
        )}
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: compact ? 6 : 10, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={transitions.reveal}
      >
        <div className={cn("relative aspect-[5/6]", compact && "aspect-[4/5]") }>
          <Image
            src="/ShriyashProfilePhoto.png"
            alt="Portrait of Shriyash Sharma"
            fill
            priority
            sizes={compact ? "(max-width: 639px) 92px, 118px" : "(max-width: 1279px) 340px, 360px"}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.04)_0%,rgba(8,8,8,0.12)_60%,rgba(8,8,8,0.42)_100%)]" />
          <div className="absolute inset-[1px] rounded-[inherit] border border-white/[0.05]" />
          {compact ? (
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(8,8,8,0)_0%,rgba(8,8,8,0.72)_100%)] px-3 pb-2.5 pt-8 sm:px-3.5 sm:pb-3">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/72 sm:text-[9px]">
                Systems
              </span>
            </div>
          ) : null}
        </div>

        {!compact ? (
          <div className="relative border-t border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(15,15,15,0.98)_0%,rgba(10,10,10,0.98)_100%)] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
                  Editorial anchor
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--color-secondary)]">
                  Systems-minded engineering, delivered with product judgment.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
