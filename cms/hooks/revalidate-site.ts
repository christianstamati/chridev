import { revalidatePath } from "next/cache"
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  RequestContext,
} from "payload"

/**
 * Every page is prerendered from Payload at build time, so a save has to tell
 * Next to render them again. The site is five pages, so any save revalidates
 * all of them rather than working out which ones it touched.
 *
 * Scripts (the import, the CV build) pass `disableRevalidate`: revalidatePath
 * only works inside a Next request.
 */
function revalidateSite(context: RequestContext) {
  if (context.disableRevalidate) return
  revalidatePath("/", "layout")
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  doc,
  context,
}) => {
  revalidateSite(context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  context,
}) => {
  revalidateSite(context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}
