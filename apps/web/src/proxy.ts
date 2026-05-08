import { NextRequest, NextResponse } from "next/server";
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

  const pathLocale = getPathLocale(pathname);
  const preferredLocale = getPreferredLocale(
    request.headers.get("accept-language")
  );
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  // Default locale remains unprefixed. Non-default locale paths are rewritten
  // to the existing route tree so localized content can be added incrementally.
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
