"use client"

import { useScrollProgress } from "@/hooks/use-scroll-progress"
import { cn } from "@/lib/utils"

type PaneProps = {
  children: React.ReactNode
  /** Accessible name for the scroll region, e.g. "Profile" or "Selected work". */
  label: string
  className?: string
  /** Hide the progress bar (used when a pane isn't independently scrollable). */
  showProgress?: boolean
}

/**
 * An independently scrolling column with a progress bar pinned to its own top
 * edge. The bar fills as *this* pane scrolls. The two panes track separately.
 */
export function Pane({
  children,
  label,
  className,
  showProgress = true,
}: PaneProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <section
      aria-label={label}
      className={cn("relative min-h-0 overflow-hidden", className)}
    >
      {showProgress && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-(--progress-h)"
        >
          <div
            className="h-full origin-left bg-accent transition-[transform] duration-100 ease-out"
            // scaleX rather than width: composited, so it stays smooth under fast scroll.
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}

      <div
        ref={ref}
        // tabIndex makes the region keyboard-scrollable, which a plain
        // overflow container isn't in Safari/Firefox.
        // biome-ignore lint/a11y/noNoninteractiveTabindex: scroll regions must be focusable
        tabIndex={0}
        // `outline-hidden` (not `outline-none`) keeps a transparent outline in
        // forced-colors mode, where box-shadow rings are dropped entirely.
        // --focus-ring is full-contrast ink in both themes (WCAG 1.4.11).
        className="pane h-full overflow-y-auto overscroll-contain outline-hidden focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-inset"
      >
        {children}
      </div>
    </section>
  )
}
