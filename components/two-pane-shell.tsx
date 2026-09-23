"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Pane } from "@/components/pane"
import { cn } from "@/lib/utils"

type Side = "left" | "right"

const ShellViewContext = createContext<{
  side: Side
  setSide: (s: Side) => void
  /** Switch to the pane that owns `id`, then scroll it into view. */
  revealSection: (id: string) => void
} | null>(null)

/**
 * Lets anything inside the shell jump to a section that may live in the other
 * pane. On mobile the inactive pane is `display:none`, so a bare `#id` link is
 * a no-op, because the browser has no box to scroll to and nothing swaps the pane.
 */
export function useShellView() {
  const ctx = useContext(ShellViewContext)
  if (!ctx) throw new Error("useShellView must be used inside TwoPaneShell")
  return ctx
}

export type TwoPaneShellProps = {
  left: React.ReactNode
  right: React.ReactNode
  /** Accessible names for the two scroll regions. */
  leftLabel: string
  rightLabel: string
  /** Labels on the mobile toggle. */
  leftTab: string
  rightTab: string
  /**
   * Icons before those labels, passed rendered: this is a client component,
   * and a server page can hand it elements but not component functions.
   */
  leftIcon: React.ReactNode
  rightIcon: React.ReactNode
  /** Section ids rendered inside the left pane, used to route `#hash` jumps. */
  leftSectionIds: readonly string[]
  /** Hashes that should open the right pane on load, e.g. `work`. */
  rightHashes?: readonly string[]
}

/**
 * Desktop: two independently scrolling panes side by side (1fr / 2fr), each
 * with its own progress bar.
 * On mobile, one pane at a time, swapped by the pill toggle. The panes are too
 * narrow to sit next to each other, and stacking them would make the right
 * pane's progress bar meaningless.
 */
export function TwoPaneShell({
  left,
  right,
  leftLabel,
  rightLabel,
  leftTab,
  rightTab,
  leftIcon,
  rightIcon,
  leftSectionIds,
  rightHashes = [],
}: TwoPaneShellProps) {
  const [side, setSide] = useState<Side>("left")

  const revealSection = useCallback(
    (id: string) => {
      setSide(leftSectionIds.includes(id) ? "left" : "right")
      // Wait for the pane to get a layout box before asking to scroll to it.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      })
    },
    [leftSectionIds]
  )

  // `/#work` should land on the grid, which matters on mobile where only one
  // pane shows. Runs after mount so the server render stays deterministic.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only by design
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    if (rightHashes.includes(hash) || hash === "pane-right") setSide("right")
    else if (leftSectionIds.includes(hash)) revealSection(hash)
    // Intentionally mount-only: this reads the entry URL, not later changes.
  }, [])

  const tabs: { id: Side; label: string; icon: React.ReactNode }[] = [
    { id: "left", label: leftTab, icon: leftIcon },
    { id: "right", label: rightTab, icon: rightIcon },
  ]

  return (
    <ShellViewContext.Provider value={{ side, setSide, revealSection }}>
      <div className="flex h-dvh flex-col lg:h-screen">
        {/* Mobile-only view switcher. Deliberately NOT the ARIA tabs pattern:
            on desktop both panes render at once with this control hidden, so
            tab/tabpanel semantics would describe a widget that isn't there.
            Two toggle buttons say exactly what this is at every width. */}
        <div className="flex shrink-0 justify-center px-5 pt-4 pb-3 lg:hidden">
          <div className="inline-flex rounded-full bg-surface-raised p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={side === t.id}
                onClick={() => setSide(t.id)}
                className={cn(
                  "t-body inline-flex items-center gap-2 rounded-full px-6 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2",
                  side === t.id ? "bg-accent text-accent-ink" : "text-ink-muted"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="grid min-h-0 flex-1 lg:grid-cols-3">
          <div
            id="pane-left"
            className={cn(
              "min-h-0 lg:col-span-1 lg:block",
              side === "left" ? "block" : "hidden"
            )}
          >
            <Pane label={leftLabel} className="h-full">
              {left}
            </Pane>
          </div>

          <div
            id="pane-right"
            className={cn(
              "min-h-0 lg:col-span-2 lg:block",
              side === "right" ? "block" : "hidden"
            )}
          >
            <Pane label={rightLabel} className="h-full">
              {right}
            </Pane>
          </div>
        </main>
      </div>
    </ShellViewContext.Provider>
  )
}
