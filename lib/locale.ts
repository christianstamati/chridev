import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { lang } from "next/root-params"
import { DICTIONARIES } from "@/lib/dictionary"
import { isLocale, LOCALES, type Locale } from "@/lib/i18n"

/**
 * The locale of the page being rendered, read from its /[lang] segment. Any
 * server component can ask, so the locale is never threaded through props.
 * Kept apart from lib/i18n.ts because next/root-params only exists inside a
 * Next render, and the proxy and scripts import that file too.
 */
export async function getLocale(): Promise<Locale> {
  const locale = await lang()
  if (!isLocale(locale)) notFound()
  return locale
}

/** The UI strings for the page being rendered. */
export async function getDictionary() {
  return DICTIONARIES[await getLocale()]
}

/**
 * The canonical URL and its translations, for search engines. `path` is the
 * route without its locale, "" for the home page. x-default is the bare path,
 * which the proxy sends to the reader's own language.
 */
export async function alternates(
  path: string
): Promise<Metadata["alternates"]> {
  return {
    canonical: `/${await getLocale()}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
      "x-default": path || "/",
    },
  }
}
