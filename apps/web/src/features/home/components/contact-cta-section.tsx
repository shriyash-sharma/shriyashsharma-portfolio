import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion/fade-in";
import { cn } from "@/lib/utils/cn";

export function ContactCtaSection() {
  return (
    <Section
      aria-labelledby="contact-cta-heading"
      className="border-t border-[var(--color-border)]"
    >
      <FadeIn>
        <div
          className={cn(
            "flex flex-col items-start gap-6 rounded-2xl p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between",
            "border border-[var(--color-border)] bg-[var(--color-surface)]",
            "relative overflow-hidden"
          )}
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-white/[0.015] blur-3xl"
          />

          <div className="flex flex-col gap-2 relative z-10">
            <h2
              id="contact-cta-heading"
              className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl"
            >
              Let&apos;s build something together
            </h2>
            <p className="text-sm text-[var(--color-muted)] max-w-md">
              Open to senior frontend, fullstack, and AI engineering roles.
              Available for consulting and contract work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <Button asChild size="md">
              <Link href="/contact">
                Get in touch
                <ArrowRight size={14} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="md">
              <Link
                href={`mailto:hello@shriyashsharma.dev`}
              >
                Send email
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
