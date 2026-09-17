import { NextResponse, type NextRequest } from "next/server";
import { isSiteLocale } from "./lib/i18n/locales";

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = segments[0];
  if (!isSiteLocale(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname === "/" ? "/en" : `/en${request.nextUrl.pathname}`;
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${segments.slice(1).join("/")}`;
  const headers = new Headers(request.headers);
  headers.set("x-site-locale", locale);
  headers.set("x-site-path", request.nextUrl.pathname);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|admin|driver|robots.txt|sitemap.xml|.*\\..*).*)"],
};
