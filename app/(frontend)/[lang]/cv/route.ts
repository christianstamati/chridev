import { notFound, redirect } from "next/navigation"
import { getProfile } from "@/lib/content"
import { isLocale } from "@/lib/i18n"

/**
 * Behind the "Download CV" button. Always the PDF the profile holds right now,
 * in the page's language, so `bun run cv` takes effect without a rebuild.
 * `?download=1` makes Vercel Blob send it as an attachment, which a `download`
 * attribute cannot do for a file on another origin.
 *
 * The locale comes from `params`: route handlers cannot read root params yet.
 */
export async function GET(_: Request, { params }: RouteContext<"/[lang]/cv">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const { cv } = await getProfile(lang)
  redirect(`${cv}?download=1`)
}
