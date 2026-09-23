/**
 * Imports the site's content (scripts/seed/data.ts) and its files into
 * Payload. The files are no longer in the repo: set SEED_FILES to the folder
 * holding the old public/ tree (case/, profile.jpeg and the CV).
 *
 * Usage:  bun run seed
 *         Production: `vercel env pull --environment=production
 *         .env.production.local`, then `NODE_ENV=production bun run payload
 *         migrate` and `NODE_ENV=production bun run seed`. With NODE_ENV set,
 *         that file wins over .env.local. Production's PAYLOAD_SECRET is
 *         sensitive and pulls empty; export any value for these two runs,
 *         which sign nothing. Delete the file afterwards.
 * Reruns: safe. Files match on their public/ path and projects on their slug,
 *         and the globals are overwritten with the same values, so a second
 *         run uploads nothing and creates nothing.
 * Needs:  POSTGRES_URL, BLOB_READ_WRITE_TOKEN, PAYLOAD_SECRET and SEED_FILES.
 */
import { join } from "node:path"
import { cms } from "@/lib/content"
import { runsToLexical } from "@/lib/lexical-runs"
import type { Prose } from "@/lib/site-data"
import {
  contact,
  education,
  experience,
  languages,
  profile,
  projects,
  skills,
  stack,
} from "./seed/data"

const FILES = process.env.SEED_FILES ?? ""
if (!FILES) throw new Error("Set SEED_FILES to the folder with case/ in it.")

const payload = await cms()
// Revalidation needs a Next request. The next build renders whatever is here.
// A fresh object per call: the storage plugin flags `skipCloudStorage` on the
// context it is handed and does not always clear it, so a shared object would
// silently stop every upload after the first.
const context = () => ({ disableRevalidate: true })
const counts = { uploaded: 0, reused: 0, created: 0, updated: 0 }

/** The media doc for a file the site served from public/, uploaded once. */
async function upload(publicPath: string, alt?: string) {
  const { docs } = await payload.find({
    collection: "media",
    where: { sourcePath: { equals: publicPath } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) {
    counts.reused++
    return docs[0]
  }
  const doc = await payload.create({
    collection: "media",
    data: { alt, sourcePath: publicPath },
    filePath: join(FILES, publicPath),
    context: context(),
  })
  counts.uploaded++
  console.log(`uploaded ${publicPath}`)
  return doc
}

const text = (prose: Prose) =>
  typeof prose === "string" ? prose : prose.join("\n\n")

for (const project of projects) {
  // The site now derives the tile from the first frame. Stop rather than
  // import a project whose tile would change.
  const [lead] = project.media
  if (
    project.cover !== lead.src ||
    project.coverVideo !== lead.video ||
    project.ratio !== lead.ratio
  ) {
    throw new Error(`${project.slug}: cover, coverVideo or ratio ≠ media[0]`)
  }

  const media = []
  for (const item of project.media) {
    const still = await upload(item.src, item.alt)
    // Ratios now come from the file's pixels. Say so if one would move.
    const ratio = (still.width ?? 0) / (still.height ?? 1)
    if (Math.abs(ratio - item.ratio) > 0.001) {
      console.warn(`${item.src}: file is ${ratio}, data said ${item.ratio}`)
    }
    const video = item.video ? await upload(item.video) : undefined
    media.push({ still: still.id, video: video?.id, caption: item.caption })
  }

  const data = {
    title: project.title,
    slug: project.slug,
    categories: [...project.categories],
    excerpt: project.excerpt,
    company: project.company,
    companyUrl: project.companyUrl,
    year: project.year,
    role: project.role,
    duration: project.duration,
    stack: project.stack && [...project.stack],
    liveUrl: project.liveUrl,
    team: project.team?.map(({ name, role }) => ({ name, role })),
    challenge: text(project.challenge),
    solution: text(project.solution),
    results: project.results && text(project.results),
    media,
  }

  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: project.slug } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) {
    await payload.update({
      collection: "projects",
      id: docs[0].id,
      data,
      context: context(),
    })
    counts.updated++
  } else {
    // Created in array order, which is the order the list starts in.
    await payload.create({ collection: "projects", data, context: context() })
    counts.created++
  }
}

await payload.updateGlobal({
  slug: "profile",
  data: {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    url: profile.url,
    intro: runsToLexical([profile.intro]),
    about: runsToLexical(profile.about),
    avatar: (await upload(profile.avatar, profile.name)).id,
    cv: (await upload(profile.cv, `${profile.name} CV`)).id,
  },
  context: context(),
})

await payload.updateGlobal({
  slug: "resume",
  data: {
    skills: skills.map(({ title, items }) => ({ title, items: [...items] })),
    stack: stack.map(({ group, items }) => ({
      group,
      items: items.map((item) => ({ ...item })),
    })),
    // A list of points is stored one per line, which is how /admin edits it.
    experience: experience.map((job) => ({
      ...job,
      summary:
        typeof job.summary === "string" ? job.summary : job.summary.join("\n"),
    })),
    education: education.map((school) => ({ ...school })),
    languages: languages.map((language) => ({ ...language })),
  },
  context: context(),
})

await payload.updateGlobal({
  slug: "contact",
  data: {
    heading: contact.heading,
    blurb: contact.blurb,
    email: contact.email,
    socials: contact.socials.map((social) => ({ ...social })),
  },
  context: context(),
})

// A media doc can exist without its file, if the storage plugin skipped the
// upload, so ask for every file the site will link to.
const { docs: files } = await payload.find({
  collection: "media",
  pagination: false,
  depth: 0,
})
const missing = []
for (const file of files) {
  const res = await fetch(file.url as string, { method: "HEAD" })
  if (!res.ok) missing.push(file.sourcePath ?? file.filename)
}
if (missing.length > 0) {
  console.error(`${missing.length} files missing from storage: ${missing}`)
  process.exit(1)
}

console.log(
  `files: ${counts.uploaded} uploaded, ${counts.reused} already there. ` +
    `projects: ${counts.created} created, ${counts.updated} updated. ` +
    "globals: profile, resume, contact written."
)
process.exit(0)
