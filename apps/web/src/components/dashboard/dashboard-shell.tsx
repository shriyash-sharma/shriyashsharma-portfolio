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
  { label: "Overview", href: "/dashboard" },
  { label: "Content", href: "/dashboard/content" },
  { label: "New Entry", href: "/dashboard/content/new" },
  { label: "Media", href: "/dashboard/media" },
];

export function DashboardShell({ children, session }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_32%),var(--color-background)]">
      <div className="grid min-h-dvh lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-5 py-5 backdrop-blur lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div className="flex items-center gap-3">
              <BrandMark
                showWordmark={false}
                iconClassName="h-10"
                className="shrink-0"
              />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Platform console
                </p>
                <h1 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
                  Operations
                </h1>
              </div>
            </div>
            <div className="lg:hidden">
              <LogoutButton />
            </div>
          </div>

          <nav aria-label="Dashboard navigation" className="mt-6 grid gap-1.5">
            {dashboardNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-[13px] transition-colors",
                    isActive
                      ? "border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
                      : "border-transparent text-[var(--color-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-secondary)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:block">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
              Active session
            </p>
            <p className="mt-3 text-[14px] font-medium text-[var(--color-foreground)]">
              {session.name}
            </p>
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">
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

        <div className="min-w-0 px-5 py-6 sm:px-6 lg:px-10 lg:py-8 xl:px-12">
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
