"use client";

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

type GtagCommand = "config" | "event" | "js";

type Gtag = (command: GtagCommand, target: string | Date, params?: AnalyticsEventParams) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * gtag.js is loaded with `lazyOnload`, so install the standard dataLayer queue
 * up front; calls made before the library arrives are replayed once it loads.
 */
function ensureGtag(): void {
  if (typeof window === "undefined" || !GA_ID || typeof window.gtag === "function") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the original `arguments` object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
}

function canTrack(): boolean {
  ensureGtag();
  return typeof window !== "undefined" && typeof window.gtag === "function" && Boolean(GA_ID);
}

let configured = false;

export function configureAnalytics(): void {
  if (configured || !canTrack() || !GA_ID) {
    return;
  }

  configured = true;
  window.gtag!("js", new Date());
  // Page views are sent by AnalyticsPageTracker on every route change.
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
