import { Masonry } from "@/components/masonry"
import { ProjectCard } from "@/components/project-card"
import { RevealItem, RevealStagger } from "@/components/reveal"
import { getProjects } from "@/lib/content"

/**
 * The work grid keeps "sequential" distribution so the column order stays
 * exactly as the projects are ordered in /admin. The tall/wide rhythm is a design choice,
 * not something to re-pack automatically.
 *
 * The stagger wrapper sits outside Masonry: Motion propagates variants through
 * React context, so the plain column divs in between don't break the chain, and
 * the tiles arrive in authored order rather than column order.
 */
export async function WorkGrid() {
  const projects = await getProjects()
  return (
    <RevealStagger step={0.06}>
      <Masonry
        distribute="sequential"
        items={projects.map((project) => ({
          key: project.slug,
          ratio: project.ratio,
          node: (
            <RevealItem>
              <ProjectCard project={project} />
            </RevealItem>
          ),
        }))}
      />
    </RevealStagger>
  )
}
