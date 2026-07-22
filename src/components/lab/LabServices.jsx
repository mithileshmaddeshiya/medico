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
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  FlaskConical,
  Gauge,
  HeartPulse,
  Pill,
  Stethoscope,
  Sun,
  Thermometer,
} from "lucide-react";
import LabBookingModal from "./LabBookingModal";

import "swiper/css";
import "swiper/css/pagination";

// Cards per view — fractional values leave the next card peeking so the
// swipe gesture is discoverable on touch devices.
const BREAKPOINTS = {
  0:    { slidesPerView: 1.1,  spaceBetween: 12 },
  480:  { slidesPerView: 2.1,  spaceBetween: 12 },
  640:  { slidesPerView: 2.4,  spaceBetween: 16 },
  768:  { slidesPerView: 3.2,  spaceBetween: 16 },
  1024: { slidesPerView: 4,    spaceBetween: 16 },
};

// `heading` drives the H2 above the grid — it changes with the active chip.
const FILTERS = [
  { key: "All",      label: "All Tests",  heading: "Lab Tests" },
  { key: "Popular",  label: "Popular",    heading: "Popular Lab Tests" },
  { key: "Diabetes", label: "Diabetes",   heading: "Diabetes Tests" },
  { key: "Heart",    label: "Heart",      heading: "Heart Tests" },
  { key: "Vitamins", label: "Vitamins",   heading: "Vitamin Tests" },
  { key: "Fever",    label: "Fever",      heading: "Fever Tests" },
  { key: "Organ",    label: "Organ",      heading: "Organ Function Tests" },
];

// Full class strings — Tailwind only picks up literals, never built-up names.
const TINT = {
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
};

// `price` — what the patient pays (₹). `mrp` — the struck-through list price;
// leave it out and the card simply shows the price with no discount pill.
// `price: null` renders a "Call for price" card instead.
const TESTS = [
  { id: "cbc",      icon: Droplets,     tint: "rose",    name: "CBC Test",             sub: "Complete Blood Count",         tags: ["Popular"],             fasting: false, price: 400,  mrp: 700  },
  { id: "fullbody", icon: Stethoscope,  tint: "emerald", name: "Full Body Checkup",    sub: "Head-to-toe health screening", tags: ["Popular"],             fasting: true,  price: null            },
  { id: "sugar",    icon: Gauge,        tint: "amber",   name: "Blood Sugar Test",     sub: "Fasting & PP glucose",         tags: ["Popular", "Diabetes"], fasting: true,  price: 100,  mrp: 180  },
  { id: "thyroid",  icon: Activity,     tint: "violet",  name: "Thyroid Profile",      sub: "T3, T4 and TSH",               tags: ["Popular"],             fasting: false, price: 550,  mrp: 900  },
  { id: "lipid",    icon: HeartPulse,   tint: "rose",    name: "Lipid Profile",        sub: "Cholesterol & triglycerides",  tags: ["Heart"],               fasting: true,  price: 800,  mrp: 1300 },
  { id: "lft",      icon: FlaskConical, tint: "teal",    name: "Liver Function Test",  sub: "Bilirubin, SGOT, SGPT",        tags: ["Organ"],               fasting: false, price: 600,  mrp: 1000 },
  { id: "kft",      icon: Beaker,       tint: "sky",     name: "Kidney Function Test", sub: "Urea, creatinine & uric acid", tags: ["Organ"],               fasting: false, price: 700,  mrp: 1150 },
  { id: "vitd",     icon: Sun,          tint: "amber",   name: "Vitamin D Test",       sub: "25-OH Vitamin D level",        tags: ["Vitamins"],            fasting: false, price: 1000, mrp: 1700 },
  { id: "vitb12",   icon: Pill,         tint: "violet",  name: "Vitamin B12 Test",     sub: "Serum B12 level",              tags: ["Vitamins"],            fasting: false, price: 1200, mrp: 2000 },
  { id: "dengue",   icon: Bug,          tint: "emerald", name: "Dengue Test",          sub: "NS1 antigen, IgG & IgM",       tags: ["Fever"],               fasting: false, price: 1200, mrp: 1900 },
  { id: "hba1c",    icon: ChartLine,    tint: "sky",     name: "HbA1c Test",           sub: "3-month sugar average",        tags: ["Diabetes"],            fasting: false, price: 600,  mrp: 1000 },
  { id: "fever",    icon: Thermometer,  tint: "teal",    name: "Fever Panel",          sub: "Malaria, typhoid & dengue",    tags: ["Fever"],               fasting: false, price: null            },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const offPct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

export default function LabServices({ city = "Varanasi" }) {
  const [filter, setFilter] = useState("All");
  const [booking, setBooking] = useState(null);
  const [edge, setEdge] = useState({ begin: true, end: false });
  const swiperRef = useRef(null);

  const visible = useMemo(
    () => (filter === "All" ? TESTS : TESTS.filter((t) => t.tags.includes(filter))),
    [filter]
  );

  const heading = FILTERS.find((f) => f.key === filter)?.heading ?? "Lab Tests";

  // overflow-x-clip — the arrows sit half outside the slider, so nothing of
  // theirs may leak into the page's horizontal scroll on small screens.
  return (
    <section id="tests" className="bg-slate-50 border-t border-slate-100 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* HEADING — follows the active chip */}
        <h2 className="text-balance text-center text-xl min-[400px]:text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
          {`${heading} in ${city}`}
        </h2>

        {/* FILTERS — wrapped, never a scrolling row: on a phone a sideways-
            scrolling strip hides half the chips and fights the page scroll,
            so every filter stays visible and tappable at once. */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-[11.5px] sm:px-4 sm:text-[12.5px] font-semibold transition-all duration-200 ${
                filter === f.key
                  ? "bg-white text-teal-600 ring-2 ring-teal-500 shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TEST CARDS — `key={filter}` remounts the slider so it resets to card 1 */}
        <div className="relative mt-2">

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
            key={filter}
            modules={[Pagination, Keyboard, Autoplay]}
            breakpoints={BREAKPOINTS}
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
            const Icon = t.icon;
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
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${TINT[t.tint]}`}
                    >
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-2 flex items-center gap-1.5 text-[14px] sm:text-[15px] font-bold text-slate-900 leading-snug">
                      <span className="truncate">{t.name}</span>
                      {t.tags.includes("Popular") && (
                        <span className="shrink-0 rounded bg-amber-50 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                          Top
                        </span>
                      )}
                    </h3>
                    <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-slate-500 leading-snug">
                      {t.sub}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] font-medium text-slate-600">
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
                      {t.price ? "Free home sample collection" : "Custom package · free home visit"}
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

      {booking && <LabBookingModal test={booking} onClose={() => setBooking(null)} />}
    </section>
  );
}
