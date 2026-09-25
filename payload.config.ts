import path from "node:path"
import { fileURLToPath } from "node:url"
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import { en } from "@payloadcms/translations/languages/en"
import { it } from "@payloadcms/translations/languages/it"
import { buildConfig } from "payload"
import { Media } from "@/cms/collections/media"
import { Projects } from "@/cms/collections/projects"
import { Users } from "@/cms/collections/users"
import { Contact } from "@/cms/globals/contact"
import { Profile } from "@/cms/globals/profile"
import { Resume } from "@/cms/globals/resume"
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES } from "@/lib/i18n"

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
  },
  collections: [Projects, Media, Users],
  globals: [Profile, Resume, Contact],
  // The admin's own interface. It follows the browser's language, and each
  // editor can change it in their account.
  i18n: {
    supportedLanguages: { en, it },
    fallbackLanguage: DEFAULT_LOCALE,
  },
  // The content. Fields marked `localized` hold one value per locale, and an
  // empty one falls back to English, so a new project shows up in Italian
  // before anyone has translated it.
  localization: {
    locales: LOCALES.map((code) => ({ code, label: LOCALE_NAMES[code] })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // Neon through the Vercel integration. `POSTGRES_URL` must be the pooled
  // connection string (host contains `-pooler.`): @vercel/postgres refuses a
  // direct one. Local dev points it at the Neon `dev` branch.
  db: vercelPostgresAdapter({
    pool: { connectionString: process.env.POSTGRES_URL ?? "" },
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  // Room for screen recordings. Uploads over Vercel's 4.5 MB body limit go
  // straight from the browser to Blob (`clientUploads`).
  upload: { limits: { fileSize: 100_000_000 } },
  storage: [
    vercelBlobStorage({
      // Everything lives under media/ in the store. The site links straight to
      // the blob URL instead of proxying through /api/media/file, which is
      // fine because every file here is public.
      collections: {
        media: { prefix: "media", disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
      clientUploads: true,
      // Blob caches a file for a year, so every upload gets a URL of its own
      // and a replaced file can never be served stale. It also keeps the dev
      // and production databases, which share the store, off each other's files.
      addRandomSuffix: true,
    }),
  ],
})
