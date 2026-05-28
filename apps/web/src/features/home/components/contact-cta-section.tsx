"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EmailLink } from "@/components/shared/email-link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPathLocale, localizePath } from "@/lib/i18n/config";

export function ContactCtaSection() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const home = getDictionary(locale).home;

  return (
    <Section
      aria-labelledby="contact-cta-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <div
          className={cn(
            "relative overflow-hidden rounded-xl sm:rounded-2xl",
            "border border-[var(--color-border)] bg-[var(--color-surface)]",
            // Subtle elevation on hover — border tightens, ambient glow intensifies
            "transition-[border-color,box-shadow] duration-[220ms] ease-out",
            "hover:border-[var(--color-border-strong)]",
            "hover:shadow-[0_0_48px_0_rgba(255,255,255,0.025)]",
            // Mobile: compact padding, Desktop: generous
            "px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12",
            "flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
          )}
        >
          {/* Ambient glow — corner only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/[0.02] blur-[72px]"
          />

          {/* Text */}
          <div className="relative z-10 flex flex-col gap-3 lg:max-w-[460px]">
            <h2
              id="contact-cta-heading"
              className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-xl lg:text-2xl"
            >
              {home.contactHeading}
            </h2>
            <p className="text-[13px] leading-[1.7] text-[var(--color-secondary)] sm:text-[14px]">
              {home.contactCopy}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Frontend architecture",
                "AI product systems",
                "Platform UX",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] uppercase tracking-[0.07em] text-[var(--color-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Actions — stacked full-width on mobile, inline on lg */}
          <div className={cn(
            "relative z-10 flex w-full flex-col gap-2.5",
            "sm:flex-row sm:flex-wrap sm:items-center sm:gap-3",
            "lg:w-auto lg:shrink-0"
          )}>
            <Button asChild size="lg" className="w-full justify-center sm:w-auto">
              <Link href={localizePath("/contact", locale)}>
                {home.contactPrimary}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
              <EmailLink />
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
