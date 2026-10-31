import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/i18n/config";

// Locale middleware for the standalone landing/docs site.
// - Non-locale paths (/, /docs ...) are redirected to /{locale}/...
// - Locale preference order: cookie -> Accept-Language (PRD V1.3)
// 控制台与登录页属于 SaaS 本体，本站不再承担会话守卫。
const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 常见错链 /cn → /zh（部分外链/输入法习惯使用 cn 作为中文代码）。
  if (pathname === "/cn" || pathname.startsWith("/cn/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/zh${pathname.slice(3)}`;
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] ?? "";
  const locale = isLocale(first) ? first : null;

  if (!locale) {
    const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
    const al = req.headers.get("accept-language") ?? "";
    const alLocale = al.toLowerCase().startsWith("en") ? "en" : DEFAULT_LOCALE;
    const target = cookieLocale && isLocale(cookieLocale) ? cookieLocale : alLocale;
    const url = req.nextUrl.clone();
    url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
