import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Standard content column.
 * - Mobile: 24px horizontal padding
 * - lg: 32px
 * - xl: 40px
 * - Max-width: 1152px (6xl) — readable text lanes on all screens;
 *   sections that need more editorial width use MaxWidthWrapper.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-6xl px-6 lg:px-8 xl:px-10",
        className
      )}
    >
      {children}
    </Tag>
  );
}
