import type { GlobalConfig } from "payload"
import { revalidateGlobal } from "@/cms/hooks/revalidate-site"
import { STACK_ICONS } from "@/lib/stack-icons"

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

function yearMonth(value: unknown) {
  if (value === undefined || value === null || value === "") return true
  return (typeof value === "string" && YEAR_MONTH.test(value)) || "Use YYYY-MM."
}

/** Skills, stack, experience, education and languages: the site and the CV. */
export const Resume: GlobalConfig = {
  slug: "resume",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Skills",
          description:
            "What I can do, as opposed to the stack, which is what I do it with.",
          fields: [
            {
              name: "skills",
              type: "array",
              labels: { singular: "Skill group", plural: "Skill groups" },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  localized: true,
                },
                {
                  name: "items",
                  type: "text",
                  hasMany: true,
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: "Stack",
          description:
            "Grouped by where a tool sits in the build, which is how the CV prints it. The home page shows it flattened, as the strip under the intro.",
          fields: [
            {
              name: "stack",
              type: "array",
              labels: { singular: "Group", plural: "Groups" },
              fields: [
                {
                  name: "group",
                  type: "text",
                  required: true,
                  localized: true,
                },
                {
                  name: "items",
                  type: "array",
                  labels: { singular: "Tool", plural: "Tools" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "name", type: "text", required: true },
                        { name: "href", type: "text" },
                        {
                          name: "icon",
                          type: "select",
                          options: [...STACK_ICONS],
                          admin: {
                            description:
                              "Brand mark in the strip. Leave empty to show the name alone.",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Experience",
          description:
            "The site prints years, the CV months, both from the same dates.",
          fields: [
            {
              name: "experience",
              type: "array",
              labels: { singular: "Job", plural: "Jobs" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "role",
                      type: "text",
                      required: true,
                      localized: true,
                    },
                    { name: "company", type: "text", required: true },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "start",
                      type: "text",
                      required: true,
                      validate: yearMonth,
                      admin: { placeholder: "YYYY-MM" },
                    },
                    {
                      name: "end",
                      type: "text",
                      validate: yearMonth,
                      admin: {
                        placeholder: "YYYY-MM",
                        description: "Leave empty while the job is current.",
                      },
                    },
                  ],
                },
                {
                  name: "href",
                  type: "text",
                  admin: {
                    description:
                      "The company's site. Leave empty and the name renders as plain text.",
                  },
                },
                {
                  name: "summary",
                  type: "textarea",
                  required: true,
                  localized: true,
                  admin: {
                    description:
                      "One line is a paragraph. Put each point on its own line for a bulleted list.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Education",
          description: "CV only. The site does not list these.",
          fields: [
            {
              name: "education",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "title",
                      type: "text",
                      required: true,
                      localized: true,
                    },
                    { name: "school", type: "text", required: true },
                    {
                      name: "period",
                      type: "text",
                      required: true,
                      admin: { placeholder: "2019 - 2023" },
                    },
                  ],
                },
                { name: "detail", type: "text", localized: true },
              ],
            },
          ],
        },
        {
          label: "Languages",
          description: "CV only.",
          fields: [
            {
              name: "languages",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      required: true,
                      localized: true,
                    },
                    {
                      name: "level",
                      type: "text",
                      required: true,
                      localized: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
