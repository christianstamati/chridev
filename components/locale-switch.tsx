"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useId } from "react"
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n"

/** A year, so the choice outlives the session. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * The Union Jack, cropped square around the crosses, which is how round flag
 * icons show it. The red diagonals sit off-centre as on the real flag; the
 * second clip path is what offsets them. Ids come from useId, so two copies
 * on one page never share a clip path.
 */
function UnitedKingdom() {
  const id = useId()
  return (
    <svg viewBox="15 0 30 30" className="size-full" aria-hidden>
      <clipPath id={`${id}-flag`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-diagonals`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-flag)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${id}-diagonals)`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

function Italy() {
  return (
    <svg viewBox="0 0 3 3" className="size-full" aria-hidden>
      <rect width="1" height="3" fill="#009246" />
      <rect x="1" width="1" height="3" fill="#fff" />
      <rect x="2" width="1" height="3" fill="#CE2B37" />
    </svg>
  )
}

/**
 * One flag per locale. Flags stand for countries, not languages, so English
 * gets the Union Jack for the site's British spelling. A locale without a
 * flag here is a type error.
 */
const FLAGS: Record<Locale, () => React.ReactNode> = {
  en: UnitedKingdom,
  it: Italy,
}

/**
 * A link to the page being read in the other language, the Italian flag on an
 * English page and the British one on an Italian page. Two languages need only
 * the one button, the same round size as the theme toggle beside it, which
 * keeps the name and role on one line each on a phone. A third language would
 * get a button of its own.
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
      {LOCALES.filter((locale) => locale !== current).map((locale) => {
        const Flag = FLAGS[locale]
        return (
          <Link
            key={locale}
            href={`/${[locale, ...rest].join("/")}`}
            hrefLang={locale}
            lang={locale}
            // The flag is what shows; the name is what a screen reader says.
            aria-label={LOCALE_NAMES[locale]}
            title={LOCALE_NAMES[locale]}
            onClick={() => remember(locale)}
            className="flex size-9 items-center justify-center rounded-full bg-surface-raised transition-colors hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
          >
            {/* The hairline keeps the white of the tricolore from melting
                into a light surface. */}
            <span className="size-5 overflow-hidden rounded-full ring-1 ring-hairline">
              <Flag />
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
