import type { Locale } from "@/lib/i18n"

/**
 * The words the code supplies: headings, buttons, labels. Everything else, the
 * content, is in Payload and translated in /admin. A string added to `en`
 * without an Italian twin is a type error, so the two cannot drift.
 */
const en = {
  /** The site's meta description. */
  description:
    "Software engineer in Italy. Clinical software at Clover Next, and real-time 3D for the web. Next.js, TypeScript, Three.js, Unreal Engine.",
  /** Names the switcher for screen readers. */
  language: "Language",
  home: {
    profile: "Profile",
    work: "Selected work",
    aboutTab: "About",
    workTab: "Work",
  },
  startProject: "Start a project",
  intro: { getInTouch: "Get in touch", downloadCv: "Download CV" },
  sections: { about: "About me", skills: "Skills", experience: "Experience" },
  footer: { rights: "All rights reserved.", backToTop: "Back to top" },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    toggle: "Switch theme",
    hint: "Switch theme (d)",
  },
  project: {
    back: "Back",
    live: "Live preview",
    details: (title: string) => `${title} details`,
    images: (title: string) => `${title} images`,
    detailsTab: "Details",
    imagesTab: "Images",
    company: "Company",
    year: "Year",
    category: "Category",
    stack: "Stack",
    role: "Role",
    duration: "Duration",
    challenge: "Challenge",
    solution: "Solution",
    results: "Results",
    team: "Team",
  },
  media: { enlarge: "Enlarge", playClip: "Play clip", close: "Close" },
  /** The open end of a job that is still going. */
  present: "Present",
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  /** Standard section names, so an applicant tracking system can map them. */
  cv: {
    title: (name: string) => `${name} CV`,
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    caseStudy: "Case study",
    skills: "Skills",
    technologies: "Technologies",
    education: "Education",
    languages: "Languages",
  },
}

export type Dictionary = typeof en

const it: Dictionary = {
  description:
    "Software engineer in Italia. Software clinico in Clover Next e 3D in tempo reale per il web. Next.js, TypeScript, Three.js, Unreal Engine.",
  language: "Lingua",
  home: {
    profile: "Profilo",
    work: "Lavori selezionati",
    aboutTab: "Chi sono",
    workTab: "Lavori",
  },
  startProject: "Iniziamo un progetto",
  intro: { getInTouch: "Contattami", downloadCv: "Scarica il CV" },
  sections: {
    about: "Chi sono",
    skills: "Competenze",
    experience: "Esperienza",
  },
  footer: { rights: "Tutti i diritti riservati.", backToTop: "Torna su" },
  theme: {
    toLight: "Passa al tema chiaro",
    toDark: "Passa al tema scuro",
    toggle: "Cambia tema",
    hint: "Cambia tema (d)",
  },
  project: {
    back: "Indietro",
    live: "Anteprima live",
    details: (title) => `Dettagli di ${title}`,
    images: (title) => `Immagini di ${title}`,
    detailsTab: "Dettagli",
    imagesTab: "Immagini",
    company: "Azienda",
    year: "Anno",
    category: "Categoria",
    stack: "Stack",
    role: "Ruolo",
    duration: "Durata",
    challenge: "Sfida",
    solution: "Soluzione",
    results: "Risultati",
    team: "Team",
  },
  media: {
    enlarge: "Ingrandisci",
    playClip: "Riproduci il video",
    close: "Chiudi",
  },
  // Lower case, as Italian writes it mid-range: "2026–oggi".
  present: "oggi",
  months: [
    "gen",
    "feb",
    "mar",
    "apr",
    "mag",
    "giu",
    "lug",
    "ago",
    "set",
    "ott",
    "nov",
    "dic",
  ],
  cv: {
    title: (name) => `CV di ${name}`,
    summary: "Profilo",
    experience: "Esperienza",
    projects: "Progetti",
    caseStudy: "Case study",
    skills: "Competenze",
    technologies: "Tecnologie",
    education: "Formazione",
    languages: "Lingue",
  },
}

export const DICTIONARIES: Record<Locale, Dictionary> = { en, it }
