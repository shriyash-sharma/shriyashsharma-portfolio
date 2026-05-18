import { cn } from "@/lib/utils/cn";
import { Container } from "./container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  id?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Canonical section wrapper.
 * Spacing: mobile 64px → tablet 80px → desktop 96px → xl 112px.
 * Never use ad-hoc py-* on sections — always go through this component
 * so vertical rhythm stays consistent across the page.
 */
export function Section({
  children,
  className,
  containerClassName,
  fullWidth = false,
  id,
  as: Tag = "section",
  ...props
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn("py-16 sm:py-20 lg:py-24 xl:py-28", className)}
      {...props}
    >
      {fullWidth ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </Tag>
  );
}
