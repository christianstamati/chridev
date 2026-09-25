import type {
  MigrateDownArgs,
  MigrateUpArgs,
} from "@payloadcms/db-vercel-postgres"

/**
 * Hand-written. Every job's summary becomes a list of points, one per line,
 * like the current one's. Same words, split where the sentences already
 * turned. Keyed by the exact old text in each language, so a summary edited
 * since is left alone and logged.
 */
const POINTS: Record<"en" | "it", [before: string, after: string][]> = {
  en: [
    [
      "Built a no-code 3D platform so anyone could put together an interactive 3D experience without waiting on an engineer. Shipped the virtual try-on widget as Web Components, and moved the main app onto TanStack Query and Zustand when client-side API load started hurting. Argued for dropping Unity in favour of a web-native Next.js frontend so customers could reach the product from a URL, then led the Modesto Bertotto build that opened a new revenue line.",
      [
        "Built a no-code 3D platform so anyone could put together an interactive 3D experience without waiting on an engineer.",
        "Shipped the virtual try-on widget as Web Components.",
        "Moved the main app onto TanStack Query and Zustand when client-side API load started hurting.",
        "Argued for dropping Unity in favour of a web-native Next.js frontend, so customers could reach the product from a URL.",
        "Led the Modesto Bertotto build, which opened a new revenue line.",
      ].join("\n"),
    ],
    [
      "Built an experimental virtual production stage on LED walls, wiring Unreal Engine to physical MIDI controllers. Latency made it unusable at first. Once I found the real cause, directors could relight a scene from the desk mid-shoot.",
      [
        "Built an experimental virtual production stage on LED walls.",
        "Wired Unreal Engine to physical MIDI controllers.",
        "Found the real cause of the latency that first made it unusable, so directors could relight a scene from the desk mid-shoot.",
      ].join("\n"),
    ],
    [
      "Body measurement in Unity. Wrote the logic that turned raw measurements into 3D blend shapes.",
      [
        "Worked on body measurement in Unity.",
        "Wrote the logic that turned raw measurements into 3D blend shapes.",
      ].join("\n"),
    ],
  ],
  it: [
    [
      "Ho costruito una piattaforma 3D no-code con cui chiunque può creare un'esperienza 3D interattiva senza aspettare uno sviluppatore. Ho rilasciato il widget di virtual try-on come Web Components, e ho portato l'app principale su TanStack Query e Zustand quando il carico delle API lato client ha iniziato a pesare. Ho sostenuto l'abbandono di Unity a favore di un frontend nativo per il web in Next.js, così che i clienti potessero raggiungere il prodotto da un URL, poi ho guidato lo sviluppo di Modesto Bertotto, che ha aperto una nuova linea di ricavi.",
      [
        "Ho costruito una piattaforma 3D no-code con cui chiunque può creare un'esperienza 3D interattiva senza aspettare uno sviluppatore.",
        "Ho rilasciato il widget di virtual try-on come Web Components.",
        "Ho portato l'app principale su TanStack Query e Zustand quando il carico delle API lato client ha iniziato a pesare.",
        "Ho sostenuto l'abbandono di Unity a favore di un frontend nativo per il web in Next.js, così che i clienti potessero raggiungere il prodotto da un URL.",
        "Ho guidato lo sviluppo di Modesto Bertotto, che ha aperto una nuova linea di ricavi.",
      ].join("\n"),
    ],
    [
      "Ho costruito un set sperimentale di virtual production su LED wall, collegando Unreal Engine a controller MIDI fisici. All'inizio la latenza lo rendeva inutilizzabile. Una volta trovata la vera causa, i registi potevano reilluminare una scena dalla console durante le riprese.",
      [
        "Ho costruito un set sperimentale di virtual production su LED wall.",
        "Ho collegato Unreal Engine a controller MIDI fisici.",
        "Ho trovato la vera causa della latenza che all'inizio lo rendeva inutilizzabile, così i registi potevano reilluminare una scena dalla console durante le riprese.",
      ].join("\n"),
    ],
    [
      "Misurazione del corpo in Unity. Ho scritto la logica che trasformava le misure grezze in blend shape 3D.",
      [
        "Ho lavorato alla misurazione del corpo in Unity.",
        "Ho scritto la logica che trasformava le misure grezze in blend shape 3D.",
      ].join("\n"),
    ],
  ],
}

async function rewrite(
  { payload, req }: MigrateUpArgs,
  direction: "forward" | "back"
) {
  for (const locale of ["en", "it"] as const) {
    const pairs = POINTS[locale].map(([before, after]) =>
      direction === "forward" ? [before, after] : [after, before]
    )
    const replace = new Map(pairs as [string, string][])
    const resume = await payload.findGlobal({
      slug: "resume",
      locale,
      fallbackLocale: false,
      depth: 0,
      req,
    })
    let changed = 0
    // Rows go back whole, ids included: they are shared between locales.
    const experience = resume.experience?.map((job) => {
      const summary = replace.get(job.summary)
      if (summary === undefined) return job
      changed++
      return { ...job, summary }
    })
    if (changed < pairs.length) {
      payload.logger.warn({
        msg: `${locale}: ${pairs.length - changed} of ${pairs.length} job summaries had changed since, so they were left as they are.`,
      })
    }
    if (changed === 0) continue
    await payload.updateGlobal({
      slug: "resume",
      locale,
      data: { experience },
      req,
      // Revalidation needs a Next request; the deploy renders every page.
      context: { disableRevalidate: true },
    })
  }
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await rewrite(args, "forward")
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await rewrite(args, "back")
}
