"use client"

import { useShellView } from "@/components/two-pane-shell"
import { cn } from "@/lib/utils"

/**
 * Jumps to a section by id, switching panes first when the target lives in the
 * other one. A plain `href="#contact"` cannot do this on mobile: the inactive
 * pane is `display:none`, so the target has no layout box and the browser's
 * fragment scroll silently does nothing.
 */
export function SectionLink({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  const { revealSection } = useShellView()

  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault()
        revealSection(to)
      }}
      className={cn(className)}
    >
      {children}
    </a>
  )
}
