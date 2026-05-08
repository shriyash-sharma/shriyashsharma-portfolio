import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/constants/site";

export function ContactCtaSection() {
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
          <div className="relative z-10 flex flex-col gap-2.5 lg:max-w-[420px]">
            <h2
              id="contact-cta-heading"
              className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-foreground)] sm:text-xl lg:text-2xl"
            >
              Open to the right opportunity
            </h2>
            <p className="text-[13px] leading-[1.7] text-[var(--color-secondary)] sm:text-[14px]">
              Looking for senior engineering roles, architecture consulting, or
              contract work. If you are building something technically
              ambitious, let&apos;s talk.
            </p>
          </div>

          {/* Actions — stacked full-width on mobile, inline on lg */}
          <div className={cn(
            "relative z-10 flex w-full flex-col gap-2.5",
            "sm:flex-row sm:flex-wrap sm:items-center sm:gap-3",
            "lg:w-auto lg:shrink-0"
          )}>
            <Button asChild size="lg" className="w-full justify-center sm:w-auto">
              <Link href="/contact">
                Get in touch
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
              <a href={`mailto:${siteConfig.author.email}`}>
                {siteConfig.author.email}
              </a>
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
