import { Phone } from "lucide-react";

/**
 * Closing call-strip — the last thing under the SEO copy.
 *
 * Deliberately centred and near-empty: after a long read the only decision left
 * is "call them", so nothing else competes for the tap. Colours are the hero's
 * (emerald → teal on a soft emerald wash) so the page ends where it started.
 *
 * `banner` and `phone` come from the city document (or its generated default) —
 * see defaultCallBanner in src/data/lab/defaults.js, which carries the reason
 * this heading is keyword-bearing per city rather than one template with the
 * town's name dropped into it. Read that note before rewording either string.
 */
export default function LabCallBanner({ banner, phone }) {
  const tel = `tel:${String(phone ?? "").replace(/\s/g, "")}`;

  return (
    <section
      aria-label="Call to book a health checkup"
      className="border-t border-emerald-100 bg-linear-to-b from-emerald-50/70 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-11 text-center">

        {/* The icon dials too. It looks like the most tappable thing on the
            strip, so a tap that did nothing read as a broken page — and on a
            phone it is the first thing a thumb reaches. `aria-hidden` keeps it
            out of the screen-reader flow: the number and the button below say
            the same thing, and three "call us" links in a row is noise. */}
        <a
          href={tel}
          aria-hidden
          tabIndex={-1}
          title={`Call ${phone} to book a lab test`}
          className="mx-auto flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white ring-6 ring-white shadow-[0_10px_24px_-12px_rgba(5,150,105,0.9)] transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-[0_14px_28px_-12px_rgba(5,150,105,0.95)] active:scale-95"
        >
          <Phone className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={2.2} />
        </a>

        {/* max-w-4xl, not the container's full 6xl and not the max-w-xl this
            briefly had. The cap exists so the heading sits over the button
            rather than spanning the whole viewport like a banner ad; 4xl is
            the width at which the longest heading we ship — Kushinagar's, at
            57 characters — still lands on ONE line at the md size below.
            Narrower than that and it broke in two on desktop.

            Sizes stay a step down from the hero's: this is the page's closing
            line, not its headline. On a phone the heading cannot fit on one
            line at any readable size, so text-balance is kept to split what
            wrapping is left into even lines instead of a long one and a stub. */}
        <h2 className="mx-auto mt-4 max-w-4xl text-balance text-[17px] min-[400px]:text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
          {banner?.heading}
        </h2>

        <a
          href={tel}
          aria-label={`Call us at ${phone}`}
          title={`Call ${phone} to book a lab test`}
          className="mt-2 inline-block text-[16px] sm:text-[19px] font-bold tabular-nums tracking-tight text-emerald-700 hover:text-emerald-800"
        >
          {phone}
        </a>

        <div className="mt-5">
          <a
            href={tel}
            title={`Call ${phone} to book a lab test`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-7 sm:px-9 text-[13px] sm:text-[14px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(5,150,105,0.95)] hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all duration-200"
          >
            <Phone className="h-4 w-4 shrink-0" strokeWidth={2.4} />
            {banner?.buttonText}
          </a>
        </div>

      </div>
    </section>
  );
}
