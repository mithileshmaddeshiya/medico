"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import { REVIEWS } from "@/data/reviews";

import "swiper/css";
import "swiper/css/pagination";

/**
 * "What our patients say" — real reviews from src/data/reviews.js.
 *
 *   ┌──────────────────────────────────┐
 *   │▔▔▔  (accent tab)                 │
 *   │ ★★★★★                        ❝  │
 *   │ Review text, up to five lines…   │
 *   │ ──────────────────────────────── │
 *   │ (AK)  Ankit Kumar                │
 *   │       24 Sep 2026                │
 *   └──────────────────────────────────┘
 *
 * A slider, the same Swiper the test cards use: ONE whole card per screen on
 * a phone (swipe for the next), two from 640px, three from 1024px with arrows.
 * It auto-advances and pauses under the pointer. Slides are `h-auto!` and the
 * card `h-full`, so every card in view is the same height; the text box takes
 * the slack.
 *
 * All review text is in the server-rendered HTML (Swiper renders every slide),
 * but there is deliberately NO review schema — see src/data/reviews.js.
 */

const TINTS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-teal-600",
];

const BREAKPOINTS = {
  0: { slidesPerView: 1, spaceBetween: 14 },
  640: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
};

const initials = (name) =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** "2026-09-24" → "24 Sep 2026", fixed locale so server and browser agree. */
const shortDate = (ymd) => {
  const d = new Date(`${ymd}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

function ReviewCard({ r, i }) {
  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_24px_-18px_rgba(15,23,42,0.25)]">
      {/* The small accent tab on the top-left corner. */}
      <span aria-hidden className="absolute left-0 top-0 h-1 w-16 rounded-br-full bg-linear-to-r from-emerald-500 to-teal-500" />

      <div className="flex items-start justify-between">
        <p className="flex gap-1" aria-label={`Rated ${r.rating} out of 5`}>
          {Array.from({ length: 5 }, (_, s) => (
            <Star
              key={s}
              aria-hidden
              className={`h-[18px] w-[18px] ${s < r.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
            />
          ))}
        </p>
        <Quote aria-hidden className="h-7 w-7 rotate-180 fill-teal-100 text-teal-200" strokeWidth={1.5} />
      </div>

      <blockquote className="mt-3.5 flex-1">
        <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-700 line-clamp-5">{r.text}</p>
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span
          aria-hidden
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[14px] font-bold text-white ${TINTS[i % TINTS.length]}`}
        >
          {initials(r.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold text-slate-900">{r.name}</span>
          {r.date && <span className="block text-[12.5px] text-slate-500">{shortDate(r.date)}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export default function LabReviews({ reviews = REVIEWS, heading = "What our patients say" }) {
  const swiperRef = useRef(null);
  const [edge, setEdge] = useState({ begin: true, end: false });

  if (!reviews.length) return null;
  // With more than three reviews the slider loops and both arrows stay live;
  // with fewer it stops at each end and that end's arrow is disabled.
  const loop = reviews.length > 3;

  const arrow =
    "absolute top-[calc(50%-14px)] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 shadow-md transition-all hover:text-emerald-600 hover:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 lg:flex";

  return (
    <section aria-labelledby="reviews-heading" className="border-t border-slate-100 bg-slate-50/70 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-12">
        <div className="text-center">
          <h2
            id="reviews-heading"
            className="text-balance text-xl min-[400px]:text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900"
          >
            {heading}
          </h2>
          <p className="mx-auto mt-1.5 max-w-xl text-[12.5px] sm:text-[14px] text-slate-500">
            Reviews left by people who booked their tests with MedicoBharat.
          </p>
        </div>

        <div className="relative mt-5 sm:mt-7">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous reviews"
            disabled={!loop && edge.begin}
            className={`${arrow} left-0 -translate-x-1/2`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next reviews"
            disabled={!loop && edge.end}
            className={`${arrow} right-0 translate-x-1/2`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <Swiper
            modules={[Autoplay, Keyboard, Pagination]}
            breakpoints={BREAKPOINTS}
            loop={loop}
            keyboard={{ enabled: true }}
            grabCursor
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSwiper={(s) => {
              swiperRef.current = s;
              setEdge({ begin: s.isBeginning, end: s.isEnd });
            }}
            onSlideChange={(s) => setEdge({ begin: s.isBeginning, end: s.isEnd })}
            /* Inline, like LabServices: swiper/css sets `.swiper { padding: 0 }`
               unlayered and would beat a Tailwind class. The bottom padding is
               room for the dots under the cards, never on top of them. */
            style={{
              "--swiper-pagination-color": "#059669",
              "--swiper-pagination-bottom": "0px",
              padding: "4px 2px 30px",
            }}
          >
            {reviews.map((r, i) => (
              /* h-auto! — swiper/css forces `height: 100%` on slides otherwise,
                 and the cards would not stretch to one height. */
              <SwiperSlide key={r.name} className="h-auto!">
                <ReviewCard r={r} i={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
