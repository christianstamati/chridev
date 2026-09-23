import type { CollectionConfig } from "payload"

/** Admin accounts. Nobody else logs in. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  versions: false,
  admin: { useAsTitle: "email" },
  fields: [],
}
