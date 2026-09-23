"use client"

import { IconArrowUp } from "@tabler/icons-react"
import { useRef } from "react"

/**
 * Returns the reader to the top of the pane they're in.
 *
 * Scrolling `window` would do nothing here. The document itself never scrolls,
 * because each pane is its own overflow container, so this walks up to the
 * nearest `.pane` ancestor and scrolls that instead.
 */
export function ScrollTopButton() {
  const ref = useRef<HTMLButtonElement | null>(null)

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const pane = ref.current?.closest(".pane")
        pane?.scrollTo({ top: 0, behavior: "smooth" })
      }}
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-ink-muted transition-colors hover:bg-overlay-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
    >
      <IconArrowUp size={17} aria-hidden />
    </button>
  )
}
