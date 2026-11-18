import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { AnalyticsPageTracker } from "@/components/analytics/analytics-page-tracker";
import { DocumentLocaleSync } from "@/components/layout/document-locale-sync";
import { SkipLink } from "@/components/layout/skip-link";
import { localeConfigs } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { hasPublishedBlogPosts } from "@/lib/services/content-service";
import "@/styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({ path: "/" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: siteConfig.themeColor,
};

/** Re-check whether Blog should appear in navigation as posts get published. */
export const revalidate = 300;

const localeRuntimeConfig = Object.fromEntries(
  Object.entries(localeConfigs).map(([locale, config]) => [
    locale,
    {
      languageTag: config.languageTag,
      direction: config.direction,
    },
  ])
);

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showBlog = await hasPublishedBlogPosts();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const c=${JSON.stringify(localeRuntimeConfig)};const p=location.pathname.split('/')[1];const l=c[p]?p:'en';document.documentElement.lang=c[l].languageTag;document.documentElement.dir=c[l].direction;document.documentElement.dataset.locale=l;}catch(e){}})();`,
          }}
        />
        <AnalyticsPageTracker />
        <DocumentLocaleSync />
        <SkipLink />
        <AppChrome showBlog={showBlog}>{children}</AppChrome>
        {googleAnalyticsId ? (
          // gtag/dataLayer is initialised in lib/analytics/ga.ts; the library itself
          // loads during idle time so it never competes with first paint.
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
