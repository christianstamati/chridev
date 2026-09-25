import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconFileText,
  IconPhoto,
} from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ViewTransition } from "react"
import { CaseFrame } from "@/components/case-media"
import { LocaleSwitch } from "@/components/locale-switch"
import { Masonry } from "@/components/masonry"
import { Contact, Footer } from "@/components/profile-sections"
import { Reveal } from "@/components/reveal"
import { SectionLink } from "@/components/section-link"
import { TwoPaneShell } from "@/components/two-pane-shell"
import { Separator } from "@/components/ui/separator"
import { getProject, getProjects } from "@/lib/content"
import { alternates, getDictionary, getLocale } from "@/lib/locale"
import type { Prose } from "@/lib/site-data"

export async function generateStaticParams() {
  return (await getProjects(await getLocale())).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(await getLocale(), slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.excerpt,
    alternates: await alternates(`/projects/${slug}`),
  }
}

/** A meta-grid value as a list: nothing, one value or several. */
function list(value: string | readonly string[] | undefined) {
  if (value === undefined) return []
  return typeof value === "string" ? [value] : value
}

/** One `<p>` per paragraph, spaced like the About section on the home page. */
function Paragraphs({ text }: { text: Prose }) {
  const paragraphs = typeof text === "string" ? [text] : text
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="t-body text-ink-muted">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

/**
 * A caption's height in column widths, for balancing the masonry. One line plus
 * its padding is about 45px against a 470px column at 1440 wide, and captions
 * wrap to two lines on narrower screens, so this errs high.
 */
const CAPTION_HEIGHT = 0.12

/**
 * Names the feature a frame shows. More space under than over, so a caption
 * reads as belonging to the frame above it rather than the one below.
 */
function Caption({ title, text }: { title: string; text: string }) {
  return (
    <figcaption className="t-meta pt-2 pb-4 text-ink-muted">
      <span className="text-ink">{title}</span> {text}
    </figcaption>
  )
}

/** Sections rendered in the left pane. Drives `#hash` routing between panes. */
const CASE_SECTIONS = [
  "overview",
  "challenge",
  "solution",
  "results",
  "team",
  "contact",
] as const

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await params
  const locale = await getLocale()
  const [project, t] = await Promise.all([
    getProject(locale, slug),
    getDictionary(),
  ])
  if (!project) notFound()

  // Every row is a list, so a single value and several render the same way.
  // Category sits beside Stack: both run to a few lines, and side by side
  // the row stays level.
  const meta = [
    {
      label: t.project.company,
      values: list(project.company),
      href: project.companyUrl,
    },
    { label: t.project.year, values: list(project.year) },
    { label: t.project.category, values: list(project.categories) },
    { label: t.project.stack, values: list(project.stack) },
    { label: t.project.role, values: list(project.role) },
    { label: t.project.duration, values: list(project.duration) },
  ].filter((m) => m.values.length > 0)

  return (
    <TwoPaneShell
      leftLabel={t.project.details(project.title)}
      rightLabel={t.project.images(project.title)}
      leftTab={t.project.detailsTab}
      rightTab={t.project.imagesTab}
      leftIcon={<IconFileText size={16} aria-hidden />}
      rightIcon={<IconPhoto size={16} aria-hidden />}
      leftSectionIds={CASE_SECTIONS}
      rightHashes={["images"]}
      left={
        // Same 20/40 asymmetry as the home page's left pane.
        <div className="flex flex-col gap-(--section-gap) px-5 pt-5 pb-16 lg:pt-[23px] lg:pr-10 lg:pl-5">
          <section id="overview" className="flex flex-col gap-6">
            {/* Subtle filled pill rather than a bare link. It shares the raised
                surface with the mobile pane toggle. shadcn's `secondary`
                variant isn't used here: the shell never sets the `.dark` class,
                so that token resolves to the light palette and renders white. */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/${locale}#work`}
                className="t-meta inline-flex w-fit items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5 text-ink transition-colors hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
              >
                <IconArrowLeft size={13} aria-hidden />
                {t.project.back}
              </Link>
              <LocaleSwitch label={t.language} />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="t-name text-ink">{project.title}</h1>
              <p className="t-lead text-balance text-ink-muted">
                {project.excerpt}
              </p>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="t-meta inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
              >
                {t.project.live}
                <IconArrowUpRight size={15} aria-hidden />
              </a>
            )}

            <Separator className="bg-hairline" />

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {meta.map((m) => (
                // One <dd> per value under a shared <dt>, which is how a
                // description list spells a term with several values. The
                // margin sits under the label rather than a gap on the group,
                // so stacked values keep plain line spacing.
                <div key={m.label} className="flex flex-col">
                  <dt className="t-meta mb-1 text-ink-muted">{m.label}</dt>
                  {m.values.map((value) => (
                    <dd key={value} className="t-body text-ink">
                      {m.href ? (
                        <a
                          href={m.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline decoration-[color:var(--rule)] underline-offset-4 transition-colors hover:text-ink hover:decoration-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-4"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </section>

          {/* The overview block above is deliberately not animated: it lands
              during the view transition, and a second fade on top of the morph
              reads as a stutter. Everything below it is fair game. */}
          <Reveal>
            <section id="challenge" className="flex flex-col">
              <h2 className="t-heading text-ink">{t.project.challenge}</h2>
              <Separator className="mt-2 mb-5 bg-hairline" />
              <Paragraphs text={project.challenge} />
            </section>
          </Reveal>

          <Reveal>
            <section id="solution" className="flex flex-col">
              <h2 className="t-heading text-ink">{t.project.solution}</h2>
              <Separator className="mt-2 mb-5 bg-hairline" />
              <Paragraphs text={project.solution} />
            </section>
          </Reveal>

          {project.results && (
            <Reveal>
              <section id="results" className="flex flex-col">
                <h2 className="t-heading text-ink">{t.project.results}</h2>
                <Separator className="mt-2 mb-5 bg-hairline" />
                <Paragraphs text={project.results} />
              </section>
            </Reveal>
          )}

          {project.team && project.team.length > 0 && (
            <Reveal>
              <section id="team" className="flex flex-col">
                <h2 className="t-heading text-ink">{t.project.team}</h2>
                <Separator className="mt-2 mb-5 bg-hairline" />
                <ul className="flex flex-col gap-2">
                  {project.team.map((member) => (
                    <li
                      key={member.name}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span className="t-body text-ink">{member.name}</span>
                      <span className="t-meta shrink-0 text-ink-muted">
                        {member.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          <Reveal>
            <Contact />
          </Reveal>
          <Reveal>
            <Footer />
          </Reveal>
        </div>
      }
      right={
        // Same padding as the work grid on the home page, so the images sit in
        // the same place when a tile morphs into this page's first frame.
        <div
          id="images"
          className="flex flex-col gap-(--section-gap) px-5 pt-5 pb-16 lg:pt-[17px] lg:pr-(--pane-gutter) lg:pl-0"
        >
          <Masonry
            // Balanced packing: image 1's ratio changes per project (it has to
            // match that project's grid tile), so a fixed split would leave the
            // columns lopsided on some projects and not others.
            distribute="balanced"
            // The map returns MasonryItem objects carrying an explicit
            // `key`, which Masonry applies to the element it renders.
            items={project.media.map((item, i) => {
              const frame = (
                // biome-ignore lint/correctness/useJsxKeyInIterable: keyed by Masonry via item.key
                <CaseFrame media={item} labels={t.media} priority={i === 0} />
              )
              const caption = item.caption && <Caption {...item.caption} />

              return {
                key: item.src,
                ratio: item.ratio,
                extra: item.caption ? CAPTION_HEIGHT : 0,
                // Item 0 is the morph target: it shares a name with the grid
                // tile on the home page, so the browser animates one element
                // moving rather than a tile vanishing and a hero appearing.
                // It gets NO reveal, because fading in an element the
                // browser is already morphing would fight the transition.
                // Its caption stays outside the ViewTransition, since the grid
                // tile has none and the morph would stretch to take it in.
                node:
                  i === 0 ? (
                    <figure>
                      <ViewTransition
                        name={`project-${project.slug}`}
                        share="morph"
                        default="none"
                      >
                        {frame}
                      </ViewTransition>
                      {caption}
                    </figure>
                  ) : (
                    <Reveal>
                      <figure>
                        {frame}
                        {caption}
                      </figure>
                    </Reveal>
                  ),
              }
            })}
          />

          {/* The same pill the work grid ends with on the home page, and the
              same --section-gap from the images. A page footer is exactly what
              the caption that used to sit here could not be, which is why that
              one needed a wrapper to hold it close and this one does not.

              SectionLink rather than href="#contact": the target is in the
              other pane, and on mobile that pane is display:none, so a bare
              fragment link has nothing to scroll to. */}
          <div className="flex justify-start">
            <SectionLink
              to="contact"
              className="t-meta inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
            >
              {t.startProject}
              <IconArrowRight size={15} aria-hidden />
            </SectionLink>
          </div>
        </div>
      }
    />
  )
}
