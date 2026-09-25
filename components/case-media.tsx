"use client"

import { IconMinus, IconPlayerPlay, IconPlus, IconX } from "@tabler/icons-react"
import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import Image from "next/image"
import {
  startTransition,
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  ViewTransition,
} from "react"
import { createPortal } from "react-dom"

import type { Dictionary } from "@/lib/dictionary"
import type { CaseMedia } from "@/lib/site-data"
import { cn } from "@/lib/utils"

type Point = { x: number; y: number }

/** Where a click happened, or nothing when a key press made it (`detail` 0). */
function pointOf(e?: React.MouseEvent): Point | undefined {
  return e && e.detail > 0 ? { x: e.clientX, y: e.clientY } : undefined
}

/**
 * Keeps a pair of motion values on the pointer, relative to whatever element
 * the handler is on. Motion values, so following it never re-renders.
 *
 * `tracking` says the values hold a real position. Hover alone can't: an
 * element that appears under a still mouse, like the first frame after the
 * morph from the home page, is hovered before any pointer event has told it
 * where the pointer is, and the disc would show at its top-left corner.
 */
function usePointer(from?: Point) {
  const x = useMotionValue(from?.x ?? 0)
  const y = useMotionValue(from?.y ?? 0)
  const [tracking, setTracking] = useState(from !== undefined)
  const place = (point: Point) => {
    x.set(point.x)
    y.set(point.y)
    setTracking(true)
  }
  const follow = (e: React.PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    place({ x: e.clientX - box.left, y: e.clientY - box.top })
  }
  return { x, y, tracking, place, follow, forget: () => setTracking(false) }
}

/**
 * The blue disc that stands in for the cursor: + over a frame to open it,
 * − over the lightbox to put it back. The parent's hover state shows it,
 * which also keeps it off touch screens, where nothing hovers.
 */
function CursorDisc({
  x,
  y,
  icon,
  className,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  icon: React.ReactNode
  /** The hover classes that bring it in, e.g. `group-hover:opacity-100`. */
  className?: string
}) {
  return (
    <motion.span
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none absolute top-0 left-0"
    >
      <span
        className={cn(
          "-translate-1/2 grid size-12 scale-50 place-items-center rounded-full bg-accent text-accent-ink opacity-0 transition-[opacity,scale] duration-200 ease-out",
          className
        )}
      >
        {icon}
      </span>
    </motion.span>
  )
}

/**
 * One frame of a case study: a still, or a silent clip that plays while it is
 * on screen. Every frame arrives as a finished mockup, the interface already
 * inside a photographed device, so it runs full bleed and nothing crops the UI.
 *
 * Clips are `preload="none"` and only ever start from the IntersectionObserver
 * below, so a case study with four videos in it downloads nothing until the
 * reader actually scrolls to them, and stops again once they scroll past.
 *
 * The poster is a real frame of its own clip, rendered through next/image so it
 * gets the same responsive treatment as every other still. The video fades in
 * over it on `playing` rather than `canplay`, which fires early enough to show
 * a blank first frame.
 *
 * Clicking a frame opens it in a lightbox. The frame and the lightbox share a
 * view-transition name, so the browser morphs one into the other instead of
 * the tile vanishing and a dialog appearing. A name can only be on screen once,
 * so while the lightbox is open the tile keeps its box but drops its media.
 */
export function CaseFrame({
  media,
  labels,
  priority = false,
  sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw",
}: {
  media: CaseMedia
  /** Screen-reader names for the frame's buttons, in the page's language. */
  labels: Dictionary["media"]
  priority?: boolean
  sizes?: string
}) {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [playing, setPlaying] = useState(false)
  const [open, setOpen] = useState(false)
  // useId is `_r_1_`-shaped, which is a valid CSS ident.
  const name = `frame${useId()}`
  /**
   * Where the clip was when it left the tile or the lightbox, so the one that
   * takes over picks up there rather than jumping back to the first frame.
   */
  const clipTime = useRef(0)
  const returnFocus = useRef(false)
  /** Where the click that opened the lightbox landed, so its disc starts there. */
  const openedAt = useRef<Point | undefined>(undefined)
  const pointer = usePointer()

  const play = useCallback(() => {
    videoRef.current?.play().catch(() => {
      /* autoplay refused, so the poster stays, which is a fine resting state */
    })
  }, [])

  // Observe the video itself rather than a wrapper: it is the thing whose bytes
  // we are deferring, and it saves threading a ref through the frame. Re-runs
  // on `open` because closing the lightbox mounts a fresh video element.
  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced !== false || open) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else video.pause()
      },
      { rootMargin: "128px" }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [play, reduced, open])

  // Back to the tile once the lightbox has gone and the page is no longer
  // inert. Its cleanup runs before this effect, so the trigger is focusable.
  useEffect(() => {
    if (open || !returnFocus.current) return
    returnFocus.current = false
    triggerRef.current?.focus({ preventScroll: true })
  }, [open])

  // Both inside startTransition: <ViewTransition> only animates updates made
  // in a transition, and a plain setState would swap the two with no morph.
  const openLightbox = (e: React.MouseEvent) => {
    openedAt.current = pointOf(e)
    clipTime.current = videoRef.current?.currentTime ?? 0
    startTransition(() => {
      setOpen(true)
      // The tile's video unmounts without ever firing `pause`.
      setPlaying(false)
    })
  }

  const closeLightbox = (time: number, at?: Point) => {
    clipTime.current = time
    returnFocus.current = true
    // Put the + where the pointer is now, not where it was when this opened.
    // Closed from the keyboard, nobody knows where the pointer is.
    const box = triggerRef.current?.getBoundingClientRect()
    if (at && box) pointer.place({ x: at.x - box.left, y: at.y - box.top })
    else pointer.forget()
    startTransition(() => setOpen(false))
  }

  const still = (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      className="object-cover"
      priority={priority}
    />
  )

  const inner = media.video ? (
    <>
      {still}
      <video
        ref={videoRef}
        // Decorative: the poster underneath already carries the alt text, and
        // announcing the same frame twice helps nobody.
        aria-hidden
        muted
        loop
        playsInline
        preload="none"
        poster={media.src}
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = clipTime.current
        }}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          playing ? "opacity-100" : "opacity-0"
        )}
        src={media.video}
      />
    </>
  ) : (
    still
  )

  return (
    <div
      className="relative w-full overflow-hidden rounded-(--card-radius) border border-hairline bg-media"
      style={{ aspectRatio: media.ratio }}
    >
      {!open && (
        <ViewTransition name={name} share="morph" default="none">
          {/* Rounded itself, not only clipped by the frame: the morph
              snapshots this element, and the corners have to travel with it. */}
          <div className="absolute inset-0 overflow-hidden rounded-(--card-radius)">
            {inner}
          </div>
        </ViewTransition>
      )}

      {/* On devices with a cursor the + disc replaces it. On touch there is
          nothing to hover, so it never shows and a tap opens. */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={openLightbox}
        onPointerEnter={pointer.follow}
        onPointerMove={pointer.follow}
        onPointerLeave={pointer.forget}
        className="group absolute inset-0 cursor-zoom-in pointer-fine:cursor-none focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:-outline-offset-4"
      >
        <span className="sr-only">
          {labels.enlarge}: {media.alt}
        </span>
        <CursorDisc
          x={pointer.x}
          y={pointer.y}
          icon={<IconPlus size={22} stroke={3.5} strokeLinecap="square" />}
          className={
            pointer.tracking
              ? "group-hover:scale-100 group-hover:opacity-100"
              : undefined
          }
        />
      </button>

      {/* Reduced motion: never autoplay, but never hide the clip either.
          Gated in CSS rather than on `reduced`, because that hook reads
          matchMedia and so disagrees with the server on the first render,
          which leaves React unable to patch up the difference. Sits above
          the lens trigger, so under reduced motion the first click plays. */}
      {media.video && !playing && !open && (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 hidden place-items-center bg-black/20 text-white transition-colors hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2 motion-reduce:grid"
        >
          <span className="sr-only">
            {labels.playClip}: {media.alt}
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-black/55 backdrop-blur-sm">
            <IconPlayerPlay size={16} aria-hidden />
          </span>
        </button>
      )}

      {open &&
        createPortal(
          <Lightbox
            media={media}
            closeLabel={labels.close}
            name={name}
            sizes={sizes}
            startAt={clipTime.current}
            from={openedAt.current}
            onClose={closeLightbox}
          />,
          document.body
        )}
    </div>
  )
}

/**
 * The frame, as large as the viewport allows at its own ratio, so nothing is
 * cropped. Clicking anywhere, the close button or Escape puts it back, and
 * the − disc that replaces the cursor here says so.
 *
 * The morph snapshots this the moment it mounts, before a full-size image has
 * had time to load. So the bottom layer is the tile's own image at the tile's
 * `sizes`, which the browser already has, and the sharp one fades in over it.
 */
function Lightbox({
  media,
  closeLabel,
  name,
  sizes,
  startAt,
  from,
  onClose,
}: {
  media: CaseMedia
  closeLabel: string
  name: string
  sizes: string
  startAt: number
  /** The click that opened it, in viewport coordinates. */
  from?: Point
  onClose: (clipTime: number, at?: Point) => void
}) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sharp, setSharp] = useState(false)
  const [playing, setPlaying] = useState(false)
  // The overlay is fixed at the viewport origin, so viewport coordinates are
  // already its own. Opened from the keyboard there is no click to start
  // from, and the disc waits for the pointer to move rather than sit at 0,0.
  const pointer = usePointer(from)
  const [overClose, setOverClose] = useState(false)

  const close = (e?: React.MouseEvent) =>
    onClose(videoRef.current?.currentTime ?? startAt, pointOf(e))
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") close()
  })

  // Modal: everything else on the page goes inert, so focus, clicks and
  // screen readers stay inside the lightbox until it closes.
  useEffect(() => {
    const others = [...document.body.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== rootRef.current && !el.inert
    )
    for (const el of others) el.inert = true
    document.addEventListener("keydown", onKeyDown)
    return () => {
      for (const el of others) el.inert = false
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape and the close button are the keyboard path
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={media.alt}
      onClick={close}
      onPointerMove={pointer.follow}
      className="group/lightbox fixed inset-0 z-100 grid cursor-zoom-out pointer-fine:cursor-none place-items-center bg-surface/90 p-(--lightbox-pad) backdrop-blur-md [--lightbox-pad:16px] lg:[--lightbox-pad:40px]"
    >
      <ViewTransition name={name} share="morph" default="none">
        <div
          className="relative overflow-hidden rounded-(--card-radius) bg-media"
          style={{
            aspectRatio: media.ratio,
            // As wide as the pane allows, unless that would run taller
            // than the viewport, in which case height decides.
            width: `min(100%, calc((100dvh - 2 * var(--lightbox-pad)) * ${media.ratio}))`,
          }}
        >
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
          {media.video ? (
            <video
              ref={videoRef}
              aria-hidden
              muted
              loop
              playsInline
              // Opening it is a request to see it, but reduced motion still
              // means nothing moves until the reader presses play.
              autoPlay={reduced === false}
              controls={reduced !== false}
              poster={media.src}
              onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = startAt
              }}
              onPlaying={() => setPlaying(true)}
              // The controls would otherwise close the lightbox.
              onClick={(e) => {
                if (reduced !== false) e.stopPropagation()
              }}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                playing || reduced !== false ? "opacity-100" : "opacity-0"
              )}
              src={media.video}
            />
          ) : (
            <Image
              src={media.src}
              alt=""
              fill
              sizes="100vw"
              onLoad={() => setSharp(true)}
              className={cn(
                "object-cover transition-opacity duration-300",
                sharp ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>
      </ViewTransition>

      <button
        type="button"
        // biome-ignore lint/a11y/noAutofocus: a dialog moves focus into itself on open
        autoFocus
        onClick={(e) => {
          e.stopPropagation()
          close(e)
        }}
        // The real cursor comes back over the button, and the disc steps
        // aside rather than sitting on top of it.
        onPointerEnter={() => setOverClose(true)}
        onPointerLeave={() => setOverClose(false)}
        className="absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full bg-surface-raised text-ink transition-colors hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
      >
        <span className="sr-only">{closeLabel}</span>
        <IconX size={18} aria-hidden />
      </button>

      <CursorDisc
        x={pointer.x}
        y={pointer.y}
        icon={<IconMinus size={22} stroke={3.5} strokeLinecap="square" />}
        className={
          pointer.tracking && !overClose
            ? "group-hover/lightbox:scale-100 group-hover/lightbox:opacity-100"
            : undefined
        }
      />
    </div>
  )
}
