/**
 * The site's content as it stood in lib/site-data.ts before it moved into
 * Payload. scripts/seed.ts imports it into an empty database; nothing on the
 * site reads this file, and edits here do not reach the site. Edit in /admin.
 *
 * TODO(chris) marks a value I still owe the file. Nothing below invents a
 * number, so a missing metric is left out rather than approximated.
 */

import type { Job, Project, TextRun } from "@/lib/site-data"
import type { StackIcon } from "@/lib/stack-icons"

export const profile = {
  name: "Christian Stamati",
  role: "Software Engineer",
  /** Edit these runs to change which phrases carry the weight. */
  intro: [
    { text: "I build web products and real-time 3D" },
    {
      text: ", from data-heavy interfaces to product configurators that run in the browser, ",
      dim: true,
    },
    {
      text: "focused on speed, clarity and making complicated tools easy to use.",
    },
  ] satisfies TextRun[],
  avatar: "/profile.jpeg",
  location: "Italy",
  /** Where the site lives. The CV links back to it and to each case study. */
  url: "https://chri.dev",
  /** The last PDF built before the move. `bun run cv` replaces it. */
  cv: "/christian-stamati-cv-2026-09-23-v6.pdf",
  /** One paragraph per entry, each a run list so company names can link out. */
  about: [
    [
      { text: "I'm a software engineer in Italy. Currently I work at " },
      {
        text: "Clover Orthopedics",
        href: "https://cloverorthopedics.com/en/home-en/",
      },
      {
        text: ", building web applications for clinicians and patients. Previously, I worked at ",
      },
      { text: "WE WEAR", href: "https://wewear.tech/en" },
      { text: " on 3D configurators and virtual try-on." },
    ],
    [
      {
        text: "I came up through 3D and interactive media, so I tend to reach for the graphics answer first. These days that means Three.js in a browser tab, or Unreal Engine streamed off a server when the pixels need to be better than a browser can manage on its own.",
      },
    ],
  ] satisfies TextRun[][],
} as const

/**
 * What I can do, as opposed to `stack`, which is what I do it with. Every line
 * here is backed by something in `experience` or `projects`.
 */
export const skills = [
  {
    title: "Frontend",
    items: [
      "React and Next.js",
      "TypeScript end to end",
      "Tailwind CSS and shadcn/ui",
      "Design systems and component libraries",
      "Motion and interaction detail",
      "Accessibility and keyboard support",
    ],
  },
  {
    title: "Product engineering",
    items: [
      "Data-heavy interfaces",
      "Client state and data fetching at scale",
      "Performance and Core Web Vitals",
      "Clinical and regulated workflows",
    ],
  },
  {
    title: "Backend and data",
    items: [
      "Node.js APIs",
      "Schema design and migrations",
      "Auth and access control",
      "Convex, MongoDB and Drizzle",
      "Headless CMS integration",
    ],
  },
  {
    title: "Real-time 3D",
    items: [
      "Three.js and React Three Fiber",
      "WebGPU and TSL shaders",
      "3D product configurators",
      "Unreal Engine streamed to the browser",
      "glTF pipelines and asset budgets",
      "Embeddable Web Components",
    ],
  },
] as const

/**
 * Grouped by where a tool sits in the build, which is how the CV prints it.
 * The home page shows the same list, flattened, as the strip under the intro.
 * React Three Fiber and TSL have no mark and show as their name alone.
 */
export const stack: readonly {
  group: string
  items: readonly { name: string; href: string; icon?: StackIcon }[]
}[] = [
  {
    group: "Frontend",
    items: [
      {
        name: "TypeScript",
        href: "https://www.typescriptlang.org",
        icon: "typescript",
      },
      { name: "React", href: "https://react.dev", icon: "react" },
      { name: "Next.js", href: "https://nextjs.org", icon: "nextdotjs" },
      {
        name: "TanStack Start",
        href: "https://tanstack.com/start",
        icon: "tanstack",
      },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com",
        icon: "tailwindcss",
      },
      { name: "shadcn/ui", href: "https://ui.shadcn.com", icon: "shadcnui" },
    ],
  },
  {
    group: "Creative tech",
    items: [
      { name: "Three.js", href: "https://threejs.org", icon: "threedotjs" },
      { name: "React Three Fiber", href: "https://r3f.docs.pmnd.rs" },
      { name: "WebGPU", href: "https://www.w3.org/TR/webgpu/", icon: "webgpu" },
      {
        name: "TSL Shaders",
        href: "https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language",
      },
      {
        name: "Unreal Engine 5",
        href: "https://www.unrealengine.com",
        icon: "unrealengine",
      },
      { name: "Unity", href: "https://unity.com", icon: "unity" },
    ],
  },
  {
    group: "Backend & data",
    items: [
      { name: "Node.js", href: "https://nodejs.org", icon: "nodedotjs" },
      { name: "Convex", href: "https://www.convex.dev", icon: "convex" },
      { name: "MongoDB", href: "https://www.mongodb.com", icon: "mongodb" },
      {
        name: "Drizzle ORM",
        href: "https://orm.drizzle.team",
        icon: "drizzle",
      },
      {
        name: "Payload CMS",
        href: "https://payloadcms.com",
        icon: "payloadcms",
      },
      {
        name: "Better Auth",
        href: "https://www.better-auth.com",
        icon: "betterauth",
      },
    ],
  },
  {
    group: "Design & 3D",
    items: [
      { name: "Blender", href: "https://www.blender.org", icon: "blender" },
      { name: "Figma", href: "https://www.figma.com", icon: "figma" },
    ],
  },
] as const

/**
 * Dates are `YYYY-MM` and come from the CV, except the WE WEAR end: June 2026
 * is the month before the July start at Clover.
 */
export const experience: readonly Job[] = [
  {
    role: "Software Engineer",
    company: "Clover Orthopedics",
    start: "2026-07",
    href: "https://cloverorthopedics.com/en/home-en/",
    summary:
      "Building web applications for a cloud healthcare platform used by clinicians and patients. Clinical software sets a higher bar, so requirements, traceability and testing are part of shipping a feature rather than paperwork after it.",
  },
  {
    role: "Software Engineer",
    company: "WE WEAR",
    start: "2021-04",
    end: "2026-06",
    href: "https://wewear.tech/en",
    summary:
      "Built a no-code 3D platform so anyone could put together an interactive 3D experience without waiting on an engineer. Shipped the virtual try-on widget as Web Components, and moved the main app onto TanStack Query and Zustand when client-side API load started hurting. Argued for dropping Unity in favour of a web-native Next.js frontend so customers could reach the product from a URL, then led the Modesto Bertotto build that opened a new revenue line.",
  },
  {
    role: "Research Collaborator",
    company: "NABA",
    start: "2021-02",
    end: "2021-05",
    href: "https://www.naba.it/en",
    summary:
      "Built an experimental virtual production stage on LED walls, wiring Unreal Engine to physical MIDI controllers. Latency made it unusable at first. Once I found the real cause, directors could relight a scene from the desk mid-shoot.",
  },
  {
    role: "Software Engineering Intern",
    company: "WE WEAR",
    start: "2020-11",
    end: "2021-04",
    href: "https://wewear.tech/en",
    summary:
      "Body measurement in Unity. Wrote the logic that turned raw measurements into 3D blend shapes.",
  },
]

/** CV only. The site does not list these. */
export const education = [
  {
    title: "Bachelor's Degree in Creative Technologies",
    school: "NABA",
    period: "2019 - 2023",
    detail: "Computer science and interactive media.",
  },
  { title: "Diploma in Graphic Design", school: "ISSM", period: "2014 - 2017" },
] as const

/** CV only. */
export const languages = [
  { name: "Italian", level: "Native" },
  { name: "English", level: "Professional" },
  { name: "Romanian", level: "Conversational" },
] as const

export const contact = {
  heading: "Reach out.",
  blurb:
    "Open to interesting problems in product engineering or real-time 3D. Email is the fastest way to reach me.",
  email: "hello@chri.dev",
  socials: [
    { label: "GitHub", href: "https://github.com/christianstamati" },
    { label: "LinkedIn", href: "https://linkedin.com/in/christianstamati" },
    { label: "X", href: "https://x.com/chri_dev" },
    { label: "YouTube", href: "https://youtube.com/@christianstamati" },
    { label: "Instagram", href: "https://instagram.com/christianstamati" },
  ],
} as const

/** Where a case-study clip lives. Every clip is one silent MP4. */
function clip(slug: string, name: string) {
  return `/case/${slug}/${name}.mp4`
}

/**
 * Order matters. The work grid fills column-major (0,1 | 2,3), so this order is
 * also the column split: the first two tiles stack in the left column, the last
 * two in the right.
 *
 * The order is chosen so the LEFT column comes out the taller of the two, which
 * puts the leftover height at the foot of the right column rather than
 * stranding the "Start a project" pill below a hole. With the current tiles
 * that means 4:3 + 1:1 on the left against 4:3 + 4:3 on the right, or 1.75
 * column-widths against 1.5.
 *
 * Size Flow used to do this job from second place, on the strength of its 3:4
 * tile. Its cover is landscape now, so Modesto Bertotto's square one carries
 * the left column instead. Reorder these and check the grid still bottoms out
 * that way — the case-study grids balance themselves, but this one does not.
 */
export const projects: readonly Project[] = [
  {
    slug: "3d-configurator",
    title: "3D Configurator",
    categories: ["Platform", "3D"],
    ratio: 4 / 3,
    // The landing clip's own first frame, so the hover loop below starts on it.
    cover: "/case/3d-configurator/landing.webp",
    // The same files as the case study's lead clip rather than a separate
    // /work loop: same crop, same size, so hovering the tile warms the cache
    // for the page it opens.
    coverVideo: clip("3d-configurator", "landing"),
    excerpt:
      "A no-code platform for building and publishing interactive 3D experiences without an engineer.",
    year: "2026",
    role: "Fullstack Engineer",
    stack: ["Next.js", "Three.js"],
    company: "WE WEAR",
    companyUrl: "https://wewear.tech/en",
    liveUrl: "https://wewear.tech/en/3d-configurator",
    // TODO(chris): duration. Omitted so the meta grid skips it.
    challenge:
      "Every 3D experience was built by an engineer. A developer set up the model, its materials and the options a customer could pick, and nothing could be shown until that was done. Every change after it was another ticket, so each experience moved at the speed of the dev queue.",
    solution: [
      "I built it so making an experience no longer needs an engineer. A workspace holds the projects, and teammates join by email invite with a role. The material editor builds PBR materials from the project's own textures, one channel at a time, and previews each change on a sphere, a cube or a plane. Lighting comes from a preset or a custom HDRI, and a post-processing stack finishes the look with ambient occlusion, bloom, tone mapping and colour adjustments.",
      "Next comes what the customer is allowed to change. The variant manager sorts options into sets, a headset colour or a headrest colour, and each option carries a price, a thumbnail and the material it swaps in. An option can depend on one in another set, so picking it switches that one on too. Decals mark numbered zones on the surface, and each zone becomes a slot the customer fills with an image or a line of text.",
      "Publishing cuts a numbered version and hands back a public URL, so an experience goes live without a deploy. The export decides what that version exposes: orbit controls, prices and a running total, a summary the customer can download as a PDF, the 2D sticker editor, the post-processing, and a brand logo on the loading screen. On a phone the options move into a bottom sheet and the sticker editor goes full screen.",
    ],
    results: [
      "Building an experience stopped being an engineering ticket. The people who need one build and publish it themselves.",
      "A new price is an edit and a new version, not a release.",
    ],
    // Nine finished clips, one per feature, each already a device in a scene.
    // The laptops are the full 4:3 frame they were cut at.
    // The phones are cropped to 3:4, scene only, so the screen is big enough to
    // read. See the finished path in scripts/build-media.sh.
    //
    // Authored in the order the story runs. The balanced split then puts the
    // landing, the viewer and both phones on the left and the five editor clips
    // on the right, which reads as the product on one side and how it is made
    // on the other. The left column comes out taller by about half a tile, which
    // is more than the one extra caption the right column carries gives back.
    //
    // Item 0 is the one lead frame on the site that plays. It is safe to morph:
    // the clip fades in over its own first frame, which is the poster, so a
    // clip that starts mid-transition changes nothing on screen.
    media: [
      {
        src: "/case/3d-configurator/landing.webp",
        ratio: 4 / 3,
        alt: "The platform on a laptop, from its landing page into a workspace's projects, then the workspace settings where teammates are invited by email with a role.",
        video: clip("3d-configurator", "landing"),
        caption: {
          title: "Workspace",
          text: "Every project in one place, and teammates invited by email with a role.",
        },
      },
      {
        src: "/case/3d-configurator/material-editor.webp",
        ratio: 4 / 3,
        alt: "The material editor building a speaker material from the project's textures, adding normal and roughness maps and previewing them on a sphere and a plane.",
        video: clip("3d-configurator", "material-editor"),
        caption: {
          title: "Material editor",
          text: "PBR materials built from the project's own textures, one channel at a time.",
        },
      },
      {
        src: "/case/3d-configurator/variant-manager.webp",
        ratio: 4 / 3,
        alt: "The variant manager, where a new pink option joins the headrest colour set and recolours the headband once its material is set.",
        video: clip("3d-configurator", "variant-manager"),
        caption: {
          title: "Variant manager",
          text: "Option sets, each option with a price, a thumbnail and the material it swaps in.",
        },
      },
      {
        src: "/case/3d-configurator/decals.webp",
        ratio: 4 / 3,
        alt: "Placing a numbered decal zone on the ear cup, then resizing and rotating it from the decals panel.",
        video: clip("3d-configurator", "decals"),
        caption: {
          title: "Decals",
          text: "Numbered zones on the surface, which the customer fills with their own artwork.",
        },
      },
      {
        src: "/case/3d-configurator/post-processing.webp",
        ratio: 4 / 3,
        alt: "Tuning post-processing on the scene, bloom and ambient occlusion first, then tone mapping switched to ACES Filmic.",
        video: clip("3d-configurator", "post-processing"),
        caption: {
          title: "Post-processing",
          text: "Bloom, ambient occlusion and tone mapping, tuned on the live scene.",
        },
      },
      {
        src: "/case/3d-configurator/publish.webp",
        ratio: 4 / 3,
        alt: "Publishing the scene as its first version, which goes live at a public URL, then opening that URL in the viewer.",
        video: clip("3d-configurator", "publish"),
        caption: {
          title: "Publish",
          text: "Every publish is a numbered version with its own public URL.",
        },
      },
      {
        src: "/case/3d-configurator/viewer-overview.webp",
        ratio: 4 / 3,
        alt: "The published viewer on a laptop. A logo and a line of text go onto a sticker slot through the 2D editor, then the priced summary opens with a PDF download.",
        video: clip("3d-configurator", "viewer-overview"),
        caption: {
          title: "Viewer",
          text: "The published experience, with options, stickers and a priced summary to download.",
        },
      },
      {
        src: "/case/3d-configurator/mobile-2d-editor.webp",
        ratio: 3 / 4,
        alt: "The viewer on a phone, uploading a logo into a sticker slot, placing it in the full-screen 2D editor and seeing it land on the ear cup.",
        video: clip("3d-configurator", "mobile-2d-editor"),
        caption: {
          title: "Mobile 2D editor",
          text: "The sticker editor goes full screen on a phone, and the result lands on the product.",
        },
      },
      {
        src: "/case/3d-configurator/mobile-variants.webp",
        ratio: 3 / 4,
        alt: "Changing the headset colour on a phone, the total following each option, then the summary with its price breakdown.",
        video: clip("3d-configurator", "mobile-variants"),
        caption: {
          title: "Mobile variants",
          text: "Options sit in a bottom sheet, and the total follows every pick.",
        },
      },
    ],
  },
  {
    slug: "modesto-bertotto",
    title: "Modesto Bertotto",
    categories: ["Cloud 3D", "Configurator"],
    ratio: 1,
    // The lead clip's own first frame, and the clip is the grid tile's hover
    // loop too: same square crop, so hovering the tile warms the page's cache.
    cover: "/case/modesto-bertotto/overview.webp",
    coverVideo: clip("modesto-bertotto", "overview"),
    excerpt:
      "A wedding suit configurator with cloud-rendered fabric and a wizard that narrows the catalogue before you start.",
    year: "2025",
    stack: ["Unreal Engine", "Next.js"],
    company: "WE WEAR",
    companyUrl: "https://wewear.tech/en",
    role: "Fullstack Engineer",
    liveUrl: "https://www.modestobertotto.com/pages/configuratore-3d",
    team: [
      { name: "Fabio Albizzati", role: "CEO" },
      { name: "Andrea Scaggiante", role: "Project Manager" },
      { name: "Vasco Inzoli", role: "Pattern Maker" },
      { name: "Riccardo Allievi", role: "3D Artist" },
    ],
    challenge:
      "Picking a wedding suit is a fabric problem. The cloth has to suit the season and the venue, the catalogue holds more textures and weights than anyone can keep straight, and no shop has the floor space to stock every bolt.",
    solution:
      "Most configurators render on the customer's own device with Three.js and start instantly. This one streams Unreal Engine from a Windows application on server hardware instead, trading startup time for fabric that looks like fabric. Unreal's Variant Manager holds the meshes and materials from Vasco and Riccardo, so changing a cloth is a variant switch rather than new code. A Next.js and Tailwind frontend drives it over WebSocket. An opening wizard asks a few questions to suggest a starting outfit, which also covers the virtual machine's boot time. Customers export a render and take it into the shop.",
    results:
      "Live on the brand site, and it did what it was built to do: bring visitors up. Startup still takes about two minutes. Most people wait it out, some do not, and cutting that boot time is the next job.",
    // Seven finished clips, each already a device in a scene. The lead is
    // cropped square, because the work grid needs this
    // tile square; the laptops keep their full 4:3; the phones go 3:4. See the
    // finished path in scripts/build-media.sh. The balanced split puts the lead
    // and both phones on the left, the four laptops on the right.
    media: [
      {
        src: "/case/modesto-bertotto/overview.webp",
        ratio: 1,
        alt: "The configurator on a laptop: jacket model, hem and buttons picked on a green suit, then the cloth changed to navy, black and blue from the fabric catalogue.",
        video: clip("modesto-bertotto", "overview"),
        caption: {
          title: "Configurator",
          text: "Pick a garment, then its model and cloth. Every change renders in Unreal on a server.",
        },
      },
      {
        src: "/case/modesto-bertotto/wizard.webp",
        ratio: 4 / 3,
        alt: "The opening wizard: an introduction, a groom-or-guest choice and a suggested outfit, then a tutorial on the configurator while the suit is built.",
        video: clip("modesto-bertotto", "wizard"),
        caption: {
          title: "Wizard",
          text: "A few questions suggest a starting outfit, and a tutorial plays while the server builds it.",
        },
      },
      {
        src: "/case/modesto-bertotto/fabric-zoom.webp",
        ratio: 4 / 3,
        alt: "Super-zoom on the waistcoat as its cloth changes from plain weaves to a blue paisley damask.",
        video: clip("modesto-bertotto", "fabric-zoom"),
        caption: {
          title: "Fabric zoom",
          text: "Close enough to read the weave, which is the reason it renders on a server.",
        },
      },
      {
        src: "/case/modesto-bertotto/summary.webp",
        ratio: 4 / 3,
        alt: "The summary rendering on a laptop, listing the choices for each garment above a save button.",
        video: clip("modesto-bertotto", "summary"),
        caption: {
          title: "Summary download",
          text: "The finished look and every choice behind it, saved to bring into the shop.",
        },
      },
      {
        src: "/case/modesto-bertotto/shoes.webp",
        ratio: 4 / 3,
        alt: "Choosing the shoe colour close up, then accessories, then the whole green suit.",
        video: clip("modesto-bertotto", "shoes"),
        caption: {
          title: "Shoes and accessories",
          text: "Shoe colour and accessories finish the outfit.",
        },
      },
      {
        src: "/case/modesto-bertotto/mobile-configurator.webp",
        ratio: 3 / 4,
        alt: "The configurator on a phone, switching jacket models on a cream jacket, then changing it to navy and a black damask.",
        video: clip("modesto-bertotto", "mobile-configurator"),
        caption: {
          title: "Mobile configurator",
          text: "The same choices on a phone, in a sheet under the suit.",
        },
      },
      {
        src: "/case/modesto-bertotto/mobile-summary.webp",
        ratio: 3 / 4,
        alt: "On a phone, the suit turns to show its back, then the summary lists the shirt, trousers, accessories and shoes.",
        video: clip("modesto-bertotto", "mobile-summary"),
        caption: {
          title: "Mobile summary",
          text: "Turn the suit around, then review the outfit and save it.",
        },
      },
    ],
  },
  {
    slug: "size-flow",
    title: "Size Flow",
    categories: ["Widget", "E-commerce"],
    ratio: 4 / 3,
    // The profile clip's own first frame, and the clip is the grid tile's hover
    // loop too, the same as the other finished-clip projects. The Sportful
    // render that used to lead follows it in the case study.
    cover: "/case/size-flow/user-data.webp",
    coverVideo: clip("size-flow", "user-data"),
    excerpt:
      "A size-suggestion widget that installs on any product page, whatever the store runs on.",
    year: "2024",
    stack: ["Web Components", "Lit", "Three.js", "Google Tag Manager"],
    company: "WE WEAR",
    companyUrl: "https://wewear.tech/en",
    liveUrl: "https://wewear.tech/en/sizeflow",
    challenge:
      "Size Flow suggests a size on the product page, and it reached each store through a Google Tag Manager script. Every client ran a different e-commerce platform, so anything built for one framework meant a custom integration per store. Getting the fit wrong cost the customer a return.",
    solution: [
      "I helped refactor the Google Tag Manager script that installed the widget, then simplified the setup into several install scripts, each ready for a different e-commerce site. Once it is on a product page, the widget reads the product's SKU, which is how it knows which garment it is sizing.",
      "I studied Web Components for this and built the widget with Lit, so it runs inside a store whatever that store is built on. It opens a panel, a small web app where shoppers manage their profiles. A profile asks only for simple data, such as height, weight and age, and an optional step refines the body shape with three sliders for shoulders, hips and waist.",
      "From the profile and the SKU, the widget suggests a size and shows how it will fit: a label such as slim fit or comfort fit, where the garment sits between tight and loose at the chest and the waist, and the size to try next. The profile carries over to the next product.",
    ],
    // TODO(chris): a results line, from a number you will stand behind. Not
    // the CV's return-rate projection. Omitted until then, so the section does
    // not render.
    //
    // The profile clip leads, then the supplied Sportful render, then six more
    // finished clips across three brands' stores. Laptops and the tablet keep
    // their full 4:3, the phones go 3:4. See scripts/build-media.sh.
    media: [
      {
        src: "/case/size-flow/user-data.webp",
        ratio: 4 / 3,
        alt: "The profile form on a Sportful product page: nickname, gender, height, weight and age filled in one after another.",
        video: clip("size-flow", "user-data"),
        caption: {
          title: "Profile",
          text: "Nickname, gender, height, weight and age are all a profile needs.",
        },
      },
      {
        src: "/case/size-flow/storefront.webp",
        ratio: 1.25,
        alt: "The size widget open over a Sportful product page, recommending a size with the fit shown as a spectrum.",
        caption: {
          title: "On the product page",
          text: "The widget opens over the product it was installed on, here on Sportful.",
        },
      },
      {
        src: "/case/size-flow/body-shape.webp",
        ratio: 4 / 3,
        alt: "Refining the body shape on a Karpos product page: sliders for shoulders, hips and waist reshape a body model, then the measurements are processed.",
        video: clip("size-flow", "body-shape"),
        caption: {
          title: "Body shape",
          text: "Three sliders for shoulders, hips and waist, here on Karpos.",
        },
      },
      {
        src: "/case/size-flow/size-suggestion.webp",
        ratio: 4 / 3,
        alt: "The size suggestion on Sportful changing between M, S and 3XL as the measurements are edited, with chest and waist placed between tight and loose.",
        video: clip("size-flow", "size-suggestion"),
        caption: {
          title: "Size suggestion",
          text: "A size, a fit label, and chest and waist placed between tight and loose.",
        },
      },
      {
        src: "/case/size-flow/tablet.webp",
        ratio: 4 / 3,
        alt: "The widget on a Castelli product page on a tablet: the profile form, then the body-shape sliders.",
        video: clip("size-flow", "tablet"),
        caption: {
          title: "Tablet",
          text: "The same flow on a Castelli store, on a tablet.",
        },
      },
      {
        src: "/case/size-flow/mobile-user-data.webp",
        ratio: 3 / 4,
        alt: "On a phone, Find your ideal size opens from the size row of a Castelli product page, and the profile form is filled in with the keyboard.",
        video: clip("size-flow", "mobile-user-data"),
        caption: {
          title: "Mobile profile",
          text: "From the size row on the product page straight into the profile.",
        },
      },
      {
        src: "/case/size-flow/mobile-body-shape.webp",
        ratio: 3 / 4,
        alt: "The body-shape sliders on a phone, reshaping the body model.",
        video: clip("size-flow", "mobile-body-shape"),
        caption: {
          title: "Mobile body shape",
          text: "The same three sliders on a phone.",
        },
      },
      {
        src: "/case/size-flow/mobile-size-suggestion.webp",
        ratio: 3 / 4,
        alt: "On a phone, the suggested size moving between ideal fit, oversize and comfort fit, then the size table with the suggested size marked.",
        video: clip("size-flow", "mobile-size-suggestion"),
        caption: {
          title: "Mobile size suggestion",
          text: "The suggested size, the next one to try, and the size table behind it.",
        },
      },
    ],
  },
  {
    slug: "hrx",
    title: "HRX",
    categories: ["Configurator", "E-commerce"],
    ratio: 4 / 3,
    // The lead clip's own first frame, and the clip is the grid tile's hover
    // loop too, the same as the other finished-clip projects.
    cover: "/case/hrx/overview.webp",
    coverVideo: clip("hrx", "overview"),
    excerpt:
      "A made-to-order race suit configurator. Sponsors, flags and lettering, priced as you place them.",
    // TODO(chris): year and duration. Omitted so the meta grid skips them.
    role: "Unreal Engine Developer",
    stack: ["Unreal Engine", "WebSockets", "Payload CMS"],
    company: "HRX",
    liveUrl: "https://hrxtech.eu/pages/configurator",
    challenge:
      "A race suit carries more options than a product page can hold. A base graphic, a pattern per zone, colours for knit and cuff, sponsor logos in five chest and arm positions, a flag, lettering in a racing face, then pockets, cooling holes and a size. Every one of those moves the price, and nobody signs off on a suit they cannot see.",
    solution: [
      "The configurator lives in the HRX store and holds the whole specification. A base graphic comes first, then patterns and colours zone by zone, then sponsor logos, flags and lettering placed in numbered zones on the suit itself. Racing shoes work the same way. The price follows every change, and the finished suit goes to the cart.",
      "My side was Unreal Engine. The suit renders in Unreal on a remote machine and streams to the browser, and I built the WebSocket API that carries each choice from the page into the scene. I also managed the Unreal content and was the contact for the 3D designers who made it.",
      "A colleague built the frontend, which takes its content from Payload CMS. Two parts of it are mine: the loading screen, which plays racing footage while the stream connects, and the 2D editor, where a customer writes a line in a racing font, uploads a logo or picks a flag before placing it on the suit.",
    ],
    results:
      "Live in the HRX store, where a configured suit goes straight to the cart.",
    // Six finished clips and one still kept from the first cut, the sponsor
    // close-up, which is why it alone has no video. The lead keeps its full
    // 4:3, which the work grid is balanced around; the tablet goes 3:4. The
    // balanced split puts the lead, the still and the tablet on the left.
    media: [
      {
        src: "/case/hrx/overview.webp",
        ratio: 4 / 3,
        alt: "The configurator on a laptop: the race suit switching between base graphics and colourways, then the colour palette for one pattern zone.",
        video: clip("hrx", "overview"),
        caption: {
          title: "Configurator",
          text: "A base graphic first, then patterns and colours zone by zone.",
        },
      },
      {
        src: "/case/hrx/loading.webp",
        ratio: 4 / 3,
        alt: "The loading screen: racing footage plays behind a Connecting card while the session starts.",
        video: clip("hrx", "loading"),
        caption: {
          title: "Loading screen",
          text: "Racing footage fills the wait while the Unreal stream connects.",
        },
      },
      {
        src: "/case/hrx/editor-chest.webp",
        ratio: 4 / 3,
        alt: "The 2D editor: text set in a racing font, then a flag picked from the library, each placed on the chest of the suit.",
        video: clip("hrx", "editor-chest"),
        caption: {
          title: "2D editor, chest",
          text: "Text in a racing font, an uploaded logo or a flag, placed in a numbered zone.",
        },
      },
      {
        src: "/case/hrx/sponsor.webp",
        ratio: 1,
        alt: "A sponsor logo on the chest, with the five logo positions outlined.",
        caption: {
          title: "Logo zones",
          text: "Five numbered zones on the chest, each taking a sponsor, a flag or text.",
        },
      },
      {
        src: "/case/hrx/editor-back.webp",
        ratio: 4 / 3,
        alt: "The 2D editor on the back of the suit: text in a racing font placed in the second of two zones across the shoulders.",
        video: clip("hrx", "editor-back"),
        caption: {
          title: "2D editor, back",
          text: "The same editor for the two zones across the back.",
        },
      },
      {
        src: "/case/hrx/shoes.webp",
        ratio: 4 / 3,
        alt: "Racing shoes in the configurator: two logo zones on the side, a Michelin logo placed from the library, then the product picker.",
        video: clip("hrx", "shoes"),
        caption: {
          title: "Shoes",
          text: "Racing shoes take logos the same way, from a picker that switches product.",
        },
      },
      {
        src: "/case/hrx/tablet.webp",
        ratio: 3 / 4,
        alt: "The configurator's render full screen on a tablet, the suit changing through several graphics.",
        video: clip("hrx", "tablet"),
        caption: {
          title: "Tablet",
          text: "The same Unreal stream, full screen on a tablet.",
        },
      },
    ],
  },
]
