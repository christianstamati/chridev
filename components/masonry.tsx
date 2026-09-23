import { cn } from "@/lib/utils"

export type MasonryItem = {
  key: string
  /** width / height, used to estimate column height when balancing. */
  ratio: number
  /**
   * Anything under the tile, such as a caption, in column widths. A column
   * with one caption more can end up the taller one even when its tiles are
   * shorter, so balancing has to count it.
   */
  extra?: number
  node: React.ReactNode
}

/** Height of a tile in units of column width: a tile of ratio r is 1/r tall. */
const tall = (item: MasonryItem) => 1 / (item.ratio || 1) + (item.extra ?? 0)

/**
 * Above this many tiles, "balanced" falls back to greedy packing. The exact
 * split below is exponential, and nothing on this site comes close: the longest
 * case study runs 9 tiles, or 256 combinations of one addition each, resolved
 * once on the server. The cap is here so that stays true if a project grows.
 */
const EXACT_LIMIT = 16

/**
 * Splits items so the LEFT column is never the shorter one. Whatever height is
 * left over lands at the foot of the right column, under the shorter stack,
 * which is where the page wants its slack: the "Start a project" pill sits
 * below the grid on the left, and a short left column strands it under a hole.
 *
 * Exact rather than greedy, because greedy cannot be steered. It leaves the
 * slack wherever the last tile happens to fall, which was the left column on
 * three of the four case studies, and neither flipping the tie-break nor
 * packing back to front fixes every set — both were tried, and both moved
 * item 0 off the top left on the projects they did not fix.
 *
 * So this enumerates the assignments and takes the most balanced one that still
 * puts the left column first on height. Item 0 is pinned left: it is the
 * view-transition morph target, and it has to stay top left. Order within a
 * column stays the authored order, so reading order survives.
 *
 * A solution always exists — everything in the left column satisfies the
 * constraint — so there is no empty case to handle.
 */
function splitExact(items: MasonryItem[]): MasonryItem[][] {
  const heights = items.map(tall)
  const total = heights.reduce((a, b) => a + b, 0)

  // Bit i of `mask` is set when item i + 1 goes right. Item 0 is never in it.
  let best = 0
  let bestGap = total
  for (let mask = 0; mask < 1 << (items.length - 1); mask++) {
    let right = 0
    for (let i = 1; i < items.length; i++) {
      if (mask & (1 << (i - 1))) right += heights[i]
    }
    const gap = total - right - right
    if (gap >= 0 && gap < bestGap) {
      bestGap = gap
      best = mask
    }
  }

  const columns: MasonryItem[][] = [[], []]
  items.forEach((item, i) => {
    columns[i > 0 && best & (1 << (i - 1)) ? 1 : 0].push(item)
  })
  return columns
}

/** Greedy packing into the shortest column. The fallback past EXACT_LIMIT. */
function splitGreedy(items: MasonryItem[]): MasonryItem[][] {
  const columns: MasonryItem[][] = [[], []]
  const heights = [0, 0]
  for (const item of items) {
    const target = heights[0] <= heights[1] ? 0 : 1
    columns[target].push(item)
    heights[target] += tall(item)
  }
  return columns
}

/**
 * Two-column masonry built from flex columns rather than CSS `columns` or a
 * grid with row spans: each tile keeps its own aspect ratio, and nothing is
 * clipped or reflowed mid-column.
 *
 * `distribute` picks how items land in columns:
 *  - "sequential" sends the first half down column one and the rest down
 *    column two, which preserves an author-chosen order. The work grid needs that.
 *  - "balanced" splits them so the columns come out close in height and the
 *    leftover sits on the right. See splitExact.
 */
export function Masonry({
  items,
  distribute = "sequential",
  className,
}: {
  items: MasonryItem[]
  distribute?: "sequential" | "balanced"
  className?: string
}) {
  let columns: MasonryItem[][]

  if (distribute === "sequential") {
    columns = [[], []]
    const half = Math.ceil(items.length / 2)
    items.forEach((item, i) => {
      columns[i < half ? 0 : 1].push(item)
    })
  } else {
    columns =
      items.length > EXACT_LIMIT ? splitGreedy(items) : splitExact(items)
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-(--grid-gap) sm:grid-cols-2",
        className
      )}
    >
      {columns.map((column, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed two-element array, never reordered
        <div key={i} className="flex flex-col gap-(--grid-gap)">
          {column.map((item) => (
            <div key={item.key}>{item.node}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
