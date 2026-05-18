"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { stripLocaleFromPath } from "@/lib/i18n/config";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const normalizedPath = stripLocaleFromPath(pathname);
  const isDashboardSurface =
    normalizedPath.startsWith("/dashboard") || normalizedPath === "/login";

  if (isDashboardSurface) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex-1 pt-[58px]">{children}</div>
      <Footer />
    </div>
  );
}