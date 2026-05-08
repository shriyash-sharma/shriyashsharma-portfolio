import Link from "next/link";
import { siteConfig } from "@/lib/constants/site";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { cn } from "@/lib/utils/cn";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--color-muted)] max-w-none">
            &copy; {year} {siteConfig.author.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
            <a
              href={`mailto:${siteConfig.author.email}`}
              aria-label={`Email ${siteConfig.author.name}`}
              className={cn(
                "inline-flex min-h-9 items-center text-[12px] text-[var(--color-muted)]",
                "transition-colors duration-[140ms] hover:text-[var(--color-secondary)]"
              )}
            >
              {siteConfig.author.email}
            </a>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
