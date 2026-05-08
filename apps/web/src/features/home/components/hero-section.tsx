import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { HeroSystemPanel } from "./hero-system-panel";
import { cn } from "@/lib/utils/cn";

/**
 * Hero section — server component.
 * Desktop: 2-column grid (text + system panel).
 * Mobile: single column, panel hidden, tight vertical rhythm.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative",
        // Mobile: full-height feel with generous but not excessive padding
        "flex min-h-[88dvh] flex-col justify-center",
        "pt-16 pb-12",
        // Tablet+
        "sm:min-h-[84dvh] sm:pt-20 sm:pb-16",
        // Desktop+
        "lg:min-h-[90dvh] lg:pt-24 lg:pb-20"
      )}
    >
      {/* Ambient — barely perceptible */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[480px] w-[480px] rounded-full bg-white/[0.012] blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] h-[280px] w-[280px] rounded-full bg-white/[0.008] blur-[90px]" />
      </div>

      {/* Two-column grid on desktop */}
      <div className={cn(
        "relative z-10",
        "grid grid-cols-1 items-center gap-12",
        "lg:grid-cols-[1fr_300px] lg:gap-16",
        "xl:grid-cols-[1fr_320px]"
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
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  Available for new roles
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
                Senior software engineer
                <br />
                <span className="text-[var(--color-muted)]">
                  building things that last
                </span>
              </h1>
            </StaggerItem>

            {/* Sub-copy — warmer, more personal */}
            <StaggerItem>
              <p className={cn(
                "mt-5 text-[14px] leading-[1.75] text-[var(--color-secondary)]",
                "max-w-[40ch]",
                "sm:mt-6 sm:text-[15px]",
                "lg:max-w-[44ch]"
              )}>
                I build production software with care — API design, frontend
                systems, and the architecture decisions that compound over time.
                I prefer boring, reliable choices and get the structure right
                before worrying about anything else.
              </p>
            </StaggerItem>

            {/* CTAs — stack on mobile, row on sm+ */}
            <StaggerItem>
              <div className={cn(
                "mt-7 flex flex-col gap-2.5",
                "sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
              )}>
                <Button asChild size="lg" className="w-full justify-center sm:w-auto">
                  <Link href="/projects">
                    View work
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                  <Link href="/about">About me</Link>
                </Button>
              </div>
            </StaggerItem>

            {/* Meta line */}
            <StaggerItem>
              <div className={cn("mt-8 flex flex-wrap items-center sm:mt-10")}>
                {[
                  "5+ yrs production software",
                  "Frontend · Fullstack · Systems",
                  "India · Remote-first",
                ].map((item, i) => (
                  <span key={item} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mx-3 text-[var(--color-muted-2)]"
                      >
                        /
                      </span>
                    )}
                    <span className="text-[11px] tracking-wide text-[var(--color-muted)]">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        {/* Right — system panel (desktop only) */}
        <HeroSystemPanel />
      </div>
    </section>
  );
}
