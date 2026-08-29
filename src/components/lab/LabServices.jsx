"use client";

import { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import {
  Activity,
  ArrowRight,
  Beaker,
  Bug,
  ChartLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  FlaskConical,
  Gauge,
  HeartPulse,
  PhoneCall,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Thermometer,
  UserRound,
  X,
} from "lucide-react";
import LabBookingModal from "./LabBookingModal";

import "swiper/css";
import "swiper/css/pagination";

/**
 * Icons cannot travel through Firestore, so a test stores its icon as a string
 * and this registry maps it back. An unknown name falls back to the flask
 * rather than crashing — a typo in the console is a wrong icon, never a 500.
 */
const ICONS = {
  gauge: Gauge,
  droplets: Droplets,
  activity: Activity,
  "chart-line": ChartLine,
  flask: FlaskConical,
  beaker: Beaker,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  sun: Sun,
  pill: Pill,
  bug: Bug,
  sparkles: Sparkles,
  "user-round": UserRound,
  thermometer: Thermometer,
  "shield-check": ShieldCheck,
  clock: Clock,
};

// Cards per view — fractional values leave the next card peeking so the
// swipe gesture is discoverable on touch devices.
const BREAKPOINTS = {
  0:    { slidesPerView: 1.1,  spaceBetween: 12 },
  480:  { slidesPerView: 2.1,  spaceBetween: 12 },
  640:  { slidesPerView: 2.4,  spaceBetween: 16 },
  768:  { slidesPerView: 3.2,  spaceBetween: 16 },
  1024: { slidesPerView: 4,    spaceBetween: 16 },
};

// Full class strings — Tailwind only picks up literals, never built-up names.
// A tint typed wrong in Firestore falls back to emerald instead of putting the
// literal "undefined" into a className.
const TINT = {
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
};
const tint = (key) => TINT[key] ?? TINT.emerald;

// Matching solid colour for the left rail on the phone rows.
const RAIL = {
  rose: "bg-rose-400",
  emerald: "bg-emerald-500",
  amber: "bg-amber-400",
  sky: "bg-sky-400",
  violet: "bg-violet-400",
  teal: "bg-teal-500",
};
const rail = (key) => RAIL[key] ?? RAIL.emerald;

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const offPct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

// What the search box looks through. Tags are included on purpose: "package",
// "diabetes" or "heart" then work as searches, not only as chips.
const haystack = (t) =>
  `${t.name} ${t.sub ?? ""} ${(t.tags ?? []).join(" ")}`.toLowerCase();

// How many tests the phone list shows before "View all" is tapped — enough to
// scroll past quickly, few enough that the FAQ below stays reachable.
const MOBILE_PREVIEW = 4;

/**
 * `tests`, `filters` and `phone` come from the city document (or its generated
 * default) — see defaultTests / defaultFilters in src/data/lab/defaults.js.
 * Prices can therefore differ per city without touching this file.
 *
 * `city` is OPTIONAL. With one, the heading reads "… in Varanasi" and the
 * booking modal's dropdown is that city's localities. Without one — the home
 * page, which serves every city — the heading drops the "in <city>" clause and
 * `subheading` takes its place. The same section, the same prices and the same
 * booking modal in both places; the alternative was a second price grid on the
 * home page that would have gone stale the first time a price changed.
 */
export default function LabServices({
  city,
  subheading,
  cityOptions,
  tests = [],
  filters = [],
  phone,
}) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [booking, setBooking] = useState(null);
  const [edge, setEdge] = useState({ begin: true, end: false });
  const swiperRef = useRef(null);

  // Two ways in, never both at once: typing searches every test, and the chips
  // step aside while it does. A search that also silently obeys a chip the
  // patient set earlier is the fastest way to make this section confusing.
  const searching = query.trim() !== "";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return tests.filter((t) => haystack(t).includes(q));
    return filter === "All"
      ? tests
      : tests.filter((t) => (t.tags ?? []).includes(filter));
  }, [query, filter, tests]);

  // Any change to the query or chip starts the phone list collapsed again.
  const pickFilter = (key) => {
    setFilter(key);
    setExpanded(false);
  };

  const search = (value) => {
    setQuery(value);
    setExpanded(false);
    if (value.trim()) setFilter("All");
  };

  const heading =
    filters.find((f) => f.key === filter)?.heading ?? "Lab Tests & Test Packages";
  const mobileList = expanded ? visible : visible.slice(0, MOBILE_PREVIEW);

  // overflow-x-clip — the arrows sit half outside the slider, so nothing of
  // theirs may leak into the page's horizontal scroll on small screens.
  return (
    <section id="tests" className="bg-slate-50 border-t border-slate-100 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* HEADING — follows the active chip. The city is appended only when
            there is one: this section also runs on the home page, which serves
            every city, and "Popular Lab Tests in undefined" is what a blind
            template produces there. */}
        <h2 className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
          {city ? `${heading} in ${city}` : heading}
        </h2>

        {/* One line of context under the heading, on the home page only. On a
            city page the prices are that city's and the copy above already
            says so; here it is the first time a reader meets the price list. */}
        {!city && subheading && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
            {subheading}
          </p>
        )}


        {/* SEARCH — the fastest path to a named test. On a phone, scanning a
            slider for "Vitamin D" means swiping through everything else first;
            typing three letters skips all of it. */}
        <div className="mx-auto mt-3 max-w-md">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={2.1}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search a test — thyroid, sugar, vitamin…"
              aria-label="Search lab tests"
              className="h-11 w-full rounded-full bg-white pl-9 pr-9 text-[13.5px] text-slate-800 placeholder:text-slate-400 ring-1 ring-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.04)] outline-none focus:ring-2 focus:ring-teal-500 sm:h-10 sm:text-[13px] transition-all duration-200"
            />
            {query && (
              <button
                type="button"
                onClick={() => search("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORIES — tablet and up only. On a phone the chips took two rows
            above the fold and pushed the tests down; the search box and the
            price-ordered list cover the same ground in less space.

            Also hidden while a search is running: the box and the chips do the
            same job, and showing both at once is what made this area busy. */}
        {!searching && (
          <div className="mt-2.5 hidden flex-wrap justify-center gap-1.5 sm:flex sm:gap-2">
            {filters.map((f) => {
              const active = filter === f.key;
              // Packages are a different kind of thing from a test category and
              // the highest-value booking, so the chip is tinted to be found.
              const pkg = f.key === "Packages";

              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => pickFilter(f.key)}
                  aria-pressed={active}
                  className={`cursor-pointer rounded-full px-3.5 py-2 text-[12px] sm:px-4 sm:py-1.5 sm:text-[12.5px] font-semibold transition-all duration-200 ${
                    active
                      ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-[0_6px_14px_-8px_rgba(5,150,105,0.9)]"
                      : pkg
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-400"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 hover:text-slate-900"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* NO MATCH — a dead end is where a booking is lost, so it ends in a
            phone number rather than an apology. Shown at every breakpoint. */}
        {visible.length === 0 && (
          <div className="mx-auto mt-4 max-w-md rounded-xl bg-white px-4 py-6 text-center ring-1 ring-slate-200">
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-800">
              No test matches “{query}”
            </p>
            <p className="mt-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
              We run many more tests than the ones listed here — call us and we
              will confirm the price for you.
            </p>
            <a
              href={`tel:${String(phone ?? "").replace(/\s/g, "")}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" strokeWidth={2.3} />
              {phone}
            </a>
          </div>
        )}

        {/* ── PHONE: a plain vertical list ───────────────────────────────
            A slider is the wrong shape on a small screen — a patient looking
            for one test has to swipe past every other one, and a card only
            half in view reads as clipped. Rows are scannable top-to-bottom,
            each with its price and its own Book button. */}
        <div className="mt-3 sm:hidden">
          {visible.length > 0 && (
            <>
              <ul className="space-y-2.5">
                {mobileList.map((t) => {
                  const Icon = ICONS[t.icon] ?? FlaskConical;
                  const save = t.price && t.mrp ? t.mrp - t.price : 0;

                  return (
                    <li key={t.id}>
                      {/* The whole row is the button. A thumb aiming at a small
                          "Book" pill misses; a 100%-wide target does not. The
                          pill stays as a span so the markup keeps one control. */}
                      <button
                        type="button"
                        onClick={() => setBooking(t.name)}
                        aria-label={`${t.price ? "Book" : "Enquire about"} ${t.name}`}
                        className="group relative block w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.05)] active:scale-[0.985] active:ring-emerald-300 transition-all duration-150"
                      >
                        {/* Colour rail — the row's category read at a glance */}
                        <span
                          aria-hidden
                          className={`absolute inset-y-0 left-0 w-1 ${rail(t.tint)}`}
                        />

                        {/* Discount corner — the strongest reason to tap, so it
                            sits at the top edge rather than in the price row. */}
                        {save > 0 && (
                          <span className="absolute right-0 top-0 rounded-bl-xl bg-linear-to-r from-emerald-600 to-teal-600 px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-white">
                            {offPct(t.price, t.mrp)}% OFF
                          </span>
                        )}

                        <div className="flex gap-3 p-3 pl-3.5">
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tint(t.tint)}`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={1.8} />
                          </span>

                          <div className="min-w-0 flex-1">
                            {/* ── NOT AN h3 — DELIBERATELY ────────────────────
                                This component renders the test list TWICE: this
                                phone list (`sm:hidden`) and the desktop carousel
                                below (`hidden sm:block`). Both are in the DOM at
                                once, so when both used <h3> every test emitted a
                                duplicate heading on every page of the site.

                                The carousel keeps the headings because it always
                                holds the COMPLETE set of tests. This list is
                                `visible.slice(0, 4)` until the reader taps "show
                                more" — a document outline that changes depending
                                on whether someone tapped a button is not an
                                outline. The names are also carried by the JSON-LD
                                `makesOffer` block, the guide prose and the FAQs,
                                so nothing is lost by styling rather than marking
                                these up as headings.

                                `font-bold` at the same size renders identically.

                                The "Top" badge is a sibling, not a child: inside
                                the heading its text content became "CBC TestTop",
                                which is what a crawler indexed and what a screen
                                reader announced. `aria-hidden` because "Popular"
                                is already stated by the tag copy on the card. */}
                            <div className="flex items-center gap-1.5 pr-14">
                              <p className="min-w-0 truncate text-[14.5px] font-bold leading-snug text-slate-900">
                                {t.name}
                              </p>
                              {(t.tags ?? []).includes("Popular") && (
                                <span
                                  aria-hidden
                                  className="shrink-0 rounded bg-amber-50 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200"
                                >
                                  Top
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-[11.5px] leading-snug text-slate-500">
                              {t.sub}
                            </p>

                            {/* Two small facts, dot-separated on one line — a
                                wrapping meta row is what made these feel cramped */}
                            <p className="mt-1.5 truncate text-[10.5px] font-medium text-slate-600">
                              {t.params > 0 && (
                                <span className="font-bold text-emerald-700">
                                  {t.params} parameters ·{" "}
                                </span>
                              )}
                              {t.fasting ? "Fasting required" : "No fasting"} · Report in 24 hrs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 py-2 pl-3.5 pr-3">
                          <div className="min-w-0">
                            {t.price ? (
                              <>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-[18px] font-extrabold leading-none text-slate-900">
                                    {inr(t.price)}
                                  </span>
                                  {t.mrp && (
                                    <span className="text-[11.5px] font-medium text-slate-400 line-through">
                                      {inr(t.mrp)}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 truncate text-[10px] font-semibold text-emerald-700">
                                  {save > 0 ? `You save ${inr(save)}` : "Free home collection"}
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="text-[13px] font-bold leading-none text-teal-700">
                                  Call for price
                                </span>
                                <p className="mt-1 text-[10px] font-medium text-slate-500">
                                  Custom package · free home visit
                                </p>
                              </>
                            )}
                          </div>

                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_6px_14px_-8px_rgba(5,150,105,0.9)]">
                            {t.price ? "Book Now" : "Enquire"}
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {visible.length > MOBILE_PREVIEW && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-[12.5px] font-bold text-emerald-700 ring-1 ring-emerald-200 shadow-[0_1px_3px_rgba(15,23,42,0.04)] active:scale-[0.99] transition-transform"
                >
                  {expanded ? "Show less" : `View all ${visible.length} tests`}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.4}
                  />
                </button>
              )}
            </>
          )}
        </div>

        {/* ── TABLET & DESKTOP: the slider ───────────────────────────────
            `key` remounts it so a new filter or search resets to card 1. */}
        <div className={`relative mt-2 hidden ${visible.length > 0 ? "sm:block" : ""}`}>

          {/* ARROWS — sit on the left/right edge of the slider, vertically centred
              on the cards (the -11px offsets the slider's pb-5.5 pagination strip).
              Desktop only; on touch devices the swipe gesture is enough. */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={edge.begin}
            aria-label="Previous tests"
            className="absolute left-0 top-[calc(50%-11px)] z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 sm:flex items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 shadow-md transition-all hover:ring-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:hover:ring-slate-200 disabled:hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={edge.end}
            aria-label="Next tests"
            className="absolute right-0 top-[calc(50%-11px)] z-10 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 sm:flex items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 shadow-md transition-all hover:ring-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:hover:ring-slate-200 disabled:hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>

          <Swiper
            key={`${filter}|${query}`}
            modules={[Pagination, Keyboard, Autoplay]}
            breakpoints={BREAKPOINTS}
            /* The slider is display:none below sm — observers re-measure it
               when it becomes visible instead of leaving it at zero width. */
            observer
            observeParents
            keyboard={{ enabled: true }}
            grabCursor
            watchOverflow
            loop
            /* Autoplay pauses while the pointer is over the cards and resumes
               after a manual swipe / arrow click instead of stopping for good. */
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSwiper={(s) => {
              swiperRef.current = s;
              setEdge({ begin: s.isBeginning, end: s.isEnd });
            }}
            onSlideChange={(s) => setEdge({ begin: s.isBeginning, end: s.isEnd })}
            onResize={(s) => setEdge({ begin: s.isBeginning, end: s.isEnd })}
            style={{
              "--swiper-pagination-color": "#0d9488",
              "--swiper-pagination-bottom": "0px",
            }}
            className="pt-2 pb-5.5"
          >
          {visible.map((t) => {
            const Icon = ICONS[t.icon] ?? FlaskConical;
            return (
              <SwiperSlide key={t.id} className="h-auto">
                <article
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:ring-emerald-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.09)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Discount ribbon — only when an MRP is set on the test */}
                  {t.price && t.mrp && (
                    <span className="absolute right-0 top-3 rounded-l-full bg-emerald-600 py-0.5 pl-2 pr-2.5 text-[9.5px] font-bold tracking-wide text-white shadow-sm">
                      {offPct(t.price, t.mrp)}% OFF
                    </span>
                  )}

                  <div className="flex-1 p-2.5 sm:p-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${tint(t.tint)}`}
                    >
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>

                    {/* Badge outside the heading — see the note on the mobile
                        card above for why. */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <h3 className="min-w-0 truncate text-[14px] sm:text-[15px] font-bold text-slate-900 leading-snug">
                        {t.name}
                      </h3>
                      {(t.tags ?? []).includes("Popular") && (
                        <span
                          aria-hidden
                          className="shrink-0 rounded bg-amber-50 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200"
                        >
                          Top
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-slate-500 leading-snug">
                      {t.sub}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] font-medium text-slate-600">
                      {/* Packages only — the parameter count is what a patient
                          compares a checkup on, so it leads the meta row. */}
                      {t.params && (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
                          {t.params} parameters
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            t.fasting ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        />
                        {t.fasting ? "Fasting required" : "No fasting"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" strokeWidth={2.2} />
                        Report in 24 hrs
                      </span>
                    </div>
                  </div>

                  {/* PRICE + CTA */}
                  <div className="border-t border-slate-100 bg-slate-50/60 px-2.5 py-2 sm:px-3">
                    {t.price ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[19px] font-extrabold leading-none text-slate-900">
                          {inr(t.price)}
                        </span>
                        {t.mrp && (
                          <span className="text-[11.5px] font-medium text-slate-400 line-through">
                            {inr(t.mrp)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[13px] font-bold leading-none text-teal-700">
                        Call for price
                      </div>
                    )}
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {!t.price
                        ? "Custom package · free home visit"
                        : t.params
                          ? "Free home collection · one report"
                          : "Free home sample collection"}
                    </p>

                    <button
                      type="button"
                      onClick={() => setBooking(t.name)}
                      className="cursor-pointer mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-1.5 text-[12.5px] font-bold text-emerald-700 ring-1 ring-emerald-100 transition-all duration-200 group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white group-hover:ring-transparent active:scale-[0.98]"
                    >
                      {t.price ? "Book Now" : "Enquire Now"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
          </Swiper>
        </div>
      </div>

      {booking && (
        <LabBookingModal
          test={booking}
          cityOptions={cityOptions}
          onClose={() => setBooking(null)}
        />
      )}
    </section>
  );
}
