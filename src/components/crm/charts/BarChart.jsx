/**
 * Horizontal bars for a ranking or an ordered set of buckets — cities, tests,
 * partners, funnel stages, turnaround bands. Server-safe HTML (no hooks):
 * every value is printed at its bar's tip, so nothing hides behind a hover,
 * and names of any length wrap instead of being clipped by an SVG.
 *
 *   items   [{ label, value, color?, sub?, href? }]
 *   color   one hue for a nominal ranking (slot 1); ordered buckets pass
 *           per-item colours from the ORDINAL ramp instead
 *   note    e.g. "Lower is better" — said in words, not implied by colour
 *
 * Bars are 12px thick (the ≤24px cap) with a 4px rounded data end and a
 * square foot; rows are 2px+ apart so neighbours never touch.
 */
import Link from "next/link";

import { cx } from "../ui";
import { SERIES, fmt, fmtShort } from "./scale";

export default function BarChart({ items, format = "count", color = SERIES[0], note, label, max: maxIn }) {
  const max = Math.max(maxIn ?? 0, ...items.map((i) => Number(i.value) || 0), 0) || 1;
  const summary =
    label ?? items.map((i) => `${i.label}: ${fmt(format, i.value)}`).join("; ");

  return (
    <div>
      {note && <p className="mb-2.5 text-[12px] font-medium text-slate-500">{note}</p>}
      <ol className="space-y-2.5" aria-label={summary}>
        {items.map((it, idx) => {
          const v = Number(it.value) || 0;
          const pctW = Math.max(0, (v / max) * 100);
          const name = it.href ? (
            <Link href={it.href} className="hover:text-blue-700">
              {it.label}
            </Link>
          ) : (
            it.label
          );
          return (
            <li
              key={`${it.label}-${idx}`}
              title={`${it.label}: ${fmt(format, v)}${it.sub ? ` · ${it.sub}` : ""}`}
              className="group grid grid-cols-1 gap-1 rounded-lg sm:grid-cols-[minmax(0,34%)_1fr] sm:items-center sm:gap-3"
            >
              <div className="min-w-0 text-[13px] leading-snug text-slate-700">
                <span className="wrap-break-word font-medium text-slate-800">{name}</span>
                {it.sub && <span className="ml-1.5 text-[11.5px] text-slate-500">{it.sub}</span>}
              </div>
              {/* The value rides the bar's tip; the track reserves room for it at 100%. */}
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={cx("h-3 shrink-0 rounded-r-sm transition-opacity group-hover:opacity-80", v === 0 && "bg-transparent")}
                  style={{
                    width: `calc((100% - 5rem) * ${(pctW / 100).toFixed(4)})`,
                    minWidth: v > 0 ? 3 : 0,
                    background: v > 0 ? it.color ?? color : undefined,
                  }}
                />
                <span className="shrink-0 whitespace-nowrap text-[12.5px] font-semibold text-slate-900 tabular-nums">
                  {fmtShort(format, v)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
