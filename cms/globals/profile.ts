import type { GlobalConfig } from "payload"
import { runsEditor } from "@/cms/fields/runs-editor"
import { revalidateGlobal } from "@/cms/hooks/revalidate-site"

export const Profile: GlobalConfig = {
  slug: "profile",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "location",
          type: "text",
          required: true,
          admin: { description: "CV only." },
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            description:
              "Where the site lives. The CV links back to it and to each case study.",
          },
        },
      ],
    },
    {
      name: "intro",
      type: "richText",
      required: true,
      editor: runsEditor,
      admin: {
        description:
          "One paragraph at full contrast. Mark the connective clauses Dim so the phrases around them carry the weight.",
      },
    },
    {
      name: "about",
      type: "richText",
      required: true,
      editor: runsEditor,
      admin: { description: "Company names can link out." },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: { mimeType: { contains: "image" } },
    },
    {
      name: "cv",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: { mimeType: { equals: "application/pdf" } },
      admin: {
        description:
          "Behind the “Download CV” button. `bun run cv` builds the PDF from this content, uploads it and sets it here.",
      },
    },
  ],
}
