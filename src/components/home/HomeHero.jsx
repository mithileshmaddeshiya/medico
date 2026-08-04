// SSR component — the only interactive thing in here is the form, and that is
// its own client component.
import Image from "next/image";
import { Check, ShieldCheck, Star } from "lucide-react";

import LabLeadCard from "@/components/lab/LabLeadCard";

/**
 * The home page hero.
 *
 * ── WHY THE h1 IS VISIBLE HERE ───────────────────────────────────────────
 * On a city page the hero is an image plus the booking form, and the h1 is
 * `sr-only` — the page's job there is to get a booking from someone who
 * already searched for their town. The home page has the opposite job: a
 * visitor who lands here often has no idea what MedicoBharat is, and Google
 * currently has this domain filed as an online pharmacy. Both problems are
 * solved by the same thing — saying "lab test, at home, collection free" in
 * large type, where a reader and a crawler both read it first.
 *
 * ── AND WHY THE FORM IS STILL IN THE HERO ────────────────────────────────
 * `#book` is the anchor every CTA on the site scrolls to (see BookFormLink).
 * Keeping the form here means the home page's buttons behave exactly like the
 * city pages' buttons, and a visitor never has to find the form twice.
 */
export default function HomeHero({ hero, cityOptions }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/80 via-teal-50/30 to-white">
      {/* Two soft washes behind the copy. Purely decorative, so `aria-hidden`
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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-8 sm:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">

          {/* ── COPY ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* The eyebrow carries the two promises that decide the booking,
                so it is a real sentence and not a decorative pill. */}
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] sm:text-[12px] font-bold text-emerald-800 ring-1 ring-emerald-200/80 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {hero.eyebrow}
            </p>

            {/* The page's only h1. Every section below it starts at h2. */}
            <h1 className="mt-4 text-balance text-[30px] min-[400px]:text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold leading-[1.1] tracking-tight text-slate-900">
              {hero.h1Lead}{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {hero.h1Accent}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[14px] sm:text-[16px] leading-relaxed text-slate-600">
              {hero.lead}
            </p>

            {/* Four checkable facts. A two-column grid from `sm` keeps them on
                two lines instead of four, which is what stops the form being
                pushed below the fold on a laptop. */}
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 sm:gap-x-5">
              {hero.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3" strokeWidth={3.2} />
                  </span>
                  <span className="text-[12.5px] sm:text-[13.5px] font-medium leading-snug text-slate-700">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* ── TRUST BAR ─────────────────────────────────────────────────
                An ECG line rather than a review count or a patient number.
                Both of those would be inventions, and this page is the one
                place a made-up figure would do the most damage — see the note
                at the top of src/data/home.js. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 ring-1 ring-emerald-100 shadow-[0_2px_10px_-6px_rgba(6,78,59,0.3)]">
                <svg viewBox="0 0 120 24" className="h-5 w-[76px] overflow-visible" fill="none" aria-hidden>
                  <path
                    className="ecg-line"
                    d="M0 12 H26 l4 -9 6 18 5 -14 4 10 H72 l4 -6 4 6 H120"
                    stroke="url(#heroEcg)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="heroEcg" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0d9488" />
                      <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-[12px] font-semibold text-slate-700">
                  Accurate pathology, ghar par
                </span>
              </div>

              <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
                Sample aapke saamne liya jaata hai
              </p>

              <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                <Star className="h-4 w-4 text-amber-500" strokeWidth={2.2} />
                Report WhatsApp par, PDF me
              </p>
            </div>
          </div>

          {/* ── FORM ──────────────────────────────────────────────────────────
              `#book` is the target every CTA on the site scrolls to;
              `scroll-mt` clears the fixed header so the form's heading is not
              hidden underneath it when a button jumps here. */}
          <div id="book" className="lg:col-span-5 scroll-mt-20 sm:scroll-mt-28">
            <LabLeadCard
              title={hero.formTitle}
              cityOptions={cityOptions}
              className="max-w-sm mx-auto lg:ml-auto lg:mr-0"
            />
          </div>
        </div>

        {/* The hero photograph, under the fold-critical content rather than
            beside it. On this page the h1 and the form are what has to be seen
            first; the image is what makes the section feel finished.

            `priority` because on a phone — where the copy and form stack — it
            is still close enough to the top to be the LCP candidate. The fixed
            ratio box reserves its space so nothing shifts as the file lands. */}
        <div className="relative mt-8 sm:mt-12 aspect-2/1 sm:aspect-21/9 w-full overflow-hidden rounded-2xl ring-1 ring-emerald-100 shadow-[0_20px_50px_-30px_rgba(6,78,59,0.55)]">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
