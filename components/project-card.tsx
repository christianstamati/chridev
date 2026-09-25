"use client"

import { useReducedMotion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useRef, useState, ViewTransition } from "react"

import type { Project } from "@/lib/site-data"
import { cn } from "@/lib/utils"

/**
 * A masonry tile. The cover is a finished mockup at the tile's own ratio, so
 * nothing crops the interface in it. At rest it is desaturated. On hover (or
 * keyboard focus) it ramps to full color while a scrim and the title/category
 * fade in, and projects that ship a `coverVideo` start a silent loop. The loop's
 * first frame is the cover still, so playback begins without a jump.
 *
 * Two Tailwind v4 details matter here:
 *  - `scale-*` and `translate-*` compile to the standalone `scale` / `translate`
 *    properties, NOT to `transform`. Transition lists must name those properties
 *    or the change applies in a single frame.
 *  - `hover:` utilities are wrapped in `@media (hover: hover)`, so touch devices
 *    get none of this. The `card-*` hooks let globals.css reveal everything
 *    unconditionally where there is no hover. See "touch fallback" there.
 */
export function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)

  // `preload="none"` plus play-on-intent means the grid ships five covers and
  // zero video bytes until someone actually points at a tile.
  const start = useCallback(() => {
    if (reduced !== false) return
    videoRef.current?.play().catch(() => {})
  }, [reduced])

  const stop = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }, [])

  const media = (
    <>
      {/* Shares a name with the case study's lead image so navigating morphs
          one element across routes instead of swapping two. The clip stays
          outside it, because morphing a playing video is not what we want. */}
      <ViewTransition
        name={`project-${project.slug}`}
        share="morph"
        default="none"
      >
        {/* Rounded itself, not only clipped by the tile: the morph snapshots
            this element, and the corners have to travel with it. Switching
            language keeps the grid on screen, so every tile morphs into
            itself, and a bare image would square off for the whole morph. */}
        <div className="absolute inset-0 overflow-hidden rounded-(--card-radius)">
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="card-media object-cover grayscale transition-[filter,scale] duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0"
          />
        </div>
      </ViewTransition>

      {project.coverVideo && (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0"
          )}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          src={project.coverVideo}
        />
      )}
    </>
  )

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.title}, ${project.categories[0]}`}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="motion-safe-only group relative block w-full overflow-hidden rounded-(--card-radius) outline-hidden focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)]"
    >
      <div
        className="relative w-full overflow-hidden rounded-(--card-radius) border border-hairline bg-media"
        style={{ aspectRatio: project.ratio }}
      >
        {media}
      </div>

      {/* Scrim, only dense enough to keep the labels legible. */}
      <div
        aria-hidden
        className="card-scrim absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <div
        aria-hidden
        className="card-reveal absolute inset-x-0 bottom-0 flex translate-y-1 items-end justify-between gap-4 p-4 opacity-0 transition-[opacity,translate] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <span className="t-meta font-medium text-white">{project.title}</span>
        <span className="t-meta text-white/70">{project.categories[0]}</span>
      </div>
    </Link>
  )
}
