import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "Protected engineering dashboard foundation.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireDashboardSession();

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
