# Portfolio

A two-pane portfolio built with Next.js 16 (App Router), Tailwind CSS v4, and shadcn/ui.
Content is edited in Payload CMS 4 at `/admin`, stored in Neon Postgres (through the
Vercel Postgres adapter), with files in Vercel Blob under `media/`.

```bash
bun run dev   # http://localhost:3010, admin at /admin
```

`.env.local` needs `POSTGRES_URL` (the pooled URL of the Neon `dev` branch; `-pooler.`
in the host), `BLOB_READ_WRITE_TOKEN` and `PAYLOAD_SECRET`. Dev pushes schema changes
straight to that branch. Before deploying a schema change, run
`bun run payload migrate:create <name>` and commit `migrations/`. Vercel builds with
`bun run ci`, which migrates, then builds.

## Layout model

The desktop layout is two panes that scroll independently, not one scrolling page.

| Pane  | Width | Contents |
| ----- | ----- | -------- |
| Left  | `1fr` | Profile: intro, stack strip, about, skills, experience, contact |
| Right | `2fr` | Selected work, as a masonry grid of project tiles |

`html.shell-root` sets `overflow: hidden`, so the document itself never scrolls. Each pane
owns its scroll container and draws its own progress bar pinned to its top edge. Scrolling
the left pane fills only the left bar. Case-study pages reuse the same `Pane` component, so
they get a progress bar too.

Below `lg` (1024px) the panes cannot sit side by side, so they become one pane at a time,
switched by the About/Work pill toggle.

## Key files

| File | Role |
| ---- | ---- |
| `payload.config.ts`, `cms/` | The Payload schema: projects, media, and the profile, resume and contact globals. |
| `lib/content.ts` | Reads Payload and returns the shapes in `lib/site-data.ts`, so components never see a document. |
| `lib/site-data.ts` | The types the site renders, and `jobPeriod`. |
| `scripts/seed.ts` | One-off import of `scripts/seed/data.ts` and the old `public/` files (`SEED_FILES`) into Payload. Safe to rerun. |
| `scripts/build-media.sh` | Rebuilds every image and clip from the source media, outside the repo. Upload the results in `/admin`. |
| `scripts/build-cv.tsx` | `bun run cv`: builds the CV PDF from Payload and uploads it as the profile's CV. |
| `components/case-media.tsx` | One case-study frame: a still, or a clip that plays in view. |
| `components/project-card.tsx` | Grid tile. Desaturated at rest, plays a loop on hover. |
| `components/masonry.tsx` | Two-column packing, sequential or balanced. |
| `components/two-pane-shell.tsx` | Desktop split and mobile tab switch. |
| `hooks/use-scroll-progress.ts` | rAF-throttled scroll progress (0..1) for one container. |
| `app/(frontend)/projects/[slug]/page.tsx` | Case study, statically generated per project. |
| `app/(frontend)/globals.css` | Design tokens, type scale, reduced-motion handling. |

## Media: finished mockups, never a cropped screenshot

Every app capture carries panels down both edges. Cropping one into a tile
slices those panels and reads as a careless screenshot, so the interface is
never cropped. Every frame instead arrives as a finished mockup, the screen
recording already inside a photographed device, and the build script only
chooses how much of the scene around the device a tile keeps.

| Treatment | What it is | Where |
| --------- | ---------- | ----- |
| `finished` | A mockup video that arrived cut, device and scene included. | Every clip on the site |
| `render` | The same for a still mockup. | The Size Flow storefront |
| `detail` | A sub-crop of the 3D viewport with no interface in it, shown full bleed. | The HRX sponsor close-up |

Each clip ships as one H.264 MP4 plus a WebP of its first frame, which is the
poster and, for a project's lead clip, the grid tile's cover. Source media is
not in this repo; see the header of `scripts/build-media.sh`.

## Making it yours

Everything is edited in `/admin`. Saving revalidates the site, so there is nothing to
redeploy. Build new mockups with `scripts/build-media.sh`, then upload them to Media. Run
`bun run cv` to rebuild the CV from the same content.

A tile's aspect ratio is its still's pixel size, and it gives the grid its rhythm: `4/3`,
`1/1` and `3/4`. A project's first media item is also its grid tile. The work grid fills
column-major, so the first half of the Projects list (drag to reorder) is column one, and
the left column should come out the taller of the two. Case-study grids balance
themselves.

## Typography

Geist, shadcn's default, loaded with `next/font/google` in `app/layout.tsx`. Next
downloads it at build time and serves it from the site itself. The type scale lives in
`app/globals.css` as `.t-name`, `.t-heading`, `.t-lead`, `.t-body`, `.t-meta`.

## Adding shadcn components

```bash
npx shadcn@latest add dialog
```
