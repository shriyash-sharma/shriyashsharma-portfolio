"use client";

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

type GtagCommand = "config" | "event" | "js";

type Gtag = (command: GtagCommand, target: string | Date, params?: AnalyticsEventParams) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function" && Boolean(GA_ID);
}

export function configureAnalytics(): void {
  if (!canTrack() || !GA_ID) {
    return;
  }

  window.gtag!("config", GA_ID, { send_page_view: false });
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!canTrack() || !GA_ID) {
    return;
  }

  window.gtag!("event", "page_view", {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}): void {
  if (!canTrack()) {
    return;
  }

  window.gtag!("event", eventName, params);
}
