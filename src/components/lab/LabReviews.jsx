// SSR component — no 'use client' needed.
import { BadgeCheck, Quote, Star } from "lucide-react";

/* Google's four-colour "G" — inline so the summary card needs no image. */
function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.8a10.1 10.1 0 0 1-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4Z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.3v5.7A22 22 0 0 0 24 46Z" />
      <path fill="#FBBC05" d="M11.7 28.1a13.2 13.2 0 0 1 0-8.4v-5.7H4.3a22 22 0 0 0 0 19.8l7.4-5.7Z" />
      <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 2.9 30 1 24 1A22 22 0 0 0 4.3 14l7.4 5.7C13.4 13.4 18.3 9.5 24 9.5Z" />
    </svg>
  );
}

/* ── Edit your ratings and reviews here ─────────────────
 * These are PLACEHOLDERS. Replace them with the real text, names and areas
 * from your actual Google Business profile before this page goes live —
 * invented reviews are a legal risk and patients recognise them.
 *
 *   rating / count → must match what the Google listing actually shows
 *   breakdown      → % of reviews at each star, 5★ first
 *   googleUrl      → link to the live listing; leave null and no link renders
 * ────────────────────────────────────────────────────── */
const SUMMARY = {
  rating: 4.8,
  count: 1240,
  breakdown: [86, 10, 3, 1, 0],
  googleUrl: null,
};

const REVIEWS = [
  {
    name: "Anjali Verma",
    area: "Sigra",
    rating: 5,
    test: "Full Body Checkup",
    when: "2 weeks ago",
    text: "Booked the full body checkup for my father at 7 AM and the technician reached home by 7:40. Very polite, sealed needle used in front of us. Report came on WhatsApp the next morning itself.",
  },
  {
    name: "Ravi Shankar Pandey",
    area: "Lanka",
    rating: 5,
    test: "Thyroid Profile",
    when: "1 month ago",
    text: "Rates are much lower than what the lab near my house was charging, and there was no collection fee. The values matched my earlier report exactly, so accuracy is not a concern.",
  },
  {
    name: "Imran Ansari",
    area: "Sarnath",
    rating: 4,
    test: "Dengue Test",
    when: "3 weeks ago",
    text: "My wife had fever and going out was difficult. They collected the sample at home the same evening. Report took a few hours longer than promised, but the staff kept updating me on call.",
  },
  {
    name: "Sunita Gupta",
    area: "Bhelupur",
    rating: 5,
    test: "Vitamin D & B12",
    when: "1 week ago",
    text: "Booking was a two-minute call, no long forms. The lady who came for collection explained the fasting rules properly. Paid by UPI after the report. Will use them again for my family.",
  },
];

/* Full star, then a half-width overlay for the fractional part of 4.8 */
function Stars({ value, className = "h-4 w-4" }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${className} text-amber-200`} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${className} text-amber-400`} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* Avatar tints cycle by position — full class strings, never built up. */
const AVATAR = [
  "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "bg-sky-50 text-sky-700 ring-sky-100",
  "bg-violet-50 text-violet-700 ring-violet-100",
  "bg-amber-50 text-amber-700 ring-amber-100",
];

export default function LabReviews({ city = "Varanasi", summary = SUMMARY, reviews = REVIEWS }) {
  return (
    <section
      id="reviews"
      aria-label="Patient reviews"
      className="bg-slate-50 border-t border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <h2 className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
          What Patients in {city} Say
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-balance text-center text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-500">
          Real families across {city} — home collection, honest pricing and
          reports that reach them on time.
        </p>

        {/* Summary rail beside the reviews on desktop; stacked on phones so the
            rating is the first thing read, before any single opinion. */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 lg:grid-cols-12 lg:items-start">

          {/* RATING SUMMARY */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-emerald-100/90 shadow-[0_1px_2px_rgba(6,78,59,0.04),0_14px_34px_-20px_rgba(6,78,59,0.4)]">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-br from-emerald-200/50 to-teal-100/30 blur-2xl"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/80 to-transparent"
              />

              <div className="relative flex items-center gap-2">
                <GoogleIcon className="h-4 w-4" />
                <span className="text-[12px] font-bold text-slate-700">Google Reviews</span>
              </div>

              <div className="relative mt-3 flex items-end gap-3">
                <span className="text-[40px] font-extrabold leading-none tracking-tight text-slate-900">
                  {summary.rating.toFixed(1)}
                </span>
                <div className="pb-1">
                  <Stars value={summary.rating} className="h-4 w-4" />
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {summary.count.toLocaleString("en-IN")}+ reviews
                  </p>
                </div>
              </div>

              {/* Star breakdown — the shape of the distribution is what makes a
                  rating believable, not the average on its own. */}
              <ul className="relative mt-3.5 space-y-1">
                {summary.breakdown.map((pct, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-3 text-right text-[10.5px] font-semibold tabular-nums text-slate-500">
                      {5 - i}
                    </span>
                    <Star className="h-2.5 w-2.5 shrink-0 text-amber-400" fill="currentColor" strokeWidth={0} />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-[10.5px] tabular-nums text-slate-400">
                      {pct}%
                    </span>
                  </li>
                ))}
              </ul>

              <p className="relative mt-3.5 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-medium text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                Every review is from a completed home collection
              </p>

              {summary.googleUrl && (
                <a
                  href={summary.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-[12.5px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50/60 hover:ring-emerald-400 active:scale-[0.98] transition-all duration-200"
                >
                  <GoogleIcon className="h-3.5 w-3.5" />
                  Read all reviews on Google
                </a>
              )}
            </div>
          </div>

          {/* REVIEW CARDS */}
          <ul className="grid gap-3.5 sm:grid-cols-2 lg:col-span-8">
            {reviews.map((r, i) => (
              <li key={r.name}>
                <article className="group relative flex h-full flex-col rounded-2xl bg-white p-4 ring-1 ring-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:ring-emerald-200 hover:shadow-[0_14px_34px_-18px_rgba(6,78,59,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                  <Quote
                    aria-hidden
                    className="absolute right-3.5 top-3.5 h-6 w-6 text-emerald-50 transition-colors duration-200 group-hover:text-emerald-100"
                    fill="currentColor"
                    strokeWidth={0}
                  />

                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} className="h-3.5 w-3.5" />
                    <span className="text-[10.5px] font-medium text-slate-400">{r.when}</span>
                  </div>

                  <p className="relative mt-2 flex-1 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-600">
                    {r.text}
                  </p>

                  <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold ring-1 ${AVATAR[i % AVATAR.length]}`}
                    >
                      {r.name.charAt(0)}
                    </span>

                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-[12.5px] font-bold leading-tight text-slate-900">
                        <span className="truncate">{r.name}</span>
                        <BadgeCheck
                          aria-label="Verified booking"
                          className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                          strokeWidth={2.2}
                        />
                      </p>
                      <p className="truncate text-[10.5px] leading-tight text-slate-500">
                        {r.area}, {city} · {r.test}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
