import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Constrains content to the max-width layout column with consistent
 * horizontal padding. Use as the outermost wrapper in every section.
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
