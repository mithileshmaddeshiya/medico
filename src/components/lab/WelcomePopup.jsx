"use client";

import { useCallback, useEffect, useState } from "react";

import PopupLeadForm from "./PopupLeadForm";

/**
 * The on-load enquiry popup — banner on top, three fields under it.
 *
 * It is mounted on the home page and on every /lab-test/[city] page, and
 * nowhere else. Those are the two routes people actually land on from search
 * and from ads; interrupting someone who has deliberately opened the privacy
 * page or a guide to read it would only cost us the read.
 *
 * ── IT SUBMITS THROUGH THE SAME PIPE AS EVERY OTHER FORM ─────────────────
 * The card inside is PopupLeadForm, which looks nothing like the hero's card
 * on purpose — but it validates and posts through leadForm.js, the module the
 * hero card uses too. So a popup lead POSTs to /api/lab-lead, is written to
 * the `labLeads` collection, and is pushed to the shop's WhatsApp by the
 * gateway configured in .env.local (SKWEBTECH_*), exactly like a hero booking.
 * Two faces, one pipe: nothing about where a lead ends up can drift between
 * this and the form on the page behind it.
 *
 * ── ONCE PER VISIT, NOT ONCE PER PAGE ────────────────────────────────────
 * The "seen" flag is written the moment the popup opens, not when it is
 * closed — otherwise moving from the home page to a city page would open it
 * again, and again, for a visitor who is browsing. sessionStorage rather than
 * localStorage: it should come back on a fresh visit tomorrow, just not four
 * times in one.
 *
 * Every storage call is wrapped: in a private window, or with site data
 * blocked, sessionStorage *throws* on access rather than returning null. An
 * unguarded read there would take the whole page down, so a failure is treated
 * as "not seen" and the popup simply shows.
 */

const SEEN_KEY = "mb:welcome-popup";

export default function WelcomePopup({
  cityOptions,
  // Artwork drawn for this popup: it carries the branding AND the heading, so
  // the card below prints neither. Shown whole — see PopupLeadForm.
  image = "/navheroimage/formpopimg.png",
  imageAlt = "MedicoBharat lab test at home — free home sample collection",
  // Not painted anywhere: this is the dialog's accessible name, which the
  // image cannot supply.
  title = "Book Lab Test at Home",
  // Long enough for the page underneath to paint first, short enough to still
  // read as "on open". It is a prop so this is one number to change, not a
  // hunt through the component.
  delay = 1200,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage is unavailable — the popup still opens, it just cannot
        // remember that it did.
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes it, and the page behind stops scrolling while it is up —
  // without the lock, a scroll gesture over the backdrop moves the article
  // underneath and the popup looks stuck to the glass.
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

  if (!open) return null;

  return (
    // Above FloatingCallButton (z-50) and the booking modal (z-60), so nothing
    // on the page can print through it. `overflow-y-auto` + `items-start` on a
    // short phone: the card is taller than a 640px viewport, and centred it
    // would have its submit button off screen with no way to reach it.
    //
    // The dim and the blur are deliberately light: the page behind has to stay
    // readable, so this only pushes it back a step rather than hiding it.
    // `backdrop-blur-sm` is 8px in Tailwind v4 — enough to turn the content
    // underneath into mush — so the blur is set to 2px by hand.
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={close}
      className="lab-fade-in fixed inset-0 z-70 flex cursor-pointer items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-[2px] sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        /* Narrower on a phone than it used to be. With only the overlay's
           px-4 to hold it back, `max-w-sm` (384px) meant the card ran to
           within 16px of both edges on every handset — it read as a full
           screen takeover rather than a card, and the page behind it, which
           the light dim and 2px blur exist to keep visible, was gone anyway.
           `max-w-xs` (320px) leaves a real margin on both sides at 360px and
           up, and still clears the widest field label inside at the form's
           px-5. Above `sm` there is room, so it goes back to 384px. */
        className="lab-pop-in my-auto w-full max-w-xs cursor-default sm:max-w-sm"
      >
        <PopupLeadForm
          cityOptions={cityOptions}
          image={image}
          imageAlt={imageAlt}
          onClose={close}
        />
      </div>
    </div>
  );
}
