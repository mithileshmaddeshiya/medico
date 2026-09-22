"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  House,
  PhoneCall,
  Search,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import LabBookingModal from "./LabBookingModal";
import AddToCartControl from "./cart/AddToCartControl";
import CartDrawer from "./cart/CartDrawer";
import { cart, OPEN_CART_HASH, useCartItems } from "./cart/cartStore";
import { iconFor, tint } from "./testIcons";

import "swiper/css";
import "swiper/css/pagination";

// Cards per view, EVERY breakpoint — the phone slides too. A phone shows ONE
// card, full width and centred — a peeking 1.12 made every card sit off to
// the left. From 480px up, fractions leave the next card peeking.
const BREAKPOINTS = {
  0:    { slidesPerView: 1,    spaceBetween: 16 },
  480:  { slidesPerView: 1.5,  spaceBetween: 14 },
  640:  { slidesPerView: 2.15, spaceBetween: 16 },
  900:  { slidesPerView: 2.6,  spaceBetween: 18 },
  1024: { slidesPerView: 3,    spaceBetween: 20 },
};

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const offPct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

// What the search box looks through. Tags are included on purpose: "package",
// "diabetes" or "heart" then work as searches, not only as chips.
const haystack = (t) =>
  `${t.name} ${t.sub ?? ""} ${(t.tags ?? []).join(" ")}`.toLowerCase();

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
  const [booking, setBooking] = useState(null);
  const [edge, setEdge] = useState({ begin: true, end: false });
  const swiperRef = useRef(null);

  // Priced tests go in the cart; "Call for price" ones keep the enquiry form.
  const cartItems = useCartItems();
  const [cartOpen, setCartOpen] = useState(false);

  // The header's cart icon opens this section's drawer. Arriving with #cart
  // (the icon tapped on a page without a test section) opens it on load.
  useEffect(() => {
    const unregister = cart.registerOpener(() => setCartOpen(true));
    if (window.location.hash === OPEN_CART_HASH) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      cart.open();
    }
    return unregister;
  }, []);

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

  const pickFilter = (key) => setFilter(key);

  const search = (value) => {
    setQuery(value);
    if (value.trim()) setFilter("All");
  };

  const heading =
    filters.find((f) => f.key === filter)?.heading ?? "Lab Tests & Test Packages";

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

        {/* SEARCH — the fastest path to a named test. Scanning a slider for
            "Vitamin D" means swiping through everything else first; typing
            three letters skips all of it. */}
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

        {/* CATEGORIES — one row. On a phone it scrolls sideways instead of
            wrapping, so the chips never take two rows above the fold (that is
            why they used to be hidden there). `-mx-4 px-4` lets the row run to
            the screen edge while the first chip still lines up with the page.

            Hidden while a search is running: the box and the chips do the same
            job, and showing both at once is what made this area busy. */}
        {!searching && (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
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
                  className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-[12.5px] sm:text-[13px] font-semibold transition-all duration-200 ${
                    active
                      ? "bg-teal-50 text-teal-700 ring-[1.5px] ring-teal-600 shadow-[0_4px_12px_-6px_rgba(13,148,136,0.6)]"
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
            phone number rather than an apology. */}
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
              title={`Call ${phone} to book a lab test`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" strokeWidth={2.3} />
              {phone}
            </a>
          </div>
        )}

        {/* ── THE SLIDER — every screen size ─────────────────────────────
            One carousel for phone and desktop alike, auto-sliding on both. It
            used to be desktop-only with a separate vertical list on the phone;
            one set of cards also means one <h3> per test in the DOM, where the
            old pair rendered every test twice.
            `key` remounts it so a new filter or search resets to card 1. */}
        {visible.length > 0 && (
          <div className="relative mt-3">

            {/* ARROWS — on the slider's left/right edge, vertically centred on
                the cards (the -11px offsets the pagination strip). sm and up
                only; on a phone the swipe and the autoplay are enough. */}
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={edge.begin}
              aria-label="Previous tests"
              className="absolute left-0 top-[calc(50%-11px)] z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 sm:flex items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 shadow-md transition-all hover:ring-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:hover:ring-slate-200 disabled:hover:text-slate-700 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={edge.end}
              aria-label="Next tests"
              className="absolute right-0 top-[calc(50%-11px)] z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 sm:flex items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 shadow-md transition-all hover:ring-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:hover:ring-slate-200 disabled:hover:text-slate-700 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <Swiper
              key={`${filter}|${query}`}
              modules={[Pagination, Keyboard, Autoplay]}
              breakpoints={BREAKPOINTS}
              keyboard={{ enabled: true }}
              grabCursor
              watchOverflow
              loop
              /* Autoplay pauses while the pointer is over the cards and resumes
                 after a manual swipe / arrow click instead of stopping for good.
                 3s rather than 2.5s: the cards carry more to read now. */
              autoplay={{
                delay: 3000,
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
              /* Padding is INLINE on purpose. swiper/css sets `.swiper
                 { padding: 0 }` unlayered, which beats Tailwind's layered
                 utilities — a `px-1 pb-6` class here silently did nothing, and
                 the full-width phone card had its ring and shadow clipped at
                 both screen edges. Swiper subtracts this padding when it sizes
                 the slides, so the card still fits exactly. */
              style={{
                "--swiper-pagination-color": "#0d9488",
                "--swiper-pagination-bottom": "0px",
                padding: "6px 6px 28px",
              }}
            >
              {visible.map((t) => (
                <SwiperSlide key={t.id} className="h-auto">
                  <TestCard
                    test={t}
                    qty={t.price && t.inStock !== false ? (cartItems[t.id] ?? 0) : 0}
                    onEnquire={() => setBooking(t.name)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {booking && (
        <LabBookingModal
          test={booking}
          cityOptions={cityOptions}
          onClose={() => setBooking(null)}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        tests={tests}
        city={city}
        cityOptions={cityOptions}
        phone={phone}
      />
    </section>
  );
}

/**
 * One test or package card.
 *
 *   ┌──────────────────────────────┬─────────┐
 *   │ Name                         │   45    │  ← count corner: parameters for a
 *   │                              │ Params  │    package, the test's icon else
 *   ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
 *   │ Includes: …                            │
 *   │ 44% OFF · You save ₹80                 │
 *   ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
 *   │ fasting · home collection · 24h report │
 *   ├────────────────────────────────────────┤
 *   │ ₹999 ₹1,800            [ Add to cart ] │  ← tinted footer
 *   └────────────────────────────────────────┘
 *
 * ── ONLY WHAT WE CAN STAND BEHIND ────────────────────────────────────────
 * The three facts along the bottom are the test's own `fasting` flag and two
 * of the five confirmed promises (free home collection, report in 24 hours).
 * Nothing like "recommended for everyone", no invented test counts: a single
 * test with no `params` gets its icon in the corner, never a made-up number.
 */
function TestCard({ test: t, qty, onEnquire }) {
  const save = t.price && t.mrp ? t.mrp - t.price : 0;
  const Fasting = t.fasting ? Utensils : UtensilsCrossed;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-14px_rgba(13,148,136,0.35)] ${
        qty > 0 ? "ring-2 ring-emerald-400" : "ring-1 ring-slate-200/80 hover:ring-teal-200"
      }`}
    >
      {/* ── HEAD: name + count corner ─────────────────────────────────── */}
      <div className="flex items-stretch">
        <div className="min-w-0 flex-1 px-4 pt-4 pb-3">
          {/* The "Top" badge is a sibling of the heading, never a child —
              inside it, the heading's text became "CBC TestTop", which is what
              a crawler indexed and a screen reader announced. */}
          <h3 className="text-[15.5px] sm:text-[16.5px] font-bold leading-snug text-slate-900 line-clamp-2">
            {t.name}
          </h3>
          {(t.tags ?? []).includes("Popular") && (
            <span
              aria-hidden
              className="mt-1.5 inline-flex rounded-md bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200"
            >
              Top booked
            </span>
          )}
        </div>

        <div className="flex w-[84px] shrink-0 flex-col items-center justify-center rounded-bl-2xl bg-linear-to-b from-teal-100/80 via-teal-50 to-white px-2 py-3 text-teal-700">
          {t.params > 0 ? (
            <>
              <span className="text-[26px] font-extrabold leading-none tabular-nums">
                {t.params}
              </span>
              <span className="mt-1 text-[12px] font-semibold leading-none">
                Parameters
              </span>
            </>
          ) : (
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${tint(t.tint)}`}
            >
              {createElement(iconFor(t.icon), { className: "h-5.5 w-5.5", strokeWidth: 1.8 })}
            </span>
          )}
        </div>
      </div>

      {/* ── BODY: what is in it ───────────────────────────────────────── */}
      <div className="mx-4 flex-1 border-t border-dashed border-slate-200 py-3">
        <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-3">
          <span className="font-bold text-slate-800">Includes: </span>
          {t.sub}
        </p>

        {save > 0 && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
            {offPct(t.price, t.mrp)}% OFF
            <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden />
            You save {inr(save)}
          </p>
        )}
      </div>

      {/* ── FACTS ─────────────────────────────────────────────────────── */}
      <ul className="mx-4 grid grid-cols-3 gap-2 border-t border-dashed border-slate-200 py-3 text-[10.5px] sm:text-[11px] leading-tight text-slate-500">
        <li className="flex items-start gap-1.5">
          <Fasting className="mt-px h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2} />
          {t.fasting ? "Fasting required" : "No fasting required"}
        </li>
        <li className="flex items-start gap-1.5">
          <House className="mt-px h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2} />
          Free home collection
        </li>
        <li className="flex items-start gap-1.5">
          <Clock className="mt-px h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2} />
          Report in 24 hours
        </li>
      </ul>

      {/* ── FOOTER: price + action ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 bg-linear-to-r from-teal-50 to-cyan-50/70 px-4 py-3">
        <div className="min-w-0">
          {t.price ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[21px] font-extrabold leading-none text-slate-900">
                {inr(t.price)}
              </span>
              {t.mrp && (
                <span className="text-[12.5px] font-medium text-slate-400 line-through">
                  {inr(t.mrp)}
                </span>
              )}
            </div>
          ) : (
            <>
              <span className="text-[15px] font-bold leading-none text-teal-700">
                Call for price
              </span>
              <p className="mt-1 text-[10.5px] font-medium text-slate-500">
                Custom package
              </p>
            </>
          )}
        </div>

        {t.price && t.inStock === false ? (
          // Marked out of stock in the admin panel. The price stays visible;
          // the cart does not take it (priceCart refuses it on the server too).
          <span
            aria-disabled="true"
            className="inline-flex h-9 w-[128px] shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-slate-100 text-[12.5px] font-bold text-slate-500 ring-1 ring-slate-200"
          >
            Out of stock
          </span>
        ) : t.price ? (
          <div className="w-[128px] shrink-0">
            <AddToCartControl test={t} qty={qty} block />
          </div>
        ) : (
          <button
            type="button"
            onClick={onEnquire}
            aria-label={`Enquire about ${t.name}`}
            className="inline-flex h-9 w-[128px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-[12.5px] font-bold text-white shadow-[0_6px_14px_-8px_rgba(5,150,105,0.9)] transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.97]"
          >
            Enquire
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </article>
  );
}
