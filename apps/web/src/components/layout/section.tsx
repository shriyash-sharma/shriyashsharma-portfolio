import { cn } from "@/lib/utils/cn";
import { Container } from "./container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Renders the section with no Container wrapper when true */
  fullWidth?: boolean;
  id?: string;
  as?: React.ElementType;
};

/**
 * Semantic section wrapper with consistent vertical rhythm.
 * By default wraps content in a Container; use fullWidth to opt out.
 */
export function Section({
  children,
  className,
  containerClassName,
  fullWidth = false,
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn("py-20 lg:py-28", className)}>
      {fullWidth ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </Tag>
  );
}
