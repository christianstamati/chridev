import { IconFileDownload, IconMail } from "@tabler/icons-react"
import Image from "next/image"
import {
  type SimpleIcon,
  siBetterauth,
  siBlender,
  siConvex,
  siDrizzle,
  siFigma,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPayloadcms,
  siReact,
  siShadcnui,
  siTailwindcss,
  siTanstack,
  siThreedotjs,
  siTypescript,
  siUnity,
  siUnrealengine,
  siWebgpu,
} from "simple-icons"
import { Marquee } from "@/components/marquee"
import { ScrollTopButton } from "@/components/scroll-top-button"
import { SectionLink } from "@/components/section-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { getContact, getProfile, getResume } from "@/lib/content"
import { jobPeriod, type TextRun } from "@/lib/site-data"
import type { StackIcon } from "@/lib/stack-icons"
import { cn } from "@/lib/utils"

/**
 * Renders a sequence of text runs, dimming the ones marked `dim`. Emphasis is
 * carried by colour rather than weight. At these sizes a weight jump reads as
 * a different typeface, while a contrast drop recedes.
 */
function RichText({ runs }: { runs: readonly TextRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        const tone = run.dim ? "text-ink-muted" : undefined

        // A run with an `href` becomes an external link. Underlined rather
        // than recoloured: inside a muted paragraph a colour shift alone is
        // invisible, and these sit mid-sentence.
        return run.href ? (
          <a
            // biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered or filtered
            key={i}
            href={run.href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              tone,
              "underline decoration-[color:var(--rule)] underline-offset-4 transition-colors hover:text-ink hover:decoration-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-4"
            )}
          >
            {run.text}
          </a>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered or filtered
          <span key={i} className={tone}>
            {run.text}
          </span>
        )
      })}
    </>
  )
}

/** Shared section wrapper: heading + a hairline rule, then content. */
function Section({
  heading,
  children,
  id,
}: {
  heading: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section id={id} className="flex flex-col">
      {/* The rule underlines the heading rather than floating between it and
          the content: 8px above, 20px below. Equidistant, it belonged to
          neither, which is what made the 18px/16px step feel thin. */}
      <h2 className="t-heading text-ink">{heading}</h2>
      <Separator className="mt-2 mb-5 bg-hairline" />
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export async function Intro() {
  const profile = await getProfile()
  return (
    <section id="intro" className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Image
          src={profile.avatar}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-(--avatar-radius) object-cover"
        />
        <div className="flex min-w-0 flex-col">
          {/* h1 so the page has a level-1 heading; `t-name` carries the styling. */}
          <h1 className="t-name text-ink">{profile.name}</h1>
          <span className="t-body text-ink-muted">{profile.role}</span>
        </div>
        {/* ml-auto keeps the avatar+name group left-aligned at the reference
            offsets while the toggle sits on the far edge. */}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Full-contrast by default; the `dim` runs recede so the phrases
          around them carry the emphasis. */}
      <p className="t-lead text-pretty text-ink">
        <RichText runs={profile.intro} />
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <SectionLink
          to="contact"
          className="t-meta inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
        >
          Get in touch
          <IconMail size={15} aria-hidden />
        </SectionLink>
        {/* Secondary: same size as the primary, on the raised surface the Back
            pill uses instead of the accent. /cv redirects to whichever PDF the
            profile holds now and asks the store to send it as a download, so a
            rebuilt CV needs no redeploy. */}
        <a
          href="/cv"
          className="t-meta inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-raised px-4 py-2 font-semibold text-ink transition-colors hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
        >
          Download CV
          <IconFileDownload size={15} aria-hidden />
        </a>
      </div>
    </section>
  )
}

export async function About() {
  const profile = await getProfile()
  return (
    <Section heading="About me." id="about">
      {/* Direct children of Section, so each paragraph picks up its gap-4. */}
      {profile.about.map((paragraph) => (
        <p
          key={paragraph.map((run) => run.text).join("")}
          className="t-body text-ink-muted"
        >
          <RichText runs={paragraph} />
        </p>
      ))}
    </Section>
  )
}

export async function Skills() {
  const { skills } = await getResume()
  return (
    <Section heading="Skills." id="skills">
      <div className="flex flex-col gap-7">
        {skills.map((group, i) => (
          <div key={group.title} className="flex gap-4">
            <span className="t-body w-6 shrink-0 text-ink-muted">{i + 1}.</span>
            <div className="flex flex-col gap-1.5">
              <h3 className="t-body text-ink">{group.title}</h3>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item} className="t-meta text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/**
 * Brand marks for the strip under the intro, keyed by the `icon` a tool picks
 * in /admin. The options there come from the same list, so an option without a
 * mark here is a type error rather than a silently missing mark. A tool with
 * no icon (React Three Fiber, TSL) shows as its name alone.
 */
const STACK_MARKS: Record<StackIcon, SimpleIcon> = {
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  tanstack: siTanstack,
  tailwindcss: siTailwindcss,
  shadcnui: siShadcnui,
  threedotjs: siThreedotjs,
  webgpu: siWebgpu,
  unrealengine: siUnrealengine,
  unity: siUnity,
  nodedotjs: siNodedotjs,
  convex: siConvex,
  mongodb: siMongodb,
  drizzle: siDrizzle,
  payloadcms: siPayloadcms,
  betterauth: siBetterauth,
  blender: siBlender,
  figma: siFigma,
}

/**
 * The stack as a drifting row of marks, where a portfolio would usually put
 * client logos. Everything is one muted grey, so no brand colour pulls the eye
 * out of the column. Not links, because dragging and clicking would fight.
 */
export async function StackMarquee() {
  const { stack } = await getResume()
  const tools = stack.flatMap((group) => group.items)

  return (
    <div className="border-hairline border-y py-12">
      <Marquee>
        {tools.map((tool) => {
          const mark = tool.icon && STACK_MARKS[tool.icon]
          return (
            <span
              key={tool.name}
              className="t-lead inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap font-medium text-ink-muted"
            >
              {mark && (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-7 shrink-0 fill-current"
                >
                  <path d={mark.path} />
                </svg>
              )}
              {tool.name}
            </span>
          )
        })}
      </Marquee>
    </div>
  )
}

export async function Experience() {
  const { experience } = await getResume()
  return (
    <Section heading="Experience." id="experience">
      <ol className="flex flex-col gap-7">
        {experience.map((job) => (
          <li key={`${job.role}-${job.start}`} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="t-body text-ink">{job.role}</h3>
              <span className="t-meta shrink-0 text-ink-muted">
                {jobPeriod(job, "year")}
              </span>
            </div>
            {/* The company name links out when the job carries an `href`.
                Underlined like the contact links so it reads as actionable;
                a bare colour shift is too quiet at this size. */}
            {job.href ? (
              <a
                href={job.href}
                target="_blank"
                rel="noreferrer noopener"
                className="t-meta w-fit text-ink-muted underline decoration-[color:var(--rule)] underline-offset-4 transition-colors hover:text-ink hover:decoration-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-4"
              >
                {job.company}
              </a>
            ) : (
              <span className="t-meta text-ink-muted">{job.company}</span>
            )}
            <p className="t-meta mt-2 text-ink-muted">{job.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export async function Contact() {
  const contact = await getContact()
  return (
    <Section heading={contact.heading} id="contact">
      <p className="t-body text-ink-muted">{contact.blurb}</p>

      {/* Underlines mark these as the section's actionable bits. The heading
          and blurb above are the only non-links here, so without them the
          block reads as flat text. */}
      <div className="mt-2 flex flex-col items-start gap-2">
        <a
          href={`mailto:${contact.email}`}
          className="t-lead wrap-anywhere text-ink underline decoration-[color:var(--rule)] underline-offset-[6px] transition-colors hover:decoration-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-4"
        >
          {contact.email}
        </a>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {contact.socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="t-body text-ink-muted underline decoration-[color:var(--rule)] underline-offset-[6px] transition-colors hover:text-ink hover:decoration-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-4"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export async function Footer() {
  const profile = await getProfile()
  return (
    <footer className="flex flex-col pt-2">
      <Separator className="mb-5 bg-hairline" />
      <div className="flex items-center justify-between gap-4">
        <span className="t-meta text-ink-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
        <ScrollTopButton />
      </div>
    </footer>
  )
}
