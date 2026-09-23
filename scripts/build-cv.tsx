/**
 * Builds the PDF behind the "Download CV" button from the content in Payload,
 * so the CV says exactly what the site says and changes when it does.
 *
 * Usage:  bun run cv
 * Writes: a new file in the media collection, then points the profile's `cv`
 *         at it. Every upload gets its own URL, so no cache serves the old
 *         one, and /cv follows the profile, so there is nothing to redeploy.
 *         Over the page limit it uploads nothing and leaves the PDF in the
 *         temp directory to look at.
 * Needs:  Google Chrome, which prints the page. Set CHROME if it is not in
 *         /Applications. A network connection, for the Geist font file.
 *         The database and Blob env vars, as for `bun run dev`.
 *
 * Laid out for applicant tracking systems first. They read the PDF's text layer
 * top to bottom, so everything here follows from that:
 *   - One column. Two columns came out interleaved: the sidebar's Education
 *     landed in the middle of a project.
 *   - No ligatures. With them on, "configurator" is extracted as "conﬁgurator",
 *     one glyph for "fi", and a keyword search for it misses.
 *   - Standard section names, no trailing full stop, so a parser can map them.
 *   - Company and dates on the line under each title, in the text flow rather
 *     than floated right, where extractors split them off into their own block.
 *   - Every link printed as its address, since parsers keep text and drop links.
 *   - Plain separators: pipes and commas, never a middle dot.
 * It still echoes the site: Geist, the same ink and greys, and the intro's
 * dimmed runs.
 */
import { spawn } from "node:child_process"
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"

import {
  cms,
  getContact,
  getProfile,
  getProjects,
  getResume,
} from "@/lib/content"
import { jobPeriod } from "@/lib/site-data"

const [profile, contact, projects, resume] = await Promise.all([
  getProfile(),
  getContact(),
  getProjects(),
  getResume(),
])
const { skills, stack, experience, education, languages } = resume

/**
 * The most recent projects only, newest first. The rest stay on the site. A
 * tie keeps the site's order, since the sort is stable, and a project with no
 * year goes last.
 */
const CV_PROJECTS = 3
const recent = [...projects]
  .sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""))
  .slice(0, CV_PROJECTS)

const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

/** "https://www.naba.it/en/" -> "naba.it/en", for links printed as text. */
const bare = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

/** A link whose visible text is its own address. */
function Url({ href }: { href: string }) {
  return <a href={href}>{bare(href)}</a>
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

/** "Frontend: a, b, c". The label is bold so the eye finds it; text reads flat. */
function Line({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <p className="line">
      <strong>{label}:</strong> {items.join(", ")}
    </p>
  )
}

function Cv() {
  const socials = ["LinkedIn", "GitHub"].flatMap((label) =>
    contact.socials.filter((s) => s.label === label)
  )

  return (
    <main>
      <header>
        <h1>{profile.name}</h1>
        <p className="role">
          {profile.role} | {profile.location}
        </p>
        <p className="contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          {" | "}
          <Url href={profile.url} />
          {socials.map((s) => (
            <span key={s.href}>
              {" | "}
              <Url href={s.href} />
            </span>
          ))}
        </p>
      </header>

      <Section title="Summary">
        <p className="intro">
          {profile.intro.map((run) => (
            <span key={run.text} className={run.dim ? "dim" : undefined}>
              {run.text}
            </span>
          ))}
        </p>
      </Section>

      <Section title="Experience">
        {experience.map((job) => (
          <article key={`${job.role}-${job.start}`} className="entry">
            <h3>{job.role}</h3>
            <p className="meta">
              {job.company} | {jobPeriod(job, "month")}
            </p>
            {typeof job.summary === "string" ? (
              <p>{job.summary}</p>
            ) : (
              <ul>
                {job.summary.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </Section>

      <Section title="Projects">
        {recent.map((project) => {
          const caseStudy = `${profile.url}/projects/${project.slug}`
          // The company only when it adds something: HRX's is its title.
          const meta = [
            project.company !== project.title && project.company,
            project.year,
            project.stack?.join(", "),
          ]
            .filter(Boolean)
            .join(" | ")
          return (
            <article key={project.slug} className="entry">
              <h3>{project.title}</h3>
              {meta && <p className="meta">{meta}</p>}
              <p>{project.excerpt}</p>
              {/* The case study only. It links onward to the live product
                  where there is one, so the CV does not repeat it. */}
              <p className="meta">
                Case study: <Url href={caseStudy} />
              </p>
            </article>
          )
        })}
      </Section>

      <Section title="Skills">
        {skills.map((group) => (
          <Line key={group.title} label={group.title} items={group.items} />
        ))}
      </Section>

      <Section title="Technologies">
        {stack.map((group) => (
          <Line
            key={group.group}
            label={group.group}
            items={group.items.map((item) => item.name)}
          />
        ))}
      </Section>

      <Section title="Education">
        {education.map((school) => (
          <article key={school.title} className="entry">
            <h3>{school.title}</h3>
            <p className="meta">
              {school.school} | {school.period}
            </p>
            {school.detail && <p>{school.detail}</p>}
          </article>
        ))}
      </Section>

      <Section title="Languages">
        <p>
          {languages
            .map((l) => `${l.name} (${l.level.toLowerCase()})`)
            .join(", ")}
        </p>
      </Section>
    </main>
  )
}

/**
 * Geist, the site's font, from the same place next/font/google gets it, saved
 * locally so Chrome has it in hand before it prints. Loading it from the page
 * instead races the print.
 *
 * Static weights, not the variable font the site uses. Chrome prints a
 * variable font as Type 3, every glyph a drawing, and some applicant tracking
 * systems read Type 3 text badly. Google's CSS API sends one static TTF per
 * weight to a client that does not say it is a modern browser, so this sends
 * no user agent at all.
 */
async function geist(dir: string, weights: readonly number[]) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Geist:wght@${weights.join(";")}&display=block`,
    { headers: { "user-agent": "" } }
  ).then((r) => r.text())
  const faces = [
    ...css.matchAll(/font-weight: (\d+);[^}]*?url\((https:[^)]+\.ttf)\)/g),
  ]
  if (faces.length !== weights.length) {
    throw new Error(
      `Google Fonts returned ${faces.length} Geist TTFs for ${weights.length} weights`
    )
  }
  const rules = await Promise.all(
    faces.map(async ([, weight, url]) => {
      const file = join(dir, `geist-${weight}.ttf`)
      writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()))
      return `@font-face {
  font-family: Geist;
  font-weight: ${weight};
  src: url("file://${file}") format("truetype");
}`
    })
  )
  return rules.join("\n")
}

const work = mkdtempSync(join(tmpdir(), "cv-"))

// Plain CSS rather than Tailwind: nothing here runs the Tailwind build, and a
// printed page wants physical units anyway. Colours are the site's light theme.
// Margins live on @page, so a second page gets them too.
const CSS = `
${await geist(work, [400, 500])}
@page { size: A4; margin: 15mm 17mm 14mm; }
* { box-sizing: border-box; }
html { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
body {
  margin: 0;
  font-family: Geist, Helvetica, Arial, sans-serif;
  font-size: 9.5pt;
  line-height: 1.4;
  color: #121212;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0, "clig" 0, "dlig" 0;
}
h1, h2, h3, p { margin: 0; }
a { color: inherit; text-decoration: underline; text-decoration-color: rgba(0, 0, 0, 0.25); text-underline-offset: 2px; }
h1 { font-size: 22pt; font-weight: 500; line-height: 1.1; }
.role { margin-top: 1.5mm; font-size: 11pt; color: #6b6b6b; }
.contact { margin-top: 2mm; }
.intro { font-size: 10.5pt; line-height: 1.4; }
.dim, .meta { color: #6b6b6b; }
section { margin-top: 6mm; }
h2 {
  margin-bottom: 2.6mm;
  padding-bottom: 1.4mm;
  border-bottom: 0.5pt solid rgba(0, 0, 0, 0.16);
  font-size: 11pt;
  font-weight: 500;
  break-after: avoid;
}
h3 { font-size: 10pt; font-weight: 500; }
strong { font-weight: 500; }
.entry { break-inside: avoid; }
.entry + .entry { margin-top: 3.4mm; }
.entry p + p { margin-top: 0.8mm; }
.entry ul { margin: 0.8mm 0 0; padding-left: 4mm; }
.entry li + li { margin-top: 0.4mm; }
.line + .line { margin-top: 1mm; }
`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${profile.name} CV</title>
<style>${CSS}</style>
</head>
<body>${renderToStaticMarkup(<Cv />)}</body>
</html>`

/** Resolves once `path` exists and has stopped growing. */
async function settled(path: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs
  let last = -1
  while (Date.now() < deadline) {
    const size = existsSync(path) ? statSync(path).size : 0
    if (size > 0 && size === last) return
    last = size
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Chrome did not write ${path} in ${timeoutMs / 1000}s`)
}

// Outside `work`, which goes when Chrome is done, so an over-long PDF can
// still be opened.
const date = new Date().toISOString().slice(0, 10)
const name = profile.name.toLowerCase().replaceAll(" ", "-")
const out = join(tmpdir(), `${name}-cv-${date}.pdf`)
const page = join(work, "cv.html")
writeFileSync(page, html)
// Otherwise `settled` could pick up the last build before Chrome replaces it.
rmSync(out, { force: true })

// Its own profile directory, so a Chrome you have open does not get in the
// way. Local fonts hold the load event, and Chrome prints after it.
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${join(work, "profile")}`,
    `--print-to-pdf=${out}`,
    `file://${page}`,
  ],
  { stdio: "ignore" }
)
const exited = new Promise((resolve) => chrome.once("exit", resolve))
try {
  // Wait on the file, not the process: Chrome 154 writes the PDF and then
  // never exits on its own, with or without any of the usual quieting flags.
  await settled(out, 60_000)
} finally {
  chrome.kill()
  await exited
  rmSync(work, { recursive: true, force: true })
}

// Two pages is normal for a CV a parser reads; a third usually means the copy
// grew. Say so rather than letting it ship quietly.
const MAX_PAGES = 2
const pages =
  readFileSync(out)
    .toString("latin1")
    .match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0
console.log(`wrote ${out} (${pages} page${pages === 1 ? "" : "s"})`)
if (pages > MAX_PAGES) {
  console.error(`over ${MAX_PAGES} pages, so not uploaded`)
  process.exit(1)
}

// Revalidation needs a Next request, and /cv reads the profile per request
// anyway, so there is nothing to revalidate.
// A fresh context per call: the storage plugin flags the object it is handed.
const payload = await cms()
const pdf = await payload.create({
  collection: "media",
  data: { alt: `${profile.name} CV` },
  filePath: out,
  context: { disableRevalidate: true },
})
await payload.updateGlobal({
  slug: "profile",
  data: { cv: pdf.id },
  context: { disableRevalidate: true },
})
rmSync(out, { force: true })
// Read it back: the storage plugin renames the file after `create` returns.
const { url } = await payload.findByID({ collection: "media", id: pdf.id })
console.log(`uploaded ${url} and set it as the profile CV`)
