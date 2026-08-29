// SSR component — the only interactive thing in here is the form, and that is
// its own client component.
import Image from "next/image";

import LabLeadCard from "@/components/lab/LabLeadCard";

/**
 * The home page hero — banner image plus the booking form, the same shape the
 * city heroes use (see src/components/lab/LabHero.jsx).
 *
 * ── WHERE THE H1 LIVES ───────────────────────────────────────────────────
 * Over the banner's empty half from lg, above the banner below it. Whichever
 * it is, it is ordinary DOM text — and that is the part that matters. Google
 * files this domain as an online pharmacy, and saying "lab test, at home,
 * collection free" in text a crawler can read is what corrects that. Painted
 * into the artwork it would be pixels; here it is markup, and it is the LCP
 * element, which paints on the first frame.
 *
 * ── THE ONE THING NOT TO UNDO ────────────────────────────────────────────
 * The overlay only works because the banner has an empty half. It has been
 * swapped back to a full-bleed artwork banner once already, and the h1 went
 * `sr-only` to make room for it — which left the page's most prominent element
 * unreadable to a crawler and identical to nine other pages. Both new city
 * pages went unindexed while that was true.
 *
 * So: an overlay is only ever valid against an image with room in it, and this
 * hero is only worth having with one. Swap HOME_HERO.image for artwork with
 * type across the frame and you are choosing the hidden h1 again.
 *
 * ── AND WHY THE FORM IS STILL IN THE HERO ────────────────────────────────
 * `#book` is the anchor every CTA on the site scrolls to (see BookFormLink).
 * Keeping the form here means the home page's buttons behave exactly like the
 * city pages' buttons, and a visitor never has to find the form twice.
 */
export default function HomeHero({ hero, cityOptions }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/80 via-teal-50/30 to-white">
      {/* Two soft washes behind the content. Purely decorative, so `aria-hidden`
          and `pointer-events-none` — they must never eat a tap meant for the
          form sitting on top of them. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 top-32 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-6 sm:pb-8">
        {/* `items-center` — the banner keeps its own ratio rather than being
            stretched to the form's height, so the two columns are different
            heights and the shorter one centres against the taller. */}
        <div className="grid items-center gap-5 lg:grid-cols-12 lg:gap-8">

          {/* The image column is `relative` only from lg, because that is the
              only width at which the headline is positioned against it. */}
          <div className="lg:relative lg:col-span-8">

            {/* ── THE PAGE'S ONLY H1 ──────────────────────────────────────
                Every section below it starts at h2.

                ── IT WAS sr-only AND THAT WAS THE PROBLEM ────────────────
                For a while this hero showed no heading at all: the banner
                carried its headline in the artwork and the h1 sat hidden
                behind it. The cost was not theoretical. A crawler cannot read
                pixels, so the largest thing above the fold was unreadable, and
                the SAME banner file is the hero on every city page — which
                left ten pages whose most prominent element was byte-identical
                and whose only machine-readable claim was a hidden string. That
                is the exact shape of a page Google crawls and then declines to
                index.

                It is real, visible text again. The fix that made that possible
                was not a cleverer arrangement of type — it was a banner with
                room in it (HOME_HERO.image → heroempty.webp, the same
                photograph with its left half left clear).

                ── WHY IT MOVES INSTEAD OF STAYING PUT ────────────────────
                One element, two positions, no duplicate markup:

                • Below lg it is an ordinary block ABOVE the picture. A phone
                  banner is ~200px tall and its empty half is ~170px wide —
                  there is no room to write there, and forcing it produces the
                  overlap this hero already tried once.

                • From lg it is absolutely positioned INSIDE the picture, in
                  the half the artwork leaves empty.

                The h1 is in the DOM once either way, in the same place in the
                reading order, so none of this is visible to a crawler or a
                screen reader — it is purely where the pixels land.

                The white gradient behind it is a safety net, not a scrim: the
                artwork's left half is already near-white, so it is invisible
                over the empty area and only does work where the photograph
                starts. That is the whole difference between this and the dark
                scrim that was tried before — this text sits on light space the
                image was built to give it, so nothing has to be dimmed.

                The two halves do the job they were split for: the accent
                colour lands on "Free Home Sample Collection", the phrase
                carrying the primary keyword, rather than on a word in the
                middle of it. */}
            <div className="mb-5 lg:mb-0 lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:w-[58%]">
              <div className="lg:flex lg:h-full lg:flex-col lg:justify-center lg:rounded-l-xl lg:bg-linear-to-r lg:from-white lg:via-white/88 lg:to-transparent lg:py-8 lg:pl-7 lg:pr-12">
                {/* `text-balance` keeps the two-line phone wrap even. The scale
                    peaks at sm/md, where the headline has the full column to
                    itself, and steps DOWN at lg where it has to live inside
                    58% of the picture. */}
                <h1 className="max-w-3xl text-balance text-[26px] min-[400px]:text-[30px] sm:text-[36px] lg:max-w-none lg:text-[27px] xl:text-[31px] font-extrabold leading-[1.14] tracking-tight text-slate-900">
                  {hero.h1Lead}{" "}
                  <span className="text-emerald-700">{hero.h1Accent}</span>
                </h1>

                {/* `text-pretty` stops a one-word last line. */}
                {hero.h1Sub && (
                  <p className="mt-3 max-w-2xl text-pretty text-[13.5px] sm:text-[15px] lg:mt-2.5 lg:max-w-none lg:text-[13px] leading-relaxed text-slate-600">
                    {hero.h1Sub}
                  </p>
                )}
              </div>
            </div>

            {/* ── IMAGE ───────────────────────────────────────────────────
                The box carries the banner's own ratio — 1699x926, near enough
                to 11/6 — at EVERY width, so nothing is cropped and the contact
                bar along the bottom stays whole. Replace the banner with a
                differently-shaped one and this class changes with it.

                `priority` because this is the first image in the hero, which
                makes it the LCP candidate on phone and desktop alike. */}
            <div className="relative w-full aspect-11/6 overflow-hidden rounded-xl ring-1 ring-emerald-100 shadow-[0_20px_50px_-30px_rgba(6,78,59,0.55)]">
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* ── FORM ──────────────────────────────────────────────────────────
              `#book` is the target every CTA on the site scrolls to;
              `scroll-mt` clears the fixed header so the form's heading is not
              hidden underneath it when a button jumps here. */}
          <div id="book" className="lg:col-span-4 scroll-mt-20 sm:scroll-mt-28">
            <LabLeadCard
              title={hero.formTitle}
              cityOptions={cityOptions}
              className="max-w-85 mx-auto lg:mr-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
