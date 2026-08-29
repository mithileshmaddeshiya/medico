import Image from "next/image";
import LabLeadCard from "./LabLeadCard";

// `hero` and `cityOptions` come from the Firestore-backed page — see
// defaultHero in src/data/lab/defaults.js for the shape and its defaults.
export default function LabHero({ hero, cityOptions }) {
  return (
    <section className="bg-linear-to-b from-emerald-50/70 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-19 sm:pt-24 pb-6 sm:pb-8">

        {/* `items-center` — the banner keeps its own ratio rather than being
            stretched to the form's height, so the two columns are different
            heights and the shorter one centres against the taller. */}
        <div className="grid items-center gap-5 lg:gap-8 lg:grid-cols-12">

          <div className="lg:col-span-8">

            {/* ── THE PAGE'S ONLY H1, AND IT IS INVISIBLE ─────────────────
                Every other lab section starts at h2, so this element is what
                stops the page having no h1 at all.

                It is `sr-only` because the hero shows no heading: the banner
                carries its own headline in the artwork, and a second one in
                text sat awkwardly against it however it was placed.

                ── THE COST, AND IT IS HIGHER HERE THAN ON THE HOME PAGE ───
                A crawler cannot read pixels, and the SAME banner file is the
                hero on every city page. So the dominant element of six pages
                competing for six different towns is byte-identical, and the
                only per-city machine-readable text above the fold is this
                hidden heading and the image alt. Both carry the city name;
                nothing visible does.

                Reversing it is one swap: point defaultHero.image at
                /navheroimage/herocityempty.webp (the same photograph with its
                left side left clear) and this heading can come back visible,
                overlaid on that empty side. */}
            <h1 className="sr-only">
              {hero?.h1}
              {hero?.h1Sub ? `. ${hero.h1Sub}` : ""}
            </h1>

            {/* ── THE BANNER ──────────────────────────────────────────────
                1696x927, so the box carries the artwork's own ratio
                (aspect-11/6) at every width — nothing cropped, and the contact
                bar along the bottom stays whole. Replace the file with a
                differently-shaped one and this class changes with it. See
                defaultHero in src/data/lab/defaults.js. */}
            <div className="relative w-full aspect-11/6 overflow-hidden rounded-xl ring-1 ring-emerald-100 shadow-[0_20px_50px_-30px_rgba(6,78,59,0.55)]">
              <Image
                src={hero?.image}
                alt={hero?.imageAlt ?? ""}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* RIGHT: call back form — `#book` is the target every CTA scrolls to;
              scroll-mt clears the fixed navbar so the form heading is not hidden. */}
          <div id="book" className="lg:col-span-4 scroll-mt-20 sm:scroll-mt-24">
            <LabLeadCard
              title={hero?.formTitle}
              cityOptions={cityOptions}
              className="max-w-85 mx-auto lg:mr-0"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
