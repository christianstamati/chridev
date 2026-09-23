import { IconArrowRight, IconLayoutGrid, IconUser } from "@tabler/icons-react"
import {
  About,
  Contact,
  Experience,
  Footer,
  Intro,
  Skills,
  StackMarquee,
} from "@/components/profile-sections"
import { Reveal } from "@/components/reveal"
import { SectionLink } from "@/components/section-link"
import { TwoPaneShell } from "@/components/two-pane-shell"
import { WorkGrid } from "@/components/work-grid"

/** Sections rendered in the left pane. Drives `#hash` routing between panes. */
const PROFILE_SECTIONS = [
  "intro",
  "about",
  "skills",
  "experience",
  "contact",
] as const

export default function Home() {
  return (
    <TwoPaneShell
      leftLabel="Profile"
      rightLabel="Selected work"
      leftTab="About"
      rightTab="Work"
      leftIcon={<IconUser size={16} aria-hidden />}
      rightIcon={<IconLayoutGrid size={16} aria-hidden />}
      leftSectionIds={PROFILE_SECTIONS}
      rightHashes={["work"]}
      left={
        // Asymmetric on purpose: 20px left / 40px right, matching the
        // reference. The wider right inset keeps the text column from
        // crowding the work grid.
        <div className="flex flex-col gap-(--section-gap) px-5 pt-5 pb-16 lg:pt-[23px] lg:pr-10 lg:pl-5">
          {/* One Reveal per section rather than a single staggered container:
              the column is far taller than the pane, so a shared container
              would fire everything at once while most of it is off-screen. */}
          <Reveal>
            <Intro />
          </Reveal>
          <Reveal>
            <StackMarquee />
          </Reveal>
          <Reveal>
            <About />
          </Reveal>
          <Reveal>
            <Skills />
          </Reveal>
          <Reveal>
            <Experience />
          </Reveal>
          <Reveal>
            <Contact />
          </Reveal>
          <Reveal>
            <Footer />
          </Reveal>
        </div>
      }
      right={
        <div
          id="work"
          className="flex flex-col gap-(--section-gap) px-5 pt-5 pb-16 lg:pt-[17px] lg:pr-(--pane-gutter) lg:pl-0"
        >
          <WorkGrid />

          <div className="flex justify-start">
            <SectionLink
              to="contact"
              className="t-meta inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
            >
              Start a project
              <IconArrowRight size={15} aria-hidden />
            </SectionLink>
          </div>
        </div>
      }
    />
  )
}
