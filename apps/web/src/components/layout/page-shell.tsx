import { cn } from "@/lib/utils/cn";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Top-level page wrapper that sits between the root layout and page content.
 * Provides consistent min-height and vertical flow.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <main id="main-content" className={cn("min-h-dvh w-full flex-1", className)}>
      {children}
    </main>
  );
}
