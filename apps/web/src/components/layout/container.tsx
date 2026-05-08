import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Standard content column for text-reading sections.
 * Uses consistent gutter padding; capped at 1440px so body-copy
 * sections (case studies, contact) stay comfortable at ultra-wide.
 * Sections that must fill the full viewport use MaxWidthWrapper.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-10 xl:px-16",
        className
      )}
    >
      {children}
    </Tag>
  );
}
