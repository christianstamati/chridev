import type { CollectionConfig } from "payload"
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "@/cms/hooks/revalidate-site"

/**
 * Every file the site serves: case-study stills and clips, the avatar and the
 * CV. They live in Vercel Blob and the site links to the blob URL directly, so
 * video never streams through a function.
 *
 * No image sizes: next/image already resizes the stills, and Payload records
 * each image's width and height, which is where a tile's ratio comes from.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  versions: false,
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  upload: { mimeTypes: ["image/*", "video/mp4", "application/pdf"] },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description:
          "What the picture shows, for someone who cannot see it. Required on images.",
      },
      validate: (value: unknown, { data }: { data: { mimeType?: unknown } }) =>
        typeof data?.mimeType === "string" &&
        data.mimeType.startsWith("image/") &&
        !value
          ? "Images need alt text."
          : true,
    },
    {
      name: "sourcePath",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description:
          "The file's path under public/ before the import. The import matches on it, so running it again never duplicates a file.",
      },
    },
  ],
}
