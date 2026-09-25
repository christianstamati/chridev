"use client"

import { useEffect, useRef } from "react"

/** Browsers that can drive the bar from CSS. See "Pane progress bars" in globals.css. */
const SCROLL_DRIVEN = "animation-timeline: scroll()"

/**
 * Fills a progress bar as a scroll container scrolls, 0..1 as `scale: x 1`.
 *
 * Returns two refs: one for the scrollable element, one for the bar. Where
 * the browser supports scroll-driven animations, globals.css animates the bar
 * off the scroll position and this does nothing. It is the fallback for the
 * rest (Firefox, for now).
 *
 * The scale is written straight to the bar, not through React state, so a
 * scroll re-renders nothing. Updates are rAF-throttled so a fast wheel or
 * trackpad flick doesn't queue one per scroll event. The bar has no
 * transition: easing toward each new value made it trail the scroll.
 *
 * A container that doesn't overflow reports 1. A full bar reads as "nothing
 * left to scroll", which is truthful and avoids a permanently empty bar.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const bar = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || CSS.supports(SCROLL_DRIVEN)) return

    let frame: number | null = null

    const measure = () => {
      frame = null

      // A pane inside a `display:none` subtree reports every box metric as 0.
      // That is "no layout box", not "content fits". Treating it as the latter
      // would latch the bar to 100% and flash a full bar on the next tab switch.
      if (el.clientHeight === 0) return

      const scrollable = el.scrollHeight - el.clientHeight
      const progress =
        scrollable <= 0
          ? 1
          : Math.min(1, Math.max(0, el.scrollTop / scrollable))
      if (bar.current) bar.current.style.scale = `${progress} 1`
    }

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    measure()
    el.addEventListener("scroll", schedule, { passive: true })

    // Content height changes (font swap, image load, viewport resize) move the
    // denominator, so re-measure rather than trusting the last scroll event.
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)

    return () => {
      el.removeEventListener("scroll", schedule)
      ro.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, bar }
}
