"use client"

import { motion } from "motion/react"

/** Shared feel: short, eased-out, no bounce. Animation should be felt, not watched. */
const EASE = [0.22, 1, 0.36, 1] as const
const DURATION = 0.5
const RISE = 8

/**
 * Fades and lifts its children into place the first time they scroll into view.
 *
 * `whileInView` observes against the browser viewport, which is still correct
 * here even though content scrolls inside a pane rather than the document.
 * The pane itself is on screen, so its children intersect normally.
 *
 * Reduced motion is honoured in CSS (`[data-reveal]` in globals.css) rather
 * than by branching on `useReducedMotion()`. That hook reads `matchMedia`, so
 * it returns false during SSR and true on the client for a reader who asked for
 * less motion. React does not patch up a mismatched `style` attribute, so
 * the `opacity: 0` the server wrote would simply stay. The result was a blank
 * page for exactly the people the branch was meant to help.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Same reveal, but hands each direct child its own staggered delay so a list
 * arrives in sequence instead of all at once.
 */
export function RevealStagger({
  children,
  className,
  step = 0.05,
}: {
  children: React.ReactNode
  className?: string
  /** Seconds between each child. Keep it small. This is punctuation, not a show. */
  step?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: step } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** A single item inside <RevealStagger>. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y: RISE },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
