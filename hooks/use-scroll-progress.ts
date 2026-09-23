"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Tracks how far a scroll container has been scrolled, as 0..1.
 *
 * Returns a ref to attach to the scrollable element. Progress updates are
 * rAF-throttled so a fast wheel or trackpad flick doesn't queue a state update
 * per scroll event.
 *
 * A container that doesn't overflow reports 1. A full bar reads as "nothing
 * left to scroll", which is truthful and avoids a permanently empty bar.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return

    // A pane inside a `display:none` subtree reports every box metric as 0.
    // That is "no layout box", not "content fits". Treating it as the latter
    // would latch the bar to 100% and flash a full bar on the next tab switch.
    if (el.clientHeight === 0) return

    const scrollable = el.scrollHeight - el.clientHeight
    setProgress(
      scrollable <= 0 ? 1 : Math.min(1, Math.max(0, el.scrollTop / scrollable))
    )
  }, [])

  const schedule = useCallback(() => {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      measure()
    })
  }, [measure])

  useEffect(() => {
    const el = ref.current
    if (!el) return

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
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [measure, schedule])

  return { ref, progress }
}
