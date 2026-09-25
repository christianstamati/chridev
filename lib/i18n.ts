/**
 * The languages the site speaks. Payload stores a copy of every localized field
 * per locale, and every page lives under its locale: /en/..., /it/...
 *
 * Plain data and no Next imports, so the Payload config, the proxy and the
 * scripts can all share it.
 */

export const LOCALES = ["en", "it"] as const
export type Locale = (typeof LOCALES)[number]

/** What an unknown browser gets, and what an empty translation falls back to. */
export const DEFAULT_LOCALE: Locale = "en"

/** Each language in its own words, for the switcher and the admin. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
}

/**
 * The reader's own pick from the switcher. It outranks the browser's
 * Accept-Language, so choosing English on an Italian browser sticks.
 */
export const LOCALE_COOKIE = "NEXT_LOCALE"

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

/**
 * The best locale for an Accept-Language header, e.g. "it-IT,it;q=0.9,en;q=0.8".
 * Tags are tried in order of weight and matched on the language alone, so
 * it-CH and it-IT both land on Italian.
 */
export function negotiateLocale(header: string | null | undefined): Locale {
  const tags = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="))
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of tags) {
    const language = tag.split("-")[0]
    if (isLocale(language)) return language
  }
  return DEFAULT_LOCALE
}
