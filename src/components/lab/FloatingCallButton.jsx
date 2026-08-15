"use client";

import { Phone, X } from "lucide-react";
import { useState } from "react";

/**
 * The floating "Book Now" call pill, bottom-right on every long page.
 *
 * WHY IT EXISTS: the page is a long scroll — hero form, prices, how-to, FAQs,
 * then the SEO guide. A reader who decides halfway down has no way to act
 * without scrolling back up or all the way to the closing call strip. This
 * keeps the phone number one tap away wherever they are.
 *
 * It DIALS (`tel:`) rather than scrolling to the form on purpose: the form is a
 * callback request, this is the shortcut for the visitor who has already
 * decided and wants a person now.
 *
 * The X dismisses it for the rest of the visit. A floating pill that cannot be
 * closed is the thing that sits on top of the FAQ answer someone is reading —
 * state is deliberately in-memory only, so a fresh page load shows it again.
 *
 * `phone` is the city's number where there is one, LAB_PHONE otherwise, so this
 * can never dial a different number than the strips on the same page.
 */
export default function FloatingCallButton({ phone, label = "Book Now" }) {
  const [dismissed, setDismissed] = useState(false);

  if (!phone || dismissed) return null;

  const tel = `tel:${String(phone).replace(/\s/g, "")}`;

  return (
    // `pb-[env(safe-area-inset-bottom)]` keeps the pill clear of the iOS home
    // indicator — without it the bar sits over the bottom third of the button.
    <div className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] print:hidden">
      <div className="relative">
        {/* Same emerald→teal gradient, weight and shadow as the CTA button in
            LabCallBanner. Not a bespoke teal: a floating pill in its own colour
            reads as a third-party widget bolted onto the page. */}
        <a
          href={tel}
          aria-label={`Call MedicoBharat at ${phone} to book a test`}
          className="flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 text-[14px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(5,150,105,0.95)] transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]"
        >
          <Phone className="h-4 w-4 shrink-0" strokeWidth={2.4} />
          {label}
        </a>

        {/* Sits on the pill's top-right corner, outside it. A real <button>, not
            an icon on the anchor — tapping it must never dial. */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide the call button"
          className="absolute -right-1 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm ring-2 ring-white transition-colors duration-200 hover:bg-slate-900"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}
