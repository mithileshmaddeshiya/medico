// SSR component — nothing here has state.
import {
  ClipboardList,
  FileHeart,
  Headset,
  Microscope,
  TestTubeDiagonal,
} from "lucide-react";

/**
 * "How to book …" — the numbered row that sits under the long-form guide.
 *
 * WHY IT IS AT THE BOTTOM. A reader who has just finished the guide has decided
 * they want the test; the one thing left in the way is not knowing how the visit
 * works. So this block is the procedure, in order, with the timings the rest of
 * the site already promises — 30 minutes to the call, ~10 minutes for the visit,
 * 24 hours to the report. It repeats the trust strip's numbers on purpose: by
 * this point in the page that strip is a full screen-height away.
 *
 * ⚠ EVERY CLAIM HERE MUST BE TRUE OF THE ACTUAL OPERATION. The reference layout
 * this was built from carried "temperature-controlled sample transport" and
 * "results meticulously verified by our expert team" on its last two steps.
 * Neither is confirmed for this operation and both were removed from this
 * project once already — see the warning above defaultFaqs in
 * src/data/lab/defaults.js. Do not reintroduce them here.
 *
 * Shape: { heading, intro?, steps: [{ icon, title, text }] } — the city's own
 * `howTo` field or defaultHowTo(city); HOME_HOW_TO on the home page.
 *
 * Icons are stored as STRINGS in the data files and mapped back here, the same
 * convention every other lab component uses. An unknown name falls back rather
 * than crashing the page.
 */
const ICONS = {
  "clipboard-list": ClipboardList,
  headset: Headset,
  "test-tube": TestTubeDiagonal,
  microscope: Microscope,
  "file-heart": FileHeart,
};

/**
 * The dashed chevron between two steps, desktop only.
 *
 * It lives in the column gutter, not in a grid cell of its own: a cell would make
 * the columns uneven and would have to be hidden and re-flowed at every
 * breakpoint. Dashed rather than solid so it reads as "then" instead of as a
 * border between two boxes.
 *
 * The offset is exact, not eyeballed: the gutter is `gap-x-10` (40px) and the
 * glyph is `w-3` (12px), so a right edge at 26px centres it — 14px of gutter on
 * each side. Change the gap and this number has to move with it.
 */
function StepArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 44"
      fill="none"
      className="pointer-events-none absolute -right-6.5 top-1 hidden h-11 w-3 text-slate-300 lg:block"
    >
      <path
        d="M1 1 L11 22 L1 43"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The desktop column count, from the number of steps rather than hardcoded to
 * five — a four-step block on a five-column grid ends in an empty cell with a
 * dashed arrow pointing into it. Written out because Tailwind cannot see a class
 * built by string concatenation.
 */
const COLUMNS = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function LabHowTo({ data }) {
  const steps = data?.steps ?? [];
  if (!steps.length) return null;

  return (
    <section
      aria-labelledby="lab-howto-heading"
      className="hidden md:block border-t border-slate-200/80 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <div className="max-w-3xl">
          <h2
            id="lab-howto-heading"
            className="text-balance text-xl min-[400px]:text-2xl sm:text-[28px] font-extrabold leading-tight tracking-tight text-slate-900"
          >
            {data.heading}
          </h2>

          {data.intro && (
            <p className="mt-2.5 text-[12.5px] sm:text-[14px] leading-relaxed text-slate-500">
              {data.intro}
            </p>
          )}
        </div>

        {/* An ordered list, because the order IS the content — a crawler reading
            <ol> knows these are sequential steps; a grid of <div>s does not say
            that. Two columns on a phone would leave four-line paragraphs in a
            160px column, so it stacks below sm. */}
        <ol
          className={`mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-10 ${
            COLUMNS[steps.length] ?? "lg:grid-cols-4"
          }`}
        >
          {steps.map((step, i) => {
            const Icon = ICONS[step.icon] ?? ClipboardList;

            return (
              <li key={step.title} className="relative">
                {i < steps.length - 1 && <StepArrow />}

                {/* Icon and step number on one baseline. The number is oversized
                    and faint: it carries the sequence at a glance without
                    competing with the title underneath. */}
                <div className="flex items-end gap-1.5">
                  <Icon
                    aria-hidden
                    className="h-9 w-9 shrink-0 text-emerald-600"
                    strokeWidth={1.4}
                  />
                  <span
                    aria-hidden
                    className="text-[38px] font-extrabold leading-none tracking-tight text-slate-200"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-3.5 text-[15px] font-extrabold tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
