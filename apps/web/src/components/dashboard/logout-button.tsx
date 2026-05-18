"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { dashboardLoginPath } from "@/lib/auth/constants";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.replace(dashboardLoginPath);
          router.refresh();
        });
      }}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}