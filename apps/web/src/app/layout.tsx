import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { DocumentLocaleSync } from "@/components/layout/document-locale-sync";
import { SkipLink } from "@/components/layout/skip-link";
import { localeConfigs } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
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

const localeRuntimeConfig = Object.fromEntries(
  Object.entries(localeConfigs).map(([locale, config]) => [
    locale,
    {
      languageTag: config.languageTag,
      direction: config.direction,
    },
  ])
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <DocumentLocaleSync />
        <SkipLink />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
