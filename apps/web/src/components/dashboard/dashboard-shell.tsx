import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils/cn";

type DashboardShellProps = {
  children: React.ReactNode;
};

const dashboardNavItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Content", href: "/dashboard/content" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "AI", href: "/dashboard/ai" },
  { label: "Observability", href: "/dashboard/observability" },
];

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-dvh bg-[var(--color-background)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark
              showWordmark={false}
              iconClassName="h-10"
              className="shrink-0"
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                Platform console
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--color-foreground)]">
                Engineering Dashboard
              </h1>
            </div>
          </div>
          <nav
            aria-label="Dashboard navigation"
            className="flex flex-wrap gap-2"
          >
            {dashboardNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md border border-[var(--color-border)] px-3 py-2",
                  "text-[12px] text-[var(--color-muted)] transition-colors",
                  "hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="px-5 py-10 sm:px-6 lg:px-10 xl:px-16">{children}</div>
    </div>
  );
}
