// SSR component — the only interactive thing in here is the form, and that is
// its own client component.
import Image from "next/image";

import LabLeadCard from "@/components/lab/LabLeadCard";

/**
 * The home page hero — banner image plus the booking form, the same shape the
 * city heroes use (see src/components/lab/LabHero.jsx).
 *
 * ── WHY THE h1 IS sr-only ────────────────────────────────────────────────
 * This hero used to carry the h1, the lead and the four promises in large
 * type, because Google files this domain as an online pharmacy and saying
 * "lab test, at home, collection free" in readable text is what corrects that.
 * The visible copy is gone now, but the h1 is not — it stays in the DOM,
 * screen-reader only, so a crawler still reads the page's claim first. The
 * promises have not left the page either: the sections below the hero still
 * state every one of them.
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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28  sm:pb-6">
        {/* ── THE PAGE'S ONLY H1 ──────────────────────────────────────────
            Every section below it starts at h2.

            It was `sr-only`, because the headline was printed into the banner
            artwork — so the home page, the page every external link and every
            brand search points at, had no readable headline at all and its LCP
            candidate was a 1.5 MB image instead of a line of text.

            The two halves finally do the job they were split for: the accent
            colour lands on "Free Home Sample Collection", the phrase carrying
            the primary keyword, rather than on a word in the middle of it. */}
        <h1 className="max-w-3xl text-balance text-[27px] min-[400px]:text-[32px] sm:text-[40px] lg:text-[46px] font-extrabold leading-[1.1] tracking-tight text-slate-900">
          {hero.h1Lead}{" "}
          <span className="text-emerald-700">{hero.h1Accent}</span>
        </h1>

        {hero.h1Sub && (
          <p className="mt-3 max-w-2xl text-pretty text-[14px] sm:text-[15.5px] leading-relaxed text-slate-600">
            {hero.h1Sub}
          </p>
        )}

        {/* No `items-center` — the two columns must stretch to the same height,
            which is what lets the image match the form. */}
        <div className="mt-6 sm:mt-7 grid gap-5 lg:grid-cols-12 lg:gap-8">

          {/* ── IMAGE ─────────────────────────────────────────────────────────
              Two different sizing rules, one per layout:

              • Stacked (below lg) the box carries the banner's own ratio —
                1699x926, near enough to 11/6 — so none of the artwork is
                cropped and the space is reserved before the file lands.

              • Side by side (lg and up) the image has to be exactly as tall as
                the form, and the form's height is whatever its fields add up
                to. So the box goes `absolute inset-0` inside a relative column:
                it then contributes no height of its own, the row is sized by
                the form alone, and the image fills that height edge to edge.
                `object-cover` trims the banner's sides to fit — see
                `object-center` below if the crop lands wrong.

              `priority` because this is the first thing in the hero, which
              makes it the LCP candidate on phone and desktop alike. */}
          <div className="lg:relative lg:col-span-8">
            <div className="relative w-full aspect-11/6 overflow-hidden rounded-md ring-1 ring-emerald-100 shadow-[0_20px_50px_-30px_rgba(6,78,59,0.55)] lg:absolute lg:inset-0 lg:aspect-auto">
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
