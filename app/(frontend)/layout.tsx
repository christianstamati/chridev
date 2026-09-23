import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// shadcn's default. A variable font, so one file serves every weight the site
// uses; Next downloads it at build time and serves it from this origin.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Christian Stamati · Software Engineer",
    template: "%s · Christian Stamati",
  },
  description:
    "Software engineer in Italy. Clinical software at Clover Next, and real-time 3D for the web. Next.js, TypeScript, Three.js, Unreal Engine.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
