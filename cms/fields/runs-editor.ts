import {
  InlineToolbarFeature,
  LinkFeature,
  lexicalEditor,
  ParagraphFeature,
  TextStateFeature,
} from "@payloadcms/richtext-lexical"

/**
 * The editor for text the site renders as `TextRun`s: paragraphs, external
 * links and one style, Dim, which drops a phrase to muted ink so the phrases
 * around it carry the weight. Nothing else, because nothing else survives the
 * trip back to runs (see lib/lexical-runs.ts).
 */
export const runsEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    LinkFeature({ disableAutoLinks: true, enabledCollections: [] }),
    TextStateFeature({
      state: { tone: { dim: { label: "Dim", css: { opacity: "0.5" } } } },
    }),
    InlineToolbarFeature(),
  ],
})
