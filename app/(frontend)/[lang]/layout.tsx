import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getProfile } from "@/lib/content"
import { LOCALES } from "@/lib/i18n"
import { getDictionary, getLocale } from "@/lib/locale"
import { cn } from "@/lib/utils"

// shadcn's default. A variable font, so one file serves every weight the site
// uses; Next downloads it at build time and serves it from this origin.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

/** Every page is prerendered once per locale. Anything else is a 404. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}
export const dynamicParams = false

export async function generateMetadata(): Promise<Metadata> {
  const [profile, t] = await Promise.all([
    getProfile(await getLocale()),
    getDictionary(),
  ])
  return {
    // Resolves the relative URLs in each page's `alternates`.
    metadataBase: new URL(profile.url),
    title: {
      default: `${profile.name} · ${profile.role}`,
      template: `%s · ${profile.name}`,
    },
    description: t.description,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={await getLocale()}
      // next-themes stamps the theme class on <html> before paint, which the
      // server render can't know about, hence suppressHydrationWarning.
      suppressHydrationWarning
      // `shell-root` locks page scroll so the two panes own scrolling on desktop.
      className={cn("shell-root antialiased", geist.variable)}
    >
      <body className="shell font-sans">
        <ThemeProvider>{children}</ThemeProvider>
        {/* Page views for the site only; the admin has its own root layout. */}
        <Analytics />
      </body>
    </html>
  )
}
