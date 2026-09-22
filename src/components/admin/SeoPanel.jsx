"use client";

/**
 * The SEO panel that sits beside the editor and updates as you type.
 *
 * It runs src/lib/admin/seoScore.js — the same module the server runs on save,
 * so the number shown here is the number that gets stored. A panel that
 * computes its own score in the browser and lets the server compute a
 * different one is worse than no panel.
 *
 * ── THE SCORE IS NOT A RANKING PREDICTION AND SAYS SO ────────────────────
 * The line under the dial is not decoration. Every one of these tools gets
 * read as "100 means this page will rank", and on a health site that belief is
 * actively harmful: it is what produces 1,400 words of padding around a
 * three-sentence answer, and it is the exact pattern Google's helpful-content
 * work targets. The checks here are mechanical facts — a length, a missing alt
 * attribute, a keyword that is not in the title. Worth fixing, and no more
 * than that.
 *
 * There is deliberately no keyword-density meter. Writing to a density target
 * is how prose stops being readable, and it has not been a useful signal for
 * a decade.
 */
import { useMemo } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { headingsOf, imagesOf, linksOf, textOf } from "@/lib/admin/sanitizeHtml";
import { scoreBand, scorePage, serpPreview } from "@/lib/admin/seoScore";

const ICON = {
  pass: { Icon: CheckCircle2, className: "text-emerald-600" },
  warn: { Icon: AlertTriangle, className: "text-amber-600" },
  error: { Icon: AlertCircle, className: "text-rose-600" },
  hint: { Icon: Info, className: "text-slate-400" },
};

const BAND = {
  good: { ring: "stroke-emerald-500", text: "text-emerald-700", label: "Good" },
  ok: { ring: "stroke-amber-500", text: "text-amber-700", label: "Worth a look" },
  poor: { ring: "stroke-rose-500", text: "text-rose-700", label: "Needs work" },
};

/** The dial. An SVG ring rather than a bar — it reads as a score, not a load. */
function Dial({ score }) {
  const band = BAND[scoreBand(score)];
  const circumference = 2 * Math.PI * 34;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r="34" className="fill-none stroke-slate-200" strokeWidth="7" />
          <circle
            cx="40"
            cy="40"
            r="34"
            className={`fill-none ${band.ring} transition-[stroke-dashoffset] duration-500`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-extrabold ${band.text}`}
        >
          {score}
        </span>
      </div>

      <div className="min-w-0">
        <p className={`text-[13px] font-bold ${band.text}`}>{band.label}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
          A checklist of things that are true or false about this page — not a prediction of where
          it will rank. Do not pad the article to move this number.
        </p>
      </div>
    </div>
  );
}

export default function SeoPanel({
  title,
  description,
  slug,
  path,
  focusKeyword,
  bodyHtml,
  heroAlt,
  noindex,
}) {
  // Parsing the body on every keystroke is the cost here, and it is the reason
  // this is memoised on the inputs rather than recomputed in render.
  const result = useMemo(() => {
    const html = bodyHtml ?? "";
    return scorePage({
      title,
      description,
      slug,
      focusKeyword,
      bodyText: textOf(html),
      headings: headingsOf(html),
      links: linksOf(html),
      images: imagesOf(html),
      heroAlt,
      noindex,
    });
  }, [title, description, slug, focusKeyword, bodyHtml, heroAlt, noindex]);

  const preview = serpPreview({ title, description, path });

  // Failures first — a list where the one broken thing is eighth is a list
  // nobody reads to the bottom of.
  const order = { error: 0, warn: 1, hint: 2, pass: 3 };
  const checks = [...result.checks].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <Dial score={result.score} />
      </div>

      {/* What the result will most likely look like. The title carries the
          " | MedicoBharat" the root layout's template appends, because that is
          what is actually published — a preview of the untemplated title is a
          preview of a page that does not exist. */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
          In Google, roughly
        </p>
        <div className="mt-3 rounded-lg bg-slate-50 p-3.5">
          <p className="truncate text-[12px] text-slate-600">{preview.url}</p>
          <p className="mt-0.5 text-[15px] font-medium leading-snug text-[#1a0dab]">
            {preview.title || "Untitled"}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
            {preview.description || "No description — Google will pick a sentence from the page."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3.5">
          <p className="text-[13px] font-bold text-slate-900">
            {result.failed ? `${result.failed} to look at` : "Nothing outstanding"}
          </p>
        </div>

        <ul className="divide-y divide-slate-100">
          {checks.map((check) => {
            const { Icon, className } = ICON[check.status];
            return (
              <li key={check.id} className="flex gap-2.5 px-5 py-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${className}`} strokeWidth={2.4} />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-slate-800">{check.label}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">{check.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
