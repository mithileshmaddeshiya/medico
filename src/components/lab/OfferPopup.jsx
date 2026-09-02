"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Phone, X } from "lucide-react";

/**
 * The offer popup — artwork, and a call button under it.
 *
 * ── IT IS TRIGGERED BY READING, NOT BY A TIMER ───────────────────────────
 * WelcomePopup opens 1.2s after load, at everybody. This one waits until the
 * reader has scrolled PAST the FAQ section, which on both routes it is mounted
 * on is most of the way down the page. That is the difference worth keeping:
 * by then the visitor has read the prices and the questions and not left, so
 * an offer is an answer to something rather than an interruption.
 *
 * The trigger is an IntersectionObserver on `#faq` — the id LabFaq puts on its
 * <section>. It fires on `boundingClientRect.bottom <= 0`, i.e. the moment the
 * whole FAQ block has left the top of the viewport. The bottom check is what
 * distinguishes scrolled-past from not-yet-reached: an element that has never
 * been on screen is also "not intersecting", and without it the popup would
 * fire instantly on load.
 *
 * ⚠ IT IS TIED TO THAT ID. If LabFaq's `id="faq"` is ever renamed, this popup
 * silently never opens — no error, no warning, just a feature that quietly
 * stops existing. Grep for FAQ_SELECTOR before touching that section.
 *
 * ── TWO POPUPS, ONE VISIT ────────────────────────────────────────────────
 * WelcomePopup can also fire on these pages. They cannot overlap: WelcomePopup
 * locks body scroll while it is open, so nobody can reach the FAQ underneath
 * it, and this one only exists after a long scroll. They do keep SEPARATE
 * session keys on purpose — sharing one would mean whichever fired first
 * suppressed the other, and these two are asking for different things.
 *
 * Still worth saying plainly: a visitor who dismisses one and scrolls on gets
 * a second interruption in the same session. If that ever reads as too much,
 * the cheapest fix is to check WelcomePopup's key here before opening, not to
 * delete this.
 *
 * ── ONCE PER VISIT, WRITTEN ON OPEN ──────────────────────────────────────
 * The seen flag is set the moment it opens, not when it is closed — otherwise
 * moving from the home page to a city page would open it again for somebody
 * who is simply browsing. sessionStorage, not localStorage: it should come
 * back on a fresh visit tomorrow, just not four times today.
 *
 * Every storage call is wrapped. In a private window, or with site data
 * blocked, sessionStorage THROWS on access rather than returning null, and an
 * unguarded read there would take the whole page down. A failure is treated as
 * "not seen" — the popup shows, it just cannot remember that it did.
 */

const SEEN_KEY = "mb:offer-popup";

/** The element this popup watches. See the warning above. */
const FAQ_SELECTOR = "#faq";

export default function OfferPopup({ offer, phone }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!offer?.image) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const faq = document.querySelector(FAQ_SELECTOR);
    if (!faq) return;

    const show = () => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage unavailable — it opens, it just cannot remember it did.
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Scrolled PAST, not merely off screen — see the note above.
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        if (!scrolledPast) return;
        observer.disconnect();
        show();
      },
      { threshold: 0 }
    );

    observer.observe(faq);
    return () => observer.disconnect();
  }, [offer?.image]);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes it, and the page behind stops scrolling while it is up —
  // without the lock, a scroll gesture over the backdrop moves the page
  // underneath and the popup looks stuck to the glass. Same handling as
  // WelcomePopup, deliberately: two dialogs on one site should not behave
  // differently.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open || !offer?.image) return null;

  const telHref = `tel:${String(phone ?? "").replace(/[^\d+]/g, "")}`;

  return (
    // Same stacking and the same light dim as WelcomePopup: above the floating
    // call button (z-50) and the booking modal (z-60). `items-start` with
    // `overflow-y-auto` so a tall piece of artwork on a short phone can be
    // scrolled to its call button instead of running off the bottom.
    <div
      role="dialog"
      aria-modal="true"
      aria-label={offer.title ?? "Offer"}
      onClick={close}
      className="lab-fade-in fixed inset-0 z-70 flex cursor-pointer items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-[2px] sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="lab-pop-in relative my-auto w-full max-w-xs cursor-default overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(6,78,59,0.6)] sm:max-w-sm"
      >
        {/* Over the artwork rather than beside it, because the picture runs the
            full width of the card. White pill behind the glyph so it stays
            visible whatever the banner is light or dark in that corner. */}
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 ring-1 ring-slate-200 shadow-sm transition hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {/* The box carries the artwork's own ratio, from `offer.aspect`, so the
            picture is shown WHOLE. An offer banner has its headline, its price
            and its terms painted into it — a crop here does not trim empty
            space, it removes the offer.

            ── EXACTLY ONE WAY TO CALL, NEVER TWO ────────────────────────────
            Which one depends on the artwork, through `showCallButton`:

              false → the artwork carries its own painted "Call: ..." bar. That
                      bar is pixels and cannot be tapped, so the whole picture
                      becomes the `tel:` link and it works as it looks.
              true  → the artwork has no call bar, so a real button is rendered
                      under it (below) and the picture is left as a plain image.

            Never both. Two adjacent links to the same number is a screen reader
            reading the same destination twice, and on a phone it makes the
            whole card feel like one accidental tap away from a call.

            When the picture IS the link it needs its own accessible name — the
            alt describes the offer, not the action — so `aria-label` says what
            tapping does. */}
        {phone && !offer.showCallButton ? (
          <a
            href={telHref}
            aria-label={`${offer.ctaLabel ?? "Call"} ${phone}`}
            className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600"
          >
            <OfferArtwork offer={offer} />
          </a>
        ) : (
          <OfferArtwork offer={offer} />
        )}

        {/* The call button — for artwork that does NOT carry a call bar of its
            own. Real text, not pixels: tappable, crawlable, copyable, and the
            number is LAB_PHONE, never typed here. */}
        {phone && offer.showCallButton && (
          <div className="p-3 sm:p-4">
            <a
              href={telHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.9)] transition hover:bg-emerald-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span className="tabular-nums">
                {offer.ctaLabel ?? "Call"}: {phone}
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/** The picture itself, in a box shaped to the file so nothing is cropped. */
function OfferArtwork({ offer }) {
  return (
    <div className={`relative w-full bg-slate-100 ${offer.aspect ?? "aspect-3/2"}`}>
      <Image
        src={offer.image}
        alt={offer.alt ?? offer.title ?? "Offer"}
        fill
        /* The card is 320px on a phone and 384px above `sm`; ask for the larger
           so the artwork stays crisp on a retina screen at either width. */
        sizes="384px"
        className="object-cover object-center"
      />
    </div>
  );
}
