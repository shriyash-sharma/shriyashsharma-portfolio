import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  /** Alignment – defaults to left */
  align?: "left" | "center";
  className?: string;
  /** HTML id applied to the heading element for aria-labelledby */
  id?: string;
};

/**
 * Standardised section header pattern used across the site.
 * Renders an optional eyebrow label, a main heading, and optional subheading.
 */
export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-widest",
            "text-[var(--color-muted)]"
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        id={id}
        className={cn(
          "text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl"
        )}
      >
        {heading}
      </h2>

      {subheading && (
        <p
          className={cn(
            "text-sm leading-relaxed text-[var(--color-muted)] max-w-xl",
            align === "center" && "mx-auto"
          )}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
