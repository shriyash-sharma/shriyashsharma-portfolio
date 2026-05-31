"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils/cn";
import type { DashboardSession } from "@/lib/api/contracts/admin";

type DashboardShellProps = {
  children: React.ReactNode;
  session: DashboardSession;
};

const dashboardNavItems = [
  { label: "Overview", href: "/dashboard", shortLabel: "Overview" },
  { label: "Content", href: "/dashboard/content", shortLabel: "Content" },
  { label: "New Entry", href: "/dashboard/content/new", shortLabel: "New" },
  { label: "Media", href: "/dashboard/media", shortLabel: "Media" },
];

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
}

function DashboardNavLink({
  href,
  label,
  pathname,
  compact = false,
}: {
  href: string;
  label: string;
  pathname: string;
  compact?: boolean;
}) {
  const isActive = isNavItemActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "shrink-0 rounded-xl border text-[13px] transition-colors",
        compact
          ? "px-3.5 py-2"
          : "px-3 py-2.5",
        isActive
          ? "border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
          : "border-transparent text-[var(--color-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-secondary)]"
      )}
    >
      {label}
    </Link>
  );
}

export function DashboardShell({ children, session }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_32%),var(--color-background)]">
      <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_96%,transparent)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark showWordmark={false} iconClassName="h-9" className="shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Platform console
              </p>
              <p className="truncate text-[15px] font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
                {session.name}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>

        <nav
          aria-label="Dashboard navigation"
          className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-5 [&::-webkit-scrollbar]:hidden"
        >
          {dashboardNavItems.map((item) => (
            <DashboardNavLink
              key={item.href}
              href={item.href}
              label={item.shortLabel}
              pathname={pathname}
              compact
            />
          ))}
        </nav>
      </div>

      <div className="grid min-h-dvh lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-6 py-7 backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <BrandMark showWordmark={false} iconClassName="h-10" className="shrink-0" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Platform console
              </p>
              <h1 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
                Operations
              </h1>
            </div>
          </div>

          <nav aria-label="Dashboard navigation" className="mt-6 grid gap-1.5">
            {dashboardNavItems.map((item) => (
              <DashboardNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Active session
            </p>
            <p className="mt-3 text-[14px] font-medium text-[var(--color-foreground)]">
              {session.name}
            </p>
            <p className="mt-1 break-all text-[12px] text-[var(--color-muted)]">
              {session.email}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              {session.roles.join(" · ")}
            </p>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0 px-3 py-4 sm:px-5 sm:py-6 lg:px-10 lg:py-8 xl:px-12">
          <div className="rounded-[20px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
