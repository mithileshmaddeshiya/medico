// SSR component — the only interactive thing in here is the form, and that is
// its own client component.
import Image from "next/image";

import LabLeadCard from "@/components/lab/LabLeadCard";

/**
 * The home page hero — banner image plus the booking form, the same shape the
 * city heroes use (see src/components/lab/LabHero.jsx).
 *
 * ── THE HERO SHOWS NO HEADING ────────────────────────────────────────────
 * Banner and form, nothing else. The banner has its headline painted into the
 * artwork, so a second heading in text had nowhere good to go: above the
 * picture it repeated it, and over the picture it collided with it. The h1 is
 * still in the DOM — `sr-only`, see the note beside it — because every section
 * below starts at h2 and the page needs one.
 *
 * The cost is real and it is written out where the element is. Short version:
 * the largest thing above the fold is now raster text a crawler cannot read.
 * The fix is an image with room in it, not a cleverer arrangement of type.
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

          <div className="lg:col-span-8">

            {/* ── THE PAGE'S ONLY H1, AND IT IS INVISIBLE ─────────────────
                Every section below it starts at h2, so this element is what
                stops the page having no h1 at all.

                It is `sr-only` because the hero shows no heading: the banner
                carries its own headline in the artwork, and a second one in
                text sat awkwardly against it however it was placed — above the
                picture it repeated the picture, and over the picture it landed
                on the picture's own type.

                ── THE COST, STATED PLAINLY ────────────────────────────────
                A crawler cannot read pixels. With this hidden, the largest
                thing above the fold is raster text, and the only
                machine-readable version of the page's claim is this element
                plus the image alt. It still ranks the page — a screen reader
                and a crawler both get it in full — but a visible h1 in real
                text is worth more, and it is what corrects a domain Google
                currently files as an online pharmacy.

                If that trade ever needs reversing, it is one swap: point
                HOME_HERO.image at /navheroimage/heroempty.webp (the same
                photograph with its left half left clear) and this heading can
                come back visible, overlaid on that empty half. */}
            <h1 className="sr-only">
              {hero.h1Lead} {hero.h1Accent}
              {hero.h1Sub ? `. ${hero.h1Sub}` : ""}
            </h1>

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
