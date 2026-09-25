"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n"

/** A year, so the choice outlives the session. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * A link to the page being read in the other language, "IT" on an English
 * page and "EN" on an Italian one. Two languages need only the one button, the
 * same round size as the theme toggle beside it, which keeps the name and role
 * on one line each on a phone. A third language would get a button of its own.
 *
 * Picking one sets the cookie the proxy checks before the browser's
 * Accept-Language, so an Italian browser that chose English stays in English.
 */
export function LocaleSwitch({ label }: { label: string }) {
  // /it/projects/hrx -> ["", "it", "projects", "hrx"]
  const [, current, ...rest] = usePathname().split("/")

  const remember = (locale: Locale) => {
    // biome-ignore lint/suspicious/noDocumentCookie: a plain first-party preference; the Cookie Store API is still missing from older Safari and Firefox
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
  }

  return (
    <nav aria-label={label} className="flex shrink-0 gap-2">
      {LOCALES.filter((locale) => locale !== current).map((locale) => (
        <Link
          key={locale}
          href={`/${[locale, ...rest].join("/")}`}
          hrefLang={locale}
          lang={locale}
          // The code is what shows; the name is what a screen reader says.
          aria-label={LOCALE_NAMES[locale]}
          title={LOCALE_NAMES[locale]}
          onClick={() => remember(locale)}
          className="t-meta flex size-9 items-center justify-center rounded-full bg-surface-raised font-medium text-ink-muted transition-colors hover:bg-overlay-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}
