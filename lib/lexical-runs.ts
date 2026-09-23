import type { TextRun } from "@/lib/site-data"
import type { Profile } from "@/payload-types"

/**
 * The trip between Payload's rich text and the site's `TextRun`s, both ways.
 * The editor behind it (cms/fields/runs-editor.ts) allows paragraphs, external
 * links and the Dim style, so that is all that has to survive.
 *
 * Dim is a Lexical text state, which Lexical keeps under the node's `$` key:
 * `{ type: "text", text, $: { tone: "dim" } }`.
 */

type RichText = Profile["intro"]

type Node = {
  type: string
  text?: string
  $?: { tone?: string }
  fields?: { linkType?: string; url?: string }
  children?: Node[]
}

/** One run list per non-empty paragraph. */
export function lexicalToRuns(state: RichText | null | undefined): TextRun[][] {
  const paragraphs = (state?.root.children ?? []) as Node[]
  return paragraphs
    .filter((node) => node.type === "paragraph")
    .map((paragraph) => runs(paragraph.children ?? []))
    .filter((paragraph) => paragraph.length > 0)
}

function runs(nodes: Node[], href?: string): TextRun[] {
  return nodes.flatMap((node): TextRun[] => {
    if (node.type === "text" && node.text) {
      return [
        {
          text: node.text,
          ...(node.$?.tone === "dim" && { dim: true }),
          ...(href && { href }),
        },
      ]
    }
    if (node.type === "link" || node.type === "autolink") {
      const url =
        node.fields?.linkType === "custom" ? node.fields.url : undefined
      return runs(node.children ?? [], url ?? href)
    }
    return []
  })
}

const element = { direction: null, format: "", indent: 0, version: 1 } as const

/** The inverse, for the import: each run list becomes one paragraph. */
export function runsToLexical(
  paragraphs: readonly (readonly TextRun[])[]
): RichText {
  return {
    root: {
      ...element,
      type: "root",
      children: paragraphs.map((paragraph) => ({
        ...element,
        type: "paragraph",
        textFormat: 0,
        textStyle: "",
        children: paragraph.map((run) => {
          const text = {
            type: "text",
            text: run.text,
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            version: 1,
            ...(run.dim && { $: { tone: "dim" } }),
          } as const
          if (!run.href) return text
          return {
            ...element,
            version: 3,
            type: "link",
            fields: { linkType: "custom", url: run.href, newTab: true },
            children: [text],
          } as const
        }),
      })),
    },
  } as RichText
}
