import type { CollectionConfig, Field } from "payload"
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "@/cms/hooks/revalidate-site"

/** A case-study section. A blank line starts a new paragraph. */
function prose(name: string, required: boolean, description?: string): Field {
  return {
    name,
    type: "textarea",
    required,
    localized: true,
    admin: {
      description: description ?? "A blank line starts a new paragraph.",
      rows: 8,
    },
  }
}

export const Projects: CollectionConfig = {
  slug: "projects",
  // Drag to reorder in the list view; the site sorts by the same order.
  orderable: true,
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "company", "year"],
    description:
      "Drag to reorder. The home grid fills column-major: the first half of this list stacks in the left column, the rest in the right. Keep the left column the taller of the two, or the “Start a project” pill ends up stranded below a hole.",
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "The URL: /projects/<slug>." },
    },
    {
      name: "categories",
      type: "text",
      hasMany: true,
      required: true,
      localized: true,
      minRows: 1,
      admin: {
        description:
          "Most telling first. The grid tile has room for one, so it shows the first.",
      },
    },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    {
      type: "row",
      fields: [
        { name: "company", type: "text", required: true },
        {
          name: "companyUrl",
          type: "text",
          admin: { description: "Links the company in the meta grid." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "year", type: "text" },
        {
          name: "role",
          type: "text",
          localized: true,
          admin: { description: "Your job on the project." },
        },
        { name: "duration", type: "text", localized: true },
      ],
    },
    {
      name: "stack",
      type: "text",
      hasMany: true,
      admin: { description: "What it was built with, tools only." },
    },
    { name: "liveUrl", type: "text" },
    {
      name: "team",
      type: "array",
      admin: {
        description: "Credited collaborators. Leave empty on solo work.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "role", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
    prose("challenge", true),
    prose("solution", true),
    prose(
      "results",
      false,
      "What shipped and how it landed. Leave empty while a project is in flight. A blank line starts a new paragraph."
    ),
    {
      name: "media",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description:
          "The case-study grid, in reading order. The first item is also the home-grid tile and the view-transition target, so its shape sets the tile's.",
      },
      fields: [
        {
          name: "still",
          type: "upload",
          relationTo: "media",
          required: true,
          filterOptions: { mimeType: { contains: "image" } },
          admin: {
            description:
              "A finished mockup, cropped around the device, never into the UI. With a clip, this is its first frame.",
          },
        },
        {
          name: "video",
          type: "upload",
          relationTo: "media",
          filterOptions: { mimeType: { contains: "video" } },
          admin: {
            description: "Optional silent H.264 loop. Leave empty for a still.",
          },
        },
        {
          name: "caption",
          type: "group",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  admin: { description: "Names the feature." },
                },
                {
                  name: "text",
                  type: "text",
                  localized: true,
                  admin: { description: "Says what it does." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
