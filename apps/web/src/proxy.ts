/**
 * Edge request coordination for the Next.js application.
 *
 * This proxy enforces two platform-wide concerns before a request reaches the
 * route tree: dashboard session gating and locale normalization. It keeps the
 * default locale unprefixed, rewrites non-default locale paths back onto the
 * shared route tree, and redirects unauthenticated dashboard traffic to login.
 *
 * Architectural role:
 * - Preserve same-origin session behavior for dashboard pages.
 * - Keep locale-aware routing orthogonal to page implementation details.
 * - Allow localized content expansion without duplicating the app structure.
 */

import { NextRequest, NextResponse } from "next/server";
import { dashboardAuthCookieName } from "@/lib/auth/constants";
import {
  defaultLocale,
  getPathLocale,
  isLocale,
  localizePath,
  stripLocaleFromPath,
} from "@/lib/i18n/config";
import { getPreferredLocale, localeCookieName } from "@/lib/i18n/routing";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const normalizedPath = stripLocaleFromPath(pathname);
  const hasDashboardSession = request.cookies.has(dashboardAuthCookieName);

  if (normalizedPath.startsWith("/dashboard") && !hasDashboardSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", normalizedPath);
    return NextResponse.redirect(url);
  }

  // Do not redirect /login → /dashboard based on cookie presence alone.
  // Stale tokens are validated on the login page via /auth/session.

  const pathLocale = getPathLocale(pathname);
  const preferredLocale = getPreferredLocale(
    request.headers.get("accept-language")
  );
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  if (pathLocale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocaleFromPath(pathname);

    const response = NextResponse.rewrite(url);

    response.cookies.set(localeCookieName, pathLocale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  }

  const detectedLocale = isLocale(cookieLocale) ? cookieLocale : preferredLocale;

  if (!cookieLocale && pathname === "/" && detectedLocale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath(pathname, detectedLocale);

    const response = NextResponse.redirect(url);
    response.cookies.set(localeCookieName, detectedLocale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  }

  const response = NextResponse.next();

  response.cookies.set(localeCookieName, detectedLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
