/**
 * The shapes the site renders. The words themselves live in Payload (/admin);
 * `lib/content.ts` reads them and maps every document onto these types, so no
 * component ever sees a Payload document.
 */

import type { StackIcon } from "@/lib/stack-icons"

/**
 * A run of text with optional emphasis. `dim: true` drops the run to muted ink,
 * which pushes the phrases around it forward. The lead paragraph runs at full
 * contrast by default and the connective clauses recede.
 */
export type TextRun = { text: string; dim?: boolean; href?: string }

export type Profile = {
  name: string
  role: string
  intro: TextRun[]
  avatar: string
  location: string
  /** Where the site lives. The CV links back to it and to each case study. */
  url: string
  /** The PDF behind the "Download CV" button. */
  cv: string
  /** One paragraph per entry, each a run list so company names can link out. */
  about: TextRun[][]
}

/**
 * What I can do, as opposed to `stack`, which is what I do it with. Every line
 * is backed by something in `experience` or `projects`.
 */
export type SkillGroup = { title: string; items: string[] }

/**
 * Grouped by where a tool sits in the build, which is how the CV prints it.
 * The home page shows the same list, flattened, as the strip under the intro.
 */
export type StackGroup = {
  group: string
  items: { name: string; href?: string; icon?: StackIcon }[]
}

/**
 * Dates are `YYYY-MM`. The site prints years and the CV prints months, both
 * through `jobPeriod`, so the two cannot disagree.
 */
export type Job = {
  role: string
  company: string
  start: string
  /** Omit while the job is current. */
  end?: string
  /** The company's site. Omit it and the name renders as plain text. */
  href?: string
  summary: string
}

/** CV only. The site does not list these. */
export type Education = {
  title: string
  school: string
  period: string
  detail?: string
}

/** CV only. */
export type Language = { name: string; level: string }

export type Contact = {
  heading: string
  blurb: string
  email: string
  socials: { label: string; href: string }[]
}

export type Resume = {
  skills: SkillGroup[]
  stack: StackGroup[]
  experience: Job[]
  education: Education[]
  languages: Language[]
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * "2021–2026" for the site, "Apr 2021 - Jun 2026" for the CV. A job inside one
 * year prints that year once on the site, since "2021–2021" says nothing. The
 * CV takes a plain hyphen rather than the en dash: some applicant tracking
 * systems do not read the dash as a range.
 */
export function jobPeriod(job: Job, precision: "year" | "month") {
  const fmt = (date: string) => {
    const [year, month] = date.split("-")
    return precision === "year" ? year : `${MONTHS[Number(month) - 1]} ${year}`
  }
  const start = fmt(job.start)
  const end = job.end ? fmt(job.end) : "Present"
  if (precision === "year") return start === end ? start : `${start}–${end}`
  return `${start} - ${end}`
}

export type CaseMedia = {
  /**
   * The still. When `video` is set this doubles as the poster, so it should be
   * a frame of that clip. The reader looks at it until the clip is in view and
   * decoded, and a different shot makes the swap read as a glitch.
   */
  src: string
  /**
   * width / height of the tile. Every frame is a finished mockup, so this is
   * the crop the build script took around the device, never into the UI.
   * Read off the still's pixel size.
   */
  ratio: number
  /** What this frame shows. Used as the alt text. */
  alt: string
  /**
   * The MP4, when this frame is a silent, looping clip rather than a still.
   * H.264 plays in every browser, so it is the only encode.
   */
  video?: string
  /**
   * Shown under the frame. `title` names the feature, `text` says what it
   * does. Not a repeat of `alt`, which describes the picture for someone who
   * cannot see it.
   */
  caption?: { title: string; text: string }
}

/** A case-study section's body. An array is one paragraph per entry. */
export type Prose = string | readonly string[]

export type Project = {
  slug: string
  title: string
  /**
   * What kind of project this is, most telling first. The work-grid tile has
   * room for one, so it shows the first; the case-study meta grid lists them
   * all, one per line.
   */
  categories: readonly [string, ...string[]]
  /** Grid aspect ratio, which drives the masonry rhythm. Always media[0].ratio. */
  ratio: number
  /** Always media[0].src. */
  cover: string
  /**
   * Silent loop for the work-grid tile, played on hover and keyboard focus.
   * Always media[0].video, so its first frame is `cover` and starting playback
   * does not jump.
   */
  coverVideo?: string
  excerpt: string
  company: string
  /** The company's site, shown as a link in the case-study meta grid. */
  companyUrl?: string
  /** Meta-grid values. Left off when there is nothing worth printing. */
  year?: string
  /** What it was built with, tools only. One per line in the meta grid. */
  stack?: readonly string[]
  duration?: string
  liveUrl?: string
  /** Your job on the project, shown in the meta grid. */
  role?: string
  /** Credited collaborators. Omit on solo work. */
  team?: readonly { name: string; role: string }[]
  challenge: Prose
  solution: Prose
  /** What shipped and how it landed. Omit while a project is in flight. */
  results?: Prose
  /**
   * The case-study grid. Item 0 is the view-transition morph target and the
   * work-grid tile, so the tile and the morph can never disagree on shape.
   */
  media: readonly CaseMedia[]
}
