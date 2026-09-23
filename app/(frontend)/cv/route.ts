import { redirect } from "next/navigation"
import { getProfile } from "@/lib/content"

/**
 * Behind the "Download CV" button. Always the PDF the profile holds right now,
 * so `bun run cv` takes effect without a rebuild. `?download=1` makes Vercel
 * Blob send it as an attachment, which a `download` attribute cannot do for a
 * file on another origin.
 */
export async function GET() {
  const { cv } = await getProfile()
  redirect(`${cv}?download=1`)
}
