import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Constrains content to the layout column.
 * - Mobile: 24px horizontal padding
 * - Desktop: 32px
 * - Max-width: 1024px (5xl) — keeps line lengths readable, prevents
 *   content from going uncomfortably wide on large monitors
 * - Ultra-wide: centered with visible gutters (no full-bleed)
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-5xl px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Tag>
  );
}
