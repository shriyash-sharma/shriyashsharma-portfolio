import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { EmailLink } from "@/components/shared/email-link";
import { siteConfig } from "@/lib/constants/site";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { cn } from "@/lib/utils/cn";

type FooterProps = {
  /** Reserve space for the fixed Ask AI launcher (bottom-right). */
  reserveLauncherSpace?: boolean;
};

export function Footer({ reserveLauncherSpace = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-[var(--color-border)]",
        reserveLauncherSpace
          ? "pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:py-8"
          : "py-8"
      )}
    >
      <MaxWidthWrapper>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark
              showWordmark={false}
              iconClassName="h-6"
              className="opacity-80"
            />
            <p className="max-w-none text-[12px] text-[var(--color-muted)]">
              &copy; {year} {siteConfig.author.name}
            </p>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-x-5 gap-y-2",
              reserveLauncherSpace && "pe-[7.5rem] sm:pe-44"
            )}
          >
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.author.name} on GitHub`}
              className={cn(
                "inline-flex min-h-9 items-center text-[12px] text-[var(--color-muted)]",
                "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
              )}
            >
              GitHub
            </Link>
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.author.name} on LinkedIn`}
              className={cn(
                "inline-flex min-h-9 items-center text-[12px] text-[var(--color-muted)]",
                "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
              )}
            >
              LinkedIn
            </Link>
            <EmailLink
              aria-label={`Email ${siteConfig.author.name}`}
              className={cn(
                "inline-flex min-h-9 items-center text-[12px] text-[var(--color-muted)]",
                "underline decoration-[color:color-mix(in_srgb,var(--color-muted)_45%,transparent)] decoration-[1.25px] underline-offset-4",
                "hover:text-[var(--color-secondary)] hover:decoration-current"
              )}
            >
              {siteConfig.author.email}
            </EmailLink>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
