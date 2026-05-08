import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";

/**
 * Server component – no client state needed here.
 * FadeIn/Stagger are client wrappers but kept leaf-level.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[88dvh] flex-col items-start justify-center"
    >
      {/* Subtle radial glow – purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-0 h-[600px] w-[600px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <Stagger>
          <StaggerItem>
            <Badge variant="outline">Available for new opportunities</Badge>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col gap-4">
              <h1
                id="hero-heading"
                className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl"
              >
                Engineering products that{" "}
                <span className="text-[var(--color-muted)]">
                  scale with intent
                </span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-[var(--color-muted)]">
                Software engineer focused on scalable frontend systems, AI
                integration, and production-grade architecture. Currently
                building at the intersection of UX and infrastructure.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="md">
                <Link href="/projects">
                  View projects
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <Link href="/about">About me</Link>
              </Button>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
