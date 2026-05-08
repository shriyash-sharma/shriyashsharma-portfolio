import { cn } from "@/lib/utils/cn";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wide editorial column for hero, project grids, and full-bleed zones.
 * Max-width 1280px (7xl) with viewport-proportional gutters at xl+.
 * Navbar, hero, and project grid all share this frame — they stay aligned.
 */
export function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8 xl:px-12", className)}>
      {children}
    </div>
  );
}
