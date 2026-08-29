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

          {/* The image column is `relative` only from lg, because that is the
              only width at which the headline is positioned against it. */}
          <div className="lg:relative lg:col-span-8">

            {/* ── THE PAGE'S ONLY H1 ──────────────────────────────────────
                Every other lab section starts at h2.

                ── IT WAS sr-only, AND IT COST THIS SECTION MORE THAN THE
                   HOME PAGE ─────────────────────────────────────────────
                One banner file is the hero on TEN city pages. With the heading
                hidden behind it, the most prominent element of all ten was
                byte-identical, the only per-city readable text above the fold
                was a hidden string and an image alt, and the two newest pages
                — Siwan and Ghazipur — sat unindexed. That is the exact shape
                of a page a crawler fetches and then declines to file.

                It is real, visible text again, and it carries the city name
                where a crawler and a reader both get it. What made that
                possible was not a cleverer arrangement of type — it was a
                banner with room in it (defaultHero.image →
                herocityempty.webp, the same photograph with its left side
                left clear).

                One element, two positions, no duplicate markup: an ordinary
                block above the picture below lg, absolutely positioned inside
                the picture's empty side from lg. A phone banner is ~200px tall
                and there is nowhere to write on it; a desktop one has a left
                side the artwork leaves clear. See the same note in
                HomeHero.jsx for the full reasoning.

                The panel is narrower here than on the home page — 52% against
                58% — because this photograph's subject starts further left.

                The white gradient behind it is a safety net, not a scrim. The
                artwork's left side is already near-white, so it is invisible
                there and only does work where the photograph begins — which is
                why nothing has to be dimmed to keep the words legible. */}
            <div className="mb-5 lg:mb-0 lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:w-[52%]">
              <div className="lg:flex lg:h-full lg:flex-col lg:justify-center lg:rounded-l-xl lg:bg-linear-to-r lg:from-white lg:via-white/85 lg:to-transparent lg:py-8 lg:pl-7 lg:pr-10">
                {/* `text-balance` keeps the two-line phone wrap even. The scale
                    peaks at sm/md, where the headline has the full column, and
                    steps DOWN at lg where it lives inside half the picture. */}
                <h1 className="max-w-3xl text-balance text-[26px] min-[400px]:text-[30px] sm:text-[36px] lg:max-w-none lg:text-[25px] xl:text-[29px] font-extrabold leading-[1.14] tracking-tight text-slate-900">
                  {hero?.h1}
                </h1>

                {/* Rendered only when the city supplies one, so an older city
                    entry without `h1Sub` degrades to just the heading rather
                    than an empty paragraph holding open a gap. `text-pretty`
                    stops a one-word last line. */}
                {hero?.h1Sub && (
                  <p className="mt-3 max-w-2xl text-pretty text-[13.5px] sm:text-[15px] lg:mt-2.5 lg:max-w-none lg:text-[12.5px] leading-relaxed text-slate-600">
                    {hero.h1Sub}
                  </p>
                )}
              </div>
            </div>

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
