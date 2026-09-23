import type { GlobalConfig } from "payload"
import { revalidateGlobal } from "@/cms/hooks/revalidate-site"

export const Contact: GlobalConfig = {
  slug: "contact",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "blurb", type: "textarea", required: true },
    { name: "email", type: "email", required: true },
    {
      name: "socials",
      type: "array",
      admin: {
        description:
          "The CV prints the LinkedIn and GitHub entries, matched by label.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
  ],
}
