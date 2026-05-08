import { cn } from "@/lib/utils/cn";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wider max-width column for hero-style or full-bleed sections.
 * Use when you want slightly more room than the standard Container.
 */
export function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
