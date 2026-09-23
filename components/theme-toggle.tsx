"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * Flips between light and dark. Pressing `d` anywhere does the same thing
 * (see ThemeHotkey in theme-provider).
 *
 * The icon can't be rendered until after mount: on the server there is no
 * resolved theme, so committing to one would flash the wrong glyph and trip a
 * hydration mismatch. Until then it renders a same-sized placeholder so the
 * header doesn't shift.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const Icon = isDark ? IconSun : IconMoon

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Switch theme"
      }
      title="Switch theme (d)"
      whileTap={reduced ? undefined : { scale: 0.92 }}
      transition={{ duration: 0.15 }}
      className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised text-ink-muted transition-colors hover:bg-overlay-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
    >
      {mounted ? (
        // `mode="wait"` so the outgoing glyph clears before the next arrives.
        // Crossfading sun and moon on top of each other reads as a smudge.
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={reduced ? false : { opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <Icon size={17} aria-hidden />
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="size-[17px]" aria-hidden />
      )}
    </motion.button>
  )
}
