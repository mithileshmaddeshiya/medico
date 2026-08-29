import Image from "next/image";
import LabLeadCard from "./LabLeadCard";

// `hero` and `cityOptions` come from the Firestore-backed page — see
// defaultHero in src/data/lab/defaults.js for the shape and its defaults.
export default function LabHero({ hero, cityOptions }) {
  return (
    <section className="bg-linear-to-b from-emerald-50/70 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-19 sm:pt-24 pb-2 sm:pb-3">

        {/* ── THE PAGE'S ONLY H1 ──────────────────────────────────────────
            Every other lab section starts at h2.

            This was `sr-only` — hidden from sight and readable only by screen
            readers — because the hero's headline was printed into the banner
            artwork below. That cost the page three things at once:

              1. The most prominent element above the fold was raster text,
                 which no crawler can read.
              2. The LCP candidate was a 1.8 MB image rather than a line of
                 text, which paints on the first frame.
              3. The SAME banner file is the hero on all six city pages, so
                 the page's dominant element was byte-identical across six
                 pages competing for six different towns' queries.

            Now it is real text carrying the city name, and it is the first
            thing painted. `text-balance` keeps the two-line phone wrap even;
            `text-pretty` on the sub-line stops a one-word last line. */}
        <div className="max-w-3xl">
          <h1 className="text-balance text-[26px] min-[400px]:text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold leading-[1.12] tracking-tight text-slate-900">
            {hero?.h1}
          </h1>

          {/* Rendered only when the city supplies one, so an older city entry
              without `h1Sub` degrades to just the heading rather than an empty
              paragraph holding open a gap. */}
          {hero?.h1Sub && (
            <p className="mt-2.5 max-w-2xl text-pretty text-[13.5px] sm:text-[15px] leading-relaxed text-slate-600">
              {hero.h1Sub}
            </p>
          )}
        </div>

        <div className="mt-5 sm:mt-6 grid items-center gap-5 lg:gap-8 lg:grid-cols-12">

          {/* LEFT: image — 1696x927, so the box carries the banner's own ratio
              (aspect-11/6) at every width. It used to be cropped on phones to
              save height, but this banner has its headline and a contact bar
              printed into the artwork, and a crop cuts them in half. See
              defaultHero in src/data/lab/defaults.js for the file. */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-11/6 rounded-md lg:rounded-tr-none overflow-hidden">
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
