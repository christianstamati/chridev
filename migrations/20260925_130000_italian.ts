import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-vercel-postgres"
import type { Profile } from "@/payload-types"

/**
 * Hand-written. The Italian for everything on the site when localization
 * arrived, filled in through the local API so versions and hooks behave as they
 * would for an edit in /admin.
 *
 * Keyed by the English exactly as it stood in the database. A string that has
 * changed since is left alone and logged, and the site shows its English (the
 * localization fallback) until someone translates it in /admin. That also
 * covers dev and production drifting apart: each gets only what matches.
 *
 * Job titles stay in English, as they do on Italian CVs in tech. "Ingegnere"
 * is a protected title in Italy, so Software Engineer is not translated.
 */
const ITALIAN: Record<string, string> = {
  // Project: 3D Configurator
  "3D Configurator": "Configuratore 3D",
  Platform: "Piattaforma",
  "3D": "3D",
  "A no-code platform for building and publishing interactive 3D experiences without an engineer.":
    "Una piattaforma no-code per creare e pubblicare esperienze 3D interattive senza bisogno di uno sviluppatore.",
  "Fullstack Engineer": "Fullstack Engineer",
  "Every 3D experience was built by an engineer. A developer set up the model, its materials and the options a customer could pick, and nothing could be shown until that was done. Every change after it was another ticket, so each experience moved at the speed of the dev queue.":
    "Ogni esperienza 3D richiedeva uno sviluppatore: preparava il modello, i materiali e le opzioni tra cui il cliente poteva scegliere, e finché non aveva finito non si poteva mostrare nulla. Ogni modifica successiva era un nuovo ticket, quindi ogni esperienza avanzava al ritmo della coda di sviluppo.",
  "I built it so making an experience no longer needs an engineer. A workspace holds the projects, and teammates join by email invite with a role. The material editor builds PBR materials from the project's own textures, one channel at a time, and previews each change on a sphere, a cube or a plane. Lighting comes from a preset or a custom HDRI, and a post-processing stack finishes the look with ambient occlusion, bloom, tone mapping and colour adjustments.\n\nNext comes what the customer is allowed to change. The variant manager sorts options into sets, a headset colour or a headrest colour, and each option carries a price, a thumbnail and the material it swaps in. An option can depend on one in another set, so picking it switches that one on too. Decals mark numbered zones on the surface, and each zone becomes a slot the customer fills with an image or a line of text.\n\nPublishing cuts a numbered version and hands back a public URL, so an experience goes live without a deploy. The export decides what that version exposes: orbit controls, prices and a running total, a summary the customer can download as a PDF, the 2D sticker editor, the post-processing, and a brand logo on the loading screen. On a phone the options move into a bottom sheet and the sticker editor goes full screen.":
    "L'ho progettata in modo che creare un'esperienza non richieda più uno sviluppatore. Un workspace raccoglie i progetti, e i colleghi entrano con un invito via email e un ruolo. L'editor dei materiali crea materiali PBR dalle texture del progetto stesso, un canale alla volta, e mostra l'anteprima di ogni modifica su una sfera, un cubo o un piano. L'illuminazione arriva da un preset o da un HDRI personalizzato, e uno stack di post-processing rifinisce il risultato con ambient occlusion, bloom, tone mapping e correzioni colore.\n\nPoi viene ciò che il cliente può cambiare. Il gestore delle varianti raccoglie le opzioni in set, come il colore delle cuffie o quello dell'archetto, e ogni opzione ha un prezzo, una miniatura e il materiale che applica. Un'opzione può dipendere da un'altra in un set diverso, così sceglierla attiva anche quella. Le decal segnano zone numerate sulla superficie, e ogni zona diventa uno spazio che il cliente riempie con un'immagine o una riga di testo.\n\nPubblicare crea una versione numerata e restituisce un URL pubblico, così un'esperienza va online senza un deploy. L'export decide cosa mostra quella versione: controlli orbitali, prezzi e totale aggiornato, un riepilogo che il cliente può scaricare in PDF, l'editor 2D degli sticker, il post-processing e il logo del brand nella schermata di caricamento. Su smartphone le opzioni passano in un bottom sheet e l'editor degli sticker va a schermo intero.",
  "Building an experience stopped being an engineering ticket. The people who need one build and publish it themselves.\n\nA new price is an edit and a new version, not a release.":
    "Creare un'esperienza non è più un ticket per il team di sviluppo. Chi ne ha bisogno la costruisce e la pubblica da sé.\n\nUn nuovo prezzo è una modifica e una nuova versione, non un rilascio.",
  Workspace: "Workspace",
  "Every project in one place, and teammates invited by email with a role.":
    "Tutti i progetti in un unico posto, e i colleghi invitati via email con un ruolo.",
  "Material editor": "Editor dei materiali",
  "PBR materials built from the project's own textures, one channel at a time.":
    "Materiali PBR creati dalle texture del progetto, un canale alla volta.",
  "Variant manager": "Gestore delle varianti",
  "Option sets, each option with a price, a thumbnail and the material it swaps in.":
    "Set di opzioni, ognuna con un prezzo, una miniatura e il materiale che applica.",
  Decals: "Decal",
  "Numbered zones on the surface, which the customer fills with their own artwork.":
    "Zone numerate sulla superficie, che il cliente riempie con la propria grafica.",
  "Post-processing": "Post-processing",
  "Bloom, ambient occlusion and tone mapping, tuned on the live scene.":
    "Bloom, ambient occlusion e tone mapping, regolati sulla scena dal vivo.",
  Publish: "Pubblicazione",
  "Every publish is a numbered version with its own public URL.":
    "Ogni pubblicazione è una versione numerata con il suo URL pubblico.",
  Viewer: "Viewer",
  "The published experience, with options, stickers and a priced summary to download.":
    "L'esperienza pubblicata, con opzioni, sticker e un riepilogo con i prezzi da scaricare.",
  "Mobile 2D editor": "Editor 2D su mobile",
  "The sticker editor goes full screen on a phone, and the result lands on the product.":
    "Su smartphone l'editor degli sticker va a schermo intero, e il risultato finisce sul prodotto.",
  "Mobile variants": "Varianti su mobile",
  "Options sit in a bottom sheet, and the total follows every pick.":
    "Le opzioni stanno in un bottom sheet, e il totale segue ogni scelta.",

  // Project: Modesto Bertotto
  "Modesto Bertotto": "Modesto Bertotto",
  "Cloud 3D": "Cloud 3D",
  Configurator: "Configuratore",
  "A wedding suit configurator with cloud-rendered fabric and a wizard that narrows the catalogue before you start.":
    "Un configuratore di abiti da cerimonia con tessuti renderizzati in cloud e un wizard che restringe il catalogo prima di iniziare.",
  CEO: "CEO",
  "Project Manager": "Project Manager",
  "Pattern Maker": "Modellista",
  "3D Artist": "3D Artist",
  "Picking a wedding suit is a fabric problem. The cloth has to suit the season and the venue, the catalogue holds more textures and weights than anyone can keep straight, and no shop has the floor space to stock every bolt.":
    "Scegliere un abito da cerimonia è una questione di tessuto. La stoffa deve adattarsi alla stagione e al luogo, il catalogo contiene più trame e grammature di quante chiunque riesca a ricordare, e nessun negozio ha lo spazio per tenere ogni pezza.",
  "Most configurators render on the customer's own device with Three.js and start instantly. This one streams Unreal Engine from a Windows application on server hardware instead, trading startup time for fabric that looks like fabric. Unreal's Variant Manager holds the meshes and materials from Vasco and Riccardo, so changing a cloth is a variant switch rather than new code. A Next.js and Tailwind frontend drives it over WebSocket. An opening wizard asks a few questions to suggest a starting outfit, which also covers the virtual machine's boot time. Customers export a render and take it into the shop.":
    "La maggior parte dei configuratori renderizza sul dispositivo del cliente con Three.js e parte subito. Questo invece trasmette in streaming Unreal Engine da un'applicazione Windows su hardware server, scambiando il tempo di avvio con un tessuto che sembra davvero tessuto. Il Variant Manager di Unreal contiene le mesh e i materiali di Vasco e Riccardo, così cambiare stoffa è un cambio di variante e non nuovo codice. Un frontend in Next.js e Tailwind lo pilota via WebSocket. Un wizard iniziale fa qualche domanda per suggerire un outfit di partenza, e intanto copre il tempo di avvio della macchina virtuale. I clienti esportano un render e lo portano in negozio.",
  "Live on the brand site, and it did what it was built to do: bring visitors up. Startup still takes about two minutes. Most people wait it out, some do not, and cutting that boot time is the next job.":
    "È online sul sito del brand e ha fatto ciò per cui era nato: aumentare le visite. L'avvio richiede ancora circa due minuti. La maggior parte delle persone aspetta, qualcuno no, e ridurre quel tempo di avvio è il prossimo lavoro.",
  "Pick a garment, then its model and cloth. Every change renders in Unreal on a server.":
    "Scegli un capo, poi il modello e la stoffa. Ogni modifica viene renderizzata in Unreal su un server.",
  Wizard: "Wizard",
  "A few questions suggest a starting outfit, and a tutorial plays while the server builds it.":
    "Poche domande suggeriscono un outfit di partenza, e un tutorial accompagna l'attesa mentre il server lo prepara.",
  "Fabric zoom": "Zoom sul tessuto",
  "Close enough to read the weave, which is the reason it renders on a server.":
    "Abbastanza vicino da leggere la trama, ed è per questo che il rendering avviene su un server.",
  "Summary download": "Download del riepilogo",
  "The finished look and every choice behind it, saved to bring into the shop.":
    "Il look finito e ogni scelta che lo compone, salvati da portare in negozio.",
  "Shoes and accessories": "Scarpe e accessori",
  "Shoe colour and accessories finish the outfit.":
    "Il colore delle scarpe e gli accessori completano l'outfit.",
  "Mobile configurator": "Configuratore su mobile",
  "The same choices on a phone, in a sheet under the suit.":
    "Le stesse scelte su smartphone, in un pannello sotto l'abito.",
  "Mobile summary": "Riepilogo su mobile",
  "Turn the suit around, then review the outfit and save it.":
    "Fai girare l'abito, poi rivedi l'outfit e salvalo.",

  // Project: Size Flow
  "Size Flow": "Size Flow",
  Widget: "Widget",
  "E-commerce": "E-commerce",
  "A size-suggestion widget that installs on any product page, whatever the store runs on.":
    "Un widget che suggerisce la taglia e si installa su qualsiasi pagina prodotto, su qualunque piattaforma giri il negozio.",
  "Size Flow suggests a size on the product page, and it reached each store through a Google Tag Manager script. Every client ran a different e-commerce platform, so anything built for one framework meant a custom integration per store. Getting the fit wrong cost the customer a return.":
    "Size Flow suggerisce una taglia nella pagina prodotto, e arrivava in ogni negozio tramite uno script di Google Tag Manager. Ogni cliente usava una piattaforma e-commerce diversa, quindi qualsiasi cosa costruita per un solo framework significava un'integrazione su misura per ogni negozio. Sbagliare la vestibilità costava al cliente un reso.",
  "I helped refactor the Google Tag Manager script that installed the widget, then simplified the setup into several install scripts, each ready for a different e-commerce site. Once it is on a product page, the widget reads the product's SKU, which is how it knows which garment it is sizing.\n\nI studied Web Components for this and built the widget with Lit, so it runs inside a store whatever that store is built on. It opens a panel, a small web app where shoppers manage their profiles. A profile asks only for simple data, such as height, weight and age, and an optional step refines the body shape with three sliders for shoulders, hips and waist.\n\nFrom the profile and the SKU, the widget suggests a size and shows how it will fit: a label such as slim fit or comfort fit, where the garment sits between tight and loose at the chest and the waist, and the size to try next. The profile carries over to the next product.":
    "Ho contribuito al refactoring dello script di Google Tag Manager che installava il widget, poi ho semplificato la configurazione in diversi script di installazione, ognuno pronto per un e-commerce diverso. Una volta sulla pagina prodotto, il widget legge lo SKU del prodotto, ed è così che sa quale capo sta misurando.\n\nPer questo ho studiato i Web Components e ho costruito il widget con Lit, così funziona dentro qualsiasi negozio, su qualunque tecnologia sia costruito. Apre un pannello, una piccola web app in cui gli acquirenti gestiscono i propri profili. Un profilo chiede solo dati semplici, come altezza, peso ed età, e un passaggio facoltativo affina la forma del corpo con tre slider per spalle, fianchi e vita.\n\nDal profilo e dallo SKU, il widget suggerisce una taglia e mostra come vestirà: un'etichetta come slim fit o comfort fit, dove si colloca il capo tra aderente e morbido su petto e vita, e la taglia successiva da provare. Il profilo resta valido anche per il prodotto successivo.",
  Profile: "Profilo",
  "Nickname, gender, height, weight and age are all a profile needs.":
    "Nickname, genere, altezza, peso ed età: a un profilo non serve altro.",
  "On the product page": "Sulla pagina prodotto",
  "The widget opens over the product it was installed on, here on Sportful.":
    "Il widget si apre sopra il prodotto su cui è installato, qui su Sportful.",
  "Body shape": "Forma del corpo",
  "Three sliders for shoulders, hips and waist, here on Karpos.":
    "Tre slider per spalle, fianchi e vita, qui su Karpos.",
  "Size suggestion": "Taglia consigliata",
  "A size, a fit label, and chest and waist placed between tight and loose.":
    "Una taglia, un'etichetta di vestibilità, e petto e vita collocati tra aderente e morbido.",
  Tablet: "Tablet",
  "The same flow on a Castelli store, on a tablet.":
    "Lo stesso flusso su un negozio Castelli, da tablet.",
  "Mobile profile": "Profilo su mobile",
  "From the size row on the product page straight into the profile.":
    "Dalla riga delle taglie nella pagina prodotto direttamente al profilo.",
  "Mobile body shape": "Forma del corpo su mobile",
  "The same three sliders on a phone.": "Gli stessi tre slider su smartphone.",
  "Mobile size suggestion": "Taglia consigliata su mobile",
  "The suggested size, the next one to try, and the size table behind it.":
    "La taglia consigliata, la prossima da provare e la tabella taglie da cui nasce.",

  // Project: HRX
  HRX: "HRX",
  "A made-to-order race suit configurator. Sponsors, flags and lettering, priced as you place them.":
    "Un configuratore di tute da gara su misura. Sponsor, bandiere e scritte, con il prezzo aggiornato mentre li posizioni.",
  "Unreal Engine Developer": "Unreal Engine Developer",
  "A race suit carries more options than a product page can hold. A base graphic, a pattern per zone, colours for knit and cuff, sponsor logos in five chest and arm positions, a flag, lettering in a racing face, then pockets, cooling holes and a size. Every one of those moves the price, and nobody signs off on a suit they cannot see.":
    "Una tuta da gara ha più opzioni di quante ne possa contenere una pagina prodotto. Una grafica di base, un motivo per ogni zona, i colori per maglina e polsini, loghi degli sponsor in cinque posizioni tra petto e braccia, una bandiera, scritte in un font racing, poi tasche, fori di ventilazione e taglia. Ognuna di queste scelte cambia il prezzo, e nessuno approva una tuta che non può vedere.",
  "The configurator lives in the HRX store and holds the whole specification. A base graphic comes first, then patterns and colours zone by zone, then sponsor logos, flags and lettering placed in numbered zones on the suit itself. Racing shoes work the same way. The price follows every change, and the finished suit goes to the cart.\n\nMy side was Unreal Engine. The suit renders in Unreal on a remote machine and streams to the browser, and I built the WebSocket API that carries each choice from the page into the scene. I also managed the Unreal content and was the contact for the 3D designers who made it.\n\nA colleague built the frontend, which takes its content from Payload CMS. Two parts of it are mine: the loading screen, which plays racing footage while the stream connects, and the 2D editor, where a customer writes a line in a racing font, uploads a logo or picks a flag before placing it on the suit.":
    "Il configuratore vive nello store di HRX e contiene l'intera specifica. Prima si sceglie una grafica di base, poi motivi e colori zona per zona, poi loghi degli sponsor, bandiere e scritte posizionati in zone numerate direttamente sulla tuta. Le scarpe da gara funzionano allo stesso modo. Il prezzo segue ogni modifica, e la tuta finita va nel carrello.\n\nLa mia parte era Unreal Engine. La tuta viene renderizzata in Unreal su una macchina remota e trasmessa in streaming al browser, e ho costruito l'API WebSocket che porta ogni scelta dalla pagina alla scena. Ho anche gestito i contenuti Unreal e sono stato il riferimento per i 3D designer che li hanno realizzati.\n\nUn collega ha costruito il frontend, che prende i contenuti da Payload CMS. Due parti sono mie: la schermata di caricamento, che mostra riprese di gara mentre lo stream si connette, e l'editor 2D, dove il cliente scrive una riga in un font racing, carica un logo o sceglie una bandiera prima di posizionarlo sulla tuta.",
  "Live in the HRX store, where a configured suit goes straight to the cart.":
    "Online nello store di HRX, dove una tuta configurata va direttamente nel carrello.",
  "A base graphic first, then patterns and colours zone by zone.":
    "Prima una grafica di base, poi motivi e colori zona per zona.",
  "Loading screen": "Schermata di caricamento",
  "Racing footage fills the wait while the Unreal stream connects.":
    "Riprese di gara riempiono l'attesa mentre lo stream di Unreal si connette.",
  "2D editor, chest": "Editor 2D, petto",
  "Text in a racing font, an uploaded logo or a flag, placed in a numbered zone.":
    "Testo in un font racing, un logo caricato o una bandiera, posizionati in una zona numerata.",
  "Logo zones": "Zone logo",
  "Five numbered zones on the chest, each taking a sponsor, a flag or text.":
    "Cinque zone numerate sul petto, ognuna per uno sponsor, una bandiera o un testo.",
  "2D editor, back": "Editor 2D, schiena",
  "The same editor for the two zones across the back.":
    "Lo stesso editor per le due zone sulla schiena.",
  Shoes: "Scarpe",
  "Racing shoes take logos the same way, from a picker that switches product.":
    "Le scarpe da gara ricevono i loghi allo stesso modo, da un selettore che cambia prodotto.",
  "The same Unreal stream, full screen on a tablet.":
    "Lo stesso stream di Unreal, a schermo intero su tablet.",

  // Media alt text
  "The platform on a laptop, from its landing page into a workspace's projects, then the workspace settings where teammates are invited by email with a role.":
    "La piattaforma su un laptop, dalla landing page ai progetti di un workspace, poi le impostazioni del workspace dove i colleghi vengono invitati via email con un ruolo.",
  "The material editor building a speaker material from the project's textures, adding normal and roughness maps and previewing them on a sphere and a plane.":
    "L'editor dei materiali che crea il materiale di un altoparlante dalle texture del progetto, aggiungendo normal map e roughness map e mostrandone l'anteprima su una sfera e un piano.",
  "The variant manager, where a new pink option joins the headrest colour set and recolours the headband once its material is set.":
    "Il gestore delle varianti, dove una nuova opzione rosa entra nel set dei colori dell'archetto e, una volta impostato il materiale, lo ricolora.",
  "Placing a numbered decal zone on the ear cup, then resizing and rotating it from the decals panel.":
    "Una zona decal numerata posizionata sul padiglione, poi ridimensionata e ruotata dal pannello delle decal.",
  "Tuning post-processing on the scene, bloom and ambient occlusion first, then tone mapping switched to ACES Filmic.":
    "La regolazione del post-processing sulla scena, prima bloom e ambient occlusion, poi il tone mapping impostato su ACES Filmic.",
  "Publishing the scene as its first version, which goes live at a public URL, then opening that URL in the viewer.":
    "La scena pubblicata come prima versione, che va online a un URL pubblico, poi quell'URL aperto nel viewer.",
  "The published viewer on a laptop. A logo and a line of text go onto a sticker slot through the 2D editor, then the priced summary opens with a PDF download.":
    "Il viewer pubblicato su un laptop. Un logo e una riga di testo finiscono in uno spazio sticker tramite l'editor 2D, poi si apre il riepilogo con i prezzi e il download in PDF.",
  "The viewer on a phone, uploading a logo into a sticker slot, placing it in the full-screen 2D editor and seeing it land on the ear cup.":
    "Il viewer su smartphone: un logo caricato in uno spazio sticker, posizionato nell'editor 2D a schermo intero e poi visibile sul padiglione.",
  "Changing the headset colour on a phone, the total following each option, then the summary with its price breakdown.":
    "Il colore delle cuffie cambiato su smartphone, con il totale che segue ogni opzione, poi il riepilogo con il dettaglio dei prezzi.",
  "The configurator on a laptop: jacket model, hem and buttons picked on a green suit, then the cloth changed to navy, black and blue from the fabric catalogue.":
    "Il configuratore su un laptop: modello della giacca, orlo e bottoni scelti su un abito verde, poi la stoffa cambiata in blu navy, nero e blu dal catalogo tessuti.",
  "The opening wizard: an introduction, a groom-or-guest choice and a suggested outfit, then a tutorial on the configurator while the suit is built.":
    "Il wizard iniziale: un'introduzione, la scelta tra sposo e ospite e un outfit suggerito, poi un tutorial sul configuratore mentre l'abito viene preparato.",
  "Super-zoom on the waistcoat as its cloth changes from plain weaves to a blue paisley damask.":
    "Super zoom sul gilet mentre la stoffa passa da armature tela a un damascato paisley blu.",
  "The summary rendering on a laptop, listing the choices for each garment above a save button.":
    "Il riepilogo che si genera su un laptop, con le scelte per ogni capo sopra un pulsante di salvataggio.",
  "Choosing the shoe colour close up, then accessories, then the whole green suit.":
    "La scelta del colore delle scarpe da vicino, poi gli accessori, poi l'intero abito verde.",
  "The configurator on a phone, switching jacket models on a cream jacket, then changing it to navy and a black damask.":
    "Il configuratore su smartphone: il cambio di modello su una giacca color crema, poi il passaggio al blu navy e a un damascato nero.",
  "On a phone, the suit turns to show its back, then the summary lists the shirt, trousers, accessories and shoes.":
    "Su smartphone l'abito ruota per mostrare la schiena, poi il riepilogo elenca camicia, pantaloni, accessori e scarpe.",
  "The profile form on a Sportful product page: nickname, gender, height, weight and age filled in one after another.":
    "Il modulo del profilo su una pagina prodotto Sportful: nickname, genere, altezza, peso ed età compilati uno dopo l'altro.",
  "The size widget open over a Sportful product page, recommending a size with the fit shown as a spectrum.":
    "Il widget delle taglie aperto sopra una pagina prodotto Sportful, che consiglia una taglia con la vestibilità mostrata come uno spettro.",
  "Refining the body shape on a Karpos product page: sliders for shoulders, hips and waist reshape a body model, then the measurements are processed.":
    "La forma del corpo affinata su una pagina prodotto Karpos: gli slider per spalle, fianchi e vita modellano un corpo 3D, poi le misure vengono elaborate.",
  "The size suggestion on Sportful changing between M, S and 3XL as the measurements are edited, with chest and waist placed between tight and loose.":
    "La taglia consigliata su Sportful che passa tra M, S e 3XL mentre si modificano le misure, con petto e vita collocati tra aderente e morbido.",
  "The widget on a Castelli product page on a tablet: the profile form, then the body-shape sliders.":
    "Il widget su una pagina prodotto Castelli da tablet: il modulo del profilo, poi gli slider della forma del corpo.",
  "On a phone, Find your ideal size opens from the size row of a Castelli product page, and the profile form is filled in with the keyboard.":
    "Su smartphone, Find your ideal size si apre dalla riga delle taglie di una pagina prodotto Castelli, e il modulo del profilo viene compilato con la tastiera.",
  "The body-shape sliders on a phone, reshaping the body model.":
    "Gli slider della forma del corpo su smartphone, che modellano il corpo 3D.",
  "On a phone, the suggested size moving between ideal fit, oversize and comfort fit, then the size table with the suggested size marked.":
    "Su smartphone, la taglia consigliata che passa tra ideal fit, oversize e comfort fit, poi la tabella taglie con la taglia consigliata evidenziata.",
  "The configurator on a laptop: the race suit switching between base graphics and colourways, then the colour palette for one pattern zone.":
    "Il configuratore su un laptop: la tuta da gara che passa tra grafiche di base e varianti colore, poi la palette colori di una zona del motivo.",
  "The loading screen: racing footage plays behind a Connecting card while the session starts.":
    "La schermata di caricamento: riprese di gara scorrono dietro una scheda Connecting mentre la sessione si avvia.",
  "The 2D editor: text set in a racing font, then a flag picked from the library, each placed on the chest of the suit.":
    "L'editor 2D: un testo in un font racing, poi una bandiera scelta dalla libreria, ciascuno posizionato sul petto della tuta.",
  "A sponsor logo on the chest, with the five logo positions outlined.":
    "Un logo sponsor sul petto, con le cinque posizioni dei loghi evidenziate.",
  "The 2D editor on the back of the suit: text in a racing font placed in the second of two zones across the shoulders.":
    "L'editor 2D sulla schiena della tuta: un testo in un font racing posizionato nella seconda delle due zone sulle spalle.",
  "Racing shoes in the configurator: two logo zones on the side, a Michelin logo placed from the library, then the product picker.":
    "Scarpe da gara nel configuratore: due zone logo sul lato, un logo Michelin posizionato dalla libreria, poi il selettore di prodotto.",
  "The configurator's render full screen on a tablet, the suit changing through several graphics.":
    "Il render del configuratore a schermo intero su tablet, con la tuta che cambia tra diverse grafiche.",
  "Christian Stamati": "Christian Stamati",
  "Christian Stamati CV": "CV di Christian Stamati",

  // Profile. Rich text is translated run by run, so a Dim run or a link keeps
  // its place in the sentence.
  "Software Engineer": "Software Engineer",
  Italy: "Italia",
  "I build web products and real-time 3D":
    "Realizzo prodotti web e 3D in tempo reale",
  ", from data-heavy interfaces to product configurators that run in the browser, ":
    ", dalle interfacce ricche di dati ai configuratori di prodotto che girano nel browser, ",
  "focused on speed, clarity and making complicated tools easy to use.":
    "con attenzione a velocità, chiarezza e strumenti complessi resi facili da usare.",
  "I'm a software engineer in Italy. Currently I work at ":
    "Sono un software engineer in Italia. Attualmente lavoro in ",
  "Clover Next": "Clover Next",
  ", building web applications for clinicians and patients. Previously, I worked at ":
    ", dove sviluppo applicazioni web per medici e pazienti. In precedenza ho lavorato in ",
  "WE WEAR": "WE WEAR",
  " on 3D configurators and virtual try-on.":
    " su configuratori 3D e virtual try-on.",
  "I came up through 3D and interactive media, so I tend to reach for the graphics answer first. These days that means Three.js in a browser tab, or Unreal Engine streamed off a server when the pixels need to be better than a browser can manage on its own.":
    "Vengo dal 3D e dai media interattivi, quindi tendo a cercare prima la risposta grafica. Oggi significa Three.js in una scheda del browser, oppure Unreal Engine in streaming da un server quando i pixel devono essere migliori di quanto un browser riesca a gestire da solo.",

  // Resume: skills and stack groups
  Frontend: "Frontend",
  "React and Next.js": "React e Next.js",
  "TypeScript end to end": "TypeScript end-to-end",
  "Tailwind CSS and shadcn/ui": "Tailwind CSS e shadcn/ui",
  "Design systems and component libraries":
    "Design system e librerie di componenti",
  "Motion and interaction detail": "Animazioni e cura delle interazioni",
  "Accessibility and keyboard support":
    "Accessibilità e navigazione da tastiera",
  "Product engineering": "Product engineering",
  "Data-heavy interfaces": "Interfacce ricche di dati",
  "Client state and data fetching at scale":
    "Stato client e data fetching su larga scala",
  "Performance and Core Web Vitals": "Performance e Core Web Vitals",
  "Clinical and regulated workflows": "Flussi clinici e regolamentati",
  "Backend and data": "Backend e dati",
  "Node.js APIs": "API in Node.js",
  "Schema design and migrations": "Progettazione di schemi e migrazioni",
  "Auth and access control": "Autenticazione e controllo degli accessi",
  "Convex, MongoDB and Drizzle": "Convex, MongoDB e Drizzle",
  "Headless CMS integration": "Integrazione di CMS headless",
  "Real-time 3D": "3D in tempo reale",
  "Three.js and React Three Fiber": "Three.js e React Three Fiber",
  "WebGPU and TSL shaders": "WebGPU e shader TSL",
  "3D product configurators": "Configuratori di prodotto 3D",
  "Unreal Engine streamed to the browser":
    "Unreal Engine in streaming nel browser",
  "glTF pipelines and asset budgets": "Pipeline glTF e budget degli asset",
  "Embeddable Web Components": "Web Components integrabili",
  "Creative tech": "Creative tech",
  "Backend & data": "Backend e dati",
  "Design & 3D": "Design e 3D",

  // Resume: experience
  "Build web applications for a cloud healthcare platform used by clinicians and patients.\nHelp build the new platform on a modern stack designed to work well with AI tools.\nImprove the team's developer experience.":
    "Sviluppo applicazioni web per una piattaforma sanitaria in cloud usata da medici e pazienti.\nContribuisco alla nuova piattaforma, su uno stack moderno pensato per lavorare bene con gli strumenti di AI.\nMiglioro la developer experience del team.",
  "Built a no-code 3D platform so anyone could put together an interactive 3D experience without waiting on an engineer. Shipped the virtual try-on widget as Web Components, and moved the main app onto TanStack Query and Zustand when client-side API load started hurting. Argued for dropping Unity in favour of a web-native Next.js frontend so customers could reach the product from a URL, then led the Modesto Bertotto build that opened a new revenue line.":
    "Ho costruito una piattaforma 3D no-code con cui chiunque può creare un'esperienza 3D interattiva senza aspettare uno sviluppatore. Ho rilasciato il widget di virtual try-on come Web Components, e ho portato l'app principale su TanStack Query e Zustand quando il carico delle API lato client ha iniziato a pesare. Ho sostenuto l'abbandono di Unity a favore di un frontend nativo per il web in Next.js, così che i clienti potessero raggiungere il prodotto da un URL, poi ho guidato lo sviluppo di Modesto Bertotto, che ha aperto una nuova linea di ricavi.",
  "Research Collaborator": "Collaboratore di ricerca",
  "Built an experimental virtual production stage on LED walls, wiring Unreal Engine to physical MIDI controllers. Latency made it unusable at first. Once I found the real cause, directors could relight a scene from the desk mid-shoot.":
    "Ho costruito un set sperimentale di virtual production su LED wall, collegando Unreal Engine a controller MIDI fisici. All'inizio la latenza lo rendeva inutilizzabile. Una volta trovata la vera causa, i registi potevano reilluminare una scena dalla console durante le riprese.",
  "Software Engineering Intern": "Stagista in Software Engineering",
  "Body measurement in Unity. Wrote the logic that turned raw measurements into 3D blend shapes.":
    "Misurazione del corpo in Unity. Ho scritto la logica che trasformava le misure grezze in blend shape 3D.",

  // Resume: education and languages
  "Bachelor's Degree in Creative Technologies":
    "Laurea triennale in Creative Technologies",
  "Computer science and interactive media.":
    "Informatica e media interattivi.",
  "Diploma in Graphic Design": "Diploma in grafica",
  Italian: "Italiano",
  Native: "Madrelingua",
  English: "Inglese",
  Professional: "Professionale",
  Romanian: "Rumeno",
  Conversational: "Conversazionale",

  // Contact. Dev still has the heading with its full stop.
  "Reach out": "Scrivimi",
  "Reach out.": "Scrivimi.",
  "Open to interesting problems in product engineering or real-time 3D. Email is the fastest way to reach me.":
    "Aperto a problemi interessanti di product engineering o 3D in tempo reale. L'email è il modo più rapido per raggiungermi.",
}

type RichText = Profile["intro"]
type Node = { text?: unknown; children?: Node[] }

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const missing = new Set<string>()
  const it = (en: string) => {
    const text = ITALIAN[en]
    if (text === undefined) missing.add(en)
    return text ?? en
  }
  const maybe = (en: string | null | undefined) => (en ? it(en) : en)
  const words = (node: Node): Node => ({
    ...node,
    ...(typeof node.text === "string" && { text: it(node.text) }),
    ...(node.children && { children: node.children.map(words) }),
  })
  const rich = (state: RichText): RichText => ({
    ...state,
    root: words(state.root as Node) as RichText["root"],
  })

  // Read the English, write the Italian. Revalidation needs a Next request,
  // and the deploy that runs this renders every page afterwards anyway.
  const read = { locale: "en", depth: 0, req } as const
  const write = {
    locale: "it",
    req,
    context: { disableRevalidate: true },
  } as const

  const media = await payload.find({
    collection: "media",
    pagination: false,
    ...read,
  })
  for (const doc of media.docs) {
    if (!doc.alt) continue
    await payload.update({
      collection: "media",
      id: doc.id,
      data: { alt: it(doc.alt) },
      ...write,
    })
  }

  // Arrays go back whole, row ids included: the rows are shared between
  // locales and only their localized fields differ.
  const projects = await payload.find({
    collection: "projects",
    pagination: false,
    ...read,
  })
  for (const doc of projects.docs) {
    await payload.update({
      collection: "projects",
      id: doc.id,
      data: {
        title: it(doc.title),
        categories: doc.categories.map(it),
        excerpt: it(doc.excerpt),
        role: maybe(doc.role),
        duration: maybe(doc.duration),
        challenge: it(doc.challenge),
        solution: it(doc.solution),
        results: maybe(doc.results),
        team: doc.team?.map((member) => ({ ...member, role: it(member.role) })),
        media: doc.media.map((item) => ({
          ...item,
          caption: {
            title: maybe(item.caption?.title),
            text: maybe(item.caption?.text),
          },
        })),
      },
      ...write,
    })
  }

  const profile = await payload.findGlobal({ slug: "profile", ...read })
  await payload.updateGlobal({
    slug: "profile",
    data: {
      role: it(profile.role),
      location: it(profile.location),
      intro: rich(profile.intro),
      about: rich(profile.about),
      // Required in every locale. The English PDF until `bun run cv it`
      // builds the Italian one.
      cv: profile.cv,
    },
    ...write,
  })

  const resume = await payload.findGlobal({ slug: "resume", ...read })
  await payload.updateGlobal({
    slug: "resume",
    data: {
      skills: resume.skills?.map((group) => ({
        ...group,
        title: it(group.title),
        items: group.items.map(it),
      })),
      stack: resume.stack?.map((group) => ({ ...group, group: it(group.group) })),
      experience: resume.experience?.map((job) => ({
        ...job,
        role: it(job.role),
        summary: it(job.summary),
      })),
      education: resume.education?.map((school) => ({
        ...school,
        title: it(school.title),
        detail: maybe(school.detail),
      })),
      languages: resume.languages?.map((language) => ({
        ...language,
        name: it(language.name),
        level: it(language.level),
      })),
    },
    ...write,
  })

  const contact = await payload.findGlobal({ slug: "contact", ...read })
  await payload.updateGlobal({
    slug: "contact",
    data: { heading: it(contact.heading), blurb: it(contact.blurb) },
    ...write,
  })

  if (missing.size > 0) {
    payload.logger.warn({
      msg: `No Italian for ${missing.size} strings. They show in English until translated in /admin.`,
      missing: [...missing],
    })
  }
}

/** Drops the Italian, leaving the English and the per-locale schema. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "projects_locales" WHERE "_locale" = 'it';
  DELETE FROM "projects_team_locales" WHERE "_locale" = 'it';
  DELETE FROM "projects_media_locales" WHERE "_locale" = 'it';
  DELETE FROM "projects_texts" WHERE "locale" = 'it';
  DELETE FROM "_projects_v_locales" WHERE "_locale" = 'it';
  DELETE FROM "_projects_v_version_team_locales" WHERE "_locale" = 'it';
  DELETE FROM "_projects_v_version_media_locales" WHERE "_locale" = 'it';
  DELETE FROM "_projects_v_texts" WHERE "locale" = 'it';
  DELETE FROM "media_locales" WHERE "_locale" = 'it';
  DELETE FROM "profile_locales" WHERE "_locale" = 'it';
  DELETE FROM "_profile_v_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_skills_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_stack_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_experience_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_education_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_languages_locales" WHERE "_locale" = 'it';
  DELETE FROM "resume_texts" WHERE "locale" = 'it';
  DELETE FROM "_resume_v_version_skills_locales" WHERE "_locale" = 'it';
  DELETE FROM "_resume_v_version_stack_locales" WHERE "_locale" = 'it';
  DELETE FROM "_resume_v_version_experience_locales" WHERE "_locale" = 'it';
  DELETE FROM "_resume_v_version_education_locales" WHERE "_locale" = 'it';
  DELETE FROM "_resume_v_version_languages_locales" WHERE "_locale" = 'it';
  DELETE FROM "_resume_v_texts" WHERE "locale" = 'it';
  DELETE FROM "contact_locales" WHERE "_locale" = 'it';
  DELETE FROM "_contact_v_locales" WHERE "_locale" = 'it';`)
}
