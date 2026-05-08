import { cn } from "@/lib/utils/cn";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Full-width editorial wrapper for hero, project grids, and wide zones.
 * No max-width cap — fills the viewport at every screen size.
 * Padding matches the navbar so all zones share the same left/right anchors.
 */
export function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div className={cn("w-full px-5 sm:px-6 lg:px-10 xl:px-16", className)}>
      {children}
    </div>
  );
}
