"use client"

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  wrap,
} from "motion/react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/** Drift speed in px/s. Slow enough to read a name as it passes. */
const DRIFT = 30
/**
 * How fast the speed settles back to the drift after a fling or a hover
 * change, as an exponential rate per second. Around 2.5 a fling coasts for
 * roughly a second before it rejoins the drift.
 */
const SETTLE = 2.5
/** Caps a flick so one hard throw can't send the strip spinning. */
const MAX_FLING = 2500
/** A release this long after the last move is a hold, not a fling. */
const FLING_WINDOW_MS = 80

/**
 * A strip that drifts left on its own and can be grabbed and thrown sideways.
 *
 * `children` is rendered twice, back to back, and the offset wraps at the
 * width of one copy, so the loop never shows a seam. That relies on one copy
 * being wider than the strip, which a row of a dozen or more items always is.
 *
 * Hovering with a mouse eases the drift to a stop, so a moving strip can
 * always be paused (WCAG 2.2.2) and is easy to grab. With reduced motion it
 * never drifts, but it can still be dragged. That branch only steers the
 * frame loop, never the markup, so the server and client render the same thing.
 */
export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const width = useRef(0)
  const velocity = useRef(-DRIFT)
  const hovered = useRef(false)
  const drag = useRef<{ id: number; lastX: number; lastT: number } | null>(null)

  const moveBy = (dx: number) => {
    // Before the first measurement there is nothing to wrap against.
    if (width.current === 0) return
    x.set(wrap(-width.current, 0, x.get() + dx))
  }

  // moveBy only touches refs and a motion value, so it never goes stale.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only by design
  useEffect(() => {
    const copy = copyRef.current
    if (!copy) return
    const observer = new ResizeObserver(() => {
      width.current = copy.offsetWidth
      moveBy(0)
    })
    observer.observe(copy)
    return () => observer.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (!inView || drag.current) return
    // Clamp the step so a frame after a backgrounded tab doesn't lurch.
    const dt = Math.min(delta, 50) / 1000
    const target = reduceMotion || hovered.current ? 0 : -DRIFT
    velocity.current +=
      (target - velocity.current) * (1 - Math.exp(-SETTLE * dt))
    moveBy(velocity.current * dt)
  })

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, lastX: e.clientX, lastT: e.timeStamp }
    velocity.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.lastX
    const dt = (e.timeStamp - d.lastT) / 1000
    moveBy(dx)
    if (dt > 0) {
      // Lightly smoothed, so one jittery event doesn't decide the fling.
      velocity.current = 0.8 * (dx / dt) + 0.2 * velocity.current
    }
    d.lastX = e.clientX
    d.lastT = e.timeStamp
  }

  const onPointerEnd = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const held = e.timeStamp - d.lastT > FLING_WINDOW_MS
    velocity.current = held
      ? 0
      : Math.max(-MAX_FLING, Math.min(MAX_FLING, velocity.current))
    drag.current = null
  }

  return (
    <div
      ref={rootRef}
      // pan-y leaves vertical swipes to the pane, so the strip only takes
      // sideways drags on touch screens. contain-inline-size keeps the track's
      // full width out of its parents' sizing. Without it the mobile pane's
      // auto grid column grew to fit every logo in a row, thousands of pixels
      // wide, and no section below was ever visible enough to reveal.
      className={cn(
        "cursor-grab touch-pan-y select-none overflow-hidden contain-inline-size active:cursor-grabbing",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hovered.current = true
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") hovered.current = false
      }}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {/* Trailing padding matches the gap, so the seam between the two
            copies is spaced like every other pair. */}
        <div ref={copyRef} className="flex shrink-0 items-center gap-14 pr-14">
          {children}
        </div>
        <div
          aria-hidden
          inert
          className="flex shrink-0 items-center gap-14 pr-14"
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
