"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { configureAnalytics, trackPageView } from "@/lib/analytics/ga";

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    configureAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (lastTrackedPathRef.current === pathname) {
      return;
    }

    trackPageView(pathname, document.title);
    lastTrackedPathRef.current = pathname;
  }, [pathname]);

  return null;
}
