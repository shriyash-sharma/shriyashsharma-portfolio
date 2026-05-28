import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

type EmailLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "children"> & {
  children?: ReactNode;
  className?: string;
  subject?: string;
};

const DEFAULT_SUBJECT = "Portfolio Inquiry";

export function EmailLink({
  children,
  className,
  subject = DEFAULT_SUBJECT,
  "aria-label": ariaLabel,
  ...props
}: EmailLinkProps) {
  const searchParams = new URLSearchParams();

  if (subject) {
    searchParams.set("subject", subject);
  }

  const href = `mailto:${siteConfig.author.email}${searchParams.size ? `?${searchParams.toString()}` : ""}`;

  return (
    <a
      href={href}
      aria-label={ariaLabel ?? `Email ${siteConfig.author.name}`}
      className={cn(
        "cursor-pointer transition-[color,text-decoration-color,opacity,box-shadow] duration-[140ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        className
      )}
      {...props}
    >
      {children ?? siteConfig.author.email}
    </a>
  );
}