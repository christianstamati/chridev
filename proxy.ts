import { type NextRequest, NextResponse } from "next/server"
import { isLocale, LOCALE_COOKIE, negotiateLocale } from "@/lib/i18n"

/**
 * Every page lives under its locale, /en/... or /it/... A path without one,
 * such as the bare domain or an old /projects/<slug> link, is redirected to
 * the reader's language: the one they last picked in the switcher, else the
 * best match for their browser's Accept-Language, else English.
 *
 * Temporary redirects, since the answer depends on who is asking.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isLocale(pathname.split("/")[1])) return

  const picked = request.cookies.get(LOCALE_COOKIE)?.value
  const locale = isLocale(picked)
    ? picked
    : negotiateLocale(request.headers.get("accept-language"))

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Pages only: not the admin or its API, Next's own files, or anything with
  // an extension (the favicon and icons).
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
}
