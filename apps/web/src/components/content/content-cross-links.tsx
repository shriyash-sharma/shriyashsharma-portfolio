import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CrossLink = {
  href: string;
  label: string;
  description: string;
};

type ContentCrossLinksProps = {
  links: CrossLink[];
};

/**
 * Contextual internal links between content hubs (Projects ↔ Case Studies ↔
 * AI Lab ↔ Blog). Server-rendered for crawlability.
 */
export function ContentCrossLinks({ links }: ContentCrossLinksProps) {
  return (
    <nav
      aria-label="Related sections"
      className="grid gap-4 border-t border-[var(--color-border)] pt-10 sm:grid-cols-2"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex flex-col gap-2 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
        >
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-foreground)]">
            {link.label}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
          <span className="text-[13px] leading-relaxed text-[var(--color-secondary)]">
            {link.description}
          </span>
        </Link>
      ))}
    </nav>
  );
}
