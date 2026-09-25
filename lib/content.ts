import config from "@payload-config"
import { getPayload } from "payload"
import { cache } from "react"
import type { Locale } from "@/lib/i18n"
import { lexicalToRuns } from "@/lib/lexical-runs"
import type {
  CaseMedia,
  Contact,
  Profile,
  Project,
  Prose,
  Resume,
} from "@/lib/site-data"
import type { Media, Project as ProjectDoc } from "@/payload-types"

/**
 * Reads the site's content from Payload and hands it back in the shapes in
 * lib/site-data.ts, so components never see a Payload document. Each getter is
 * wrapped in `cache`, so a page and its metadata share one query per render.
 *
 * Every getter takes the locale. A field nobody has translated yet comes back
 * in English, Payload's fallback, so a page is never missing words.
 */

export const cms = () => getPayload({ config })

/** Payload returns `null` for an empty field; the site's types use absence. */
const opt = <T>(value: T | null | undefined) => value || undefined

/** Upload fields come back populated at depth 1. An id means it did not. */
function file(value: number | Media | null | undefined): Media {
  if (typeof value !== "object" || value === null || !value.url) {
    throw new Error(`Media not populated: ${JSON.stringify(value)}`)
  }
  return value
}

/**
 * One line is a paragraph. Several lines are a list of points, with any
 * leading "-" or "•" typed in /admin dropped, since the list adds its own.
 */
function points(text: string): string | string[] {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean)
  return lines.length > 1 ? lines : (lines[0] ?? "")
}

/** A blank line starts a new paragraph. */
function prose(text: string): Prose {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function caseMedia(item: ProjectDoc["media"][number]): CaseMedia {
  const still = file(item.still)
  const { title, text } = item.caption ?? {}
  return {
    src: still.url as string,
    ratio: (still.width ?? 1) / (still.height ?? 1),
    alt: still.alt ?? "",
    video: item.video ? (file(item.video).url as string) : undefined,
    caption: title && text ? { title, text } : undefined,
  }
}

function project(doc: ProjectDoc): Project {
  const media = doc.media.map(caseMedia)
  // The tile is the case study's first frame, so the two can never disagree.
  const lead = media[0]
  return {
    slug: doc.slug,
    title: doc.title,
    categories: doc.categories as [string, ...string[]],
    ratio: lead.ratio,
    cover: lead.src,
    coverVideo: lead.video,
    excerpt: doc.excerpt,
    company: doc.company,
    companyUrl: opt(doc.companyUrl),
    year: opt(doc.year),
    stack: doc.stack?.length ? doc.stack : undefined,
    duration: opt(doc.duration),
    liveUrl: opt(doc.liveUrl),
    role: opt(doc.role),
    team: doc.team?.length
      ? doc.team.map(({ name, role }) => ({ name, role }))
      : undefined,
    challenge: prose(doc.challenge),
    solution: prose(doc.solution),
    results: doc.results ? prose(doc.results) : undefined,
    media,
  }
}

/** In the order set by dragging the list in /admin. */
export const getProjects = cache(async (locale: Locale): Promise<Project[]> => {
  const { docs } = await (await cms()).find({
    collection: "projects",
    sort: "_order",
    pagination: false,
    depth: 1,
    locale,
  })
  return docs.map(project)
})

export const getProject = cache(async (locale: Locale, slug: string) =>
  (await getProjects(locale)).find((p) => p.slug === slug)
)

export const getProfile = cache(async (locale: Locale): Promise<Profile> => {
  const doc = await (await cms()).findGlobal({
    slug: "profile",
    depth: 1,
    locale,
  })
  return {
    name: doc.name,
    role: doc.role,
    // One paragraph on the page, so any extra ones join onto it.
    intro: lexicalToRuns(doc.intro).flat(),
    avatar: file(doc.avatar).url as string,
    location: doc.location,
    url: doc.url,
    cv: file(doc.cv).url as string,
    about: lexicalToRuns(doc.about),
  }
})

export const getResume = cache(async (locale: Locale): Promise<Resume> => {
  const doc = await (await cms()).findGlobal({
    slug: "resume",
    depth: 0,
    locale,
  })
  return {
    skills: (doc.skills ?? []).map(({ title, items }) => ({ title, items })),
    stack: (doc.stack ?? []).map(({ group, items }) => ({
      group,
      items: (items ?? []).map(({ name, href, icon }) => ({
        name,
        href: opt(href),
        icon: opt(icon),
      })),
    })),
    experience: (doc.experience ?? []).map((job) => ({
      role: job.role,
      company: job.company,
      start: job.start,
      end: opt(job.end),
      href: opt(job.href),
      summary: points(job.summary),
    })),
    education: (doc.education ?? []).map((school) => ({
      title: school.title,
      school: school.school,
      period: school.period,
      detail: opt(school.detail),
    })),
    languages: (doc.languages ?? []).map(({ name, level }) => ({
      name,
      level,
    })),
  }
})

export const getContact = cache(async (locale: Locale): Promise<Contact> => {
  const doc = await (await cms()).findGlobal({
    slug: "contact",
    depth: 0,
    locale,
  })
  return {
    heading: doc.heading,
    blurb: doc.blurb,
    email: doc.email,
    socials: (doc.socials ?? []).map(({ label, href }) => ({ label, href })),
  }
})
