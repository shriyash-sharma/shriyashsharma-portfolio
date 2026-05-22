"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import {
  AssistantDrawer,
  AssistantLauncher,
  AssistantProvider,
} from "@/features/assistant";
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

  // Suppress the floating launcher on the dedicated assistant page — the
  // panel is already the primary surface there, so a launcher would be
  // visually redundant. The drawer + provider stay mounted so prompt chips
  // and the keyboard shortcut keep working everywhere else.
  const showLauncher = normalizedPath !== "/assistant";

  return (
    <AssistantProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="flex-1 pt-[58px]">{children}</div>
        <Footer reserveLauncherSpace={showLauncher} />
      </div>
      {showLauncher ? <AssistantLauncher /> : null}
      <AssistantDrawer />
    </AssistantProvider>
  );
}