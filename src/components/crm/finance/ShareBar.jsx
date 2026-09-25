"use client";

/**
 * A part-to-whole bar: one thin horizontal bar split into segments (collection
 * by payment mode, spend by category), with a legend that doubles as the
 * table view — every segment's label, amount and share are written out, so
 * nothing depends on colour or on hovering.
 *
 * Segments are separated by a 2px surface gap, the outer ends are rounded,
 * and each segment has a hover/focus tooltip. Labels are rendered as text
 * nodes (React escapes them), never as HTML.
 *
 *   segments  [{ key, label, value (number), display (string), sub?, color }]
 */
import { useState } from "react";

export default function ShareBar({ segments, label, empty = "Nothing recorded in this period." }) {
  const [active, setActive] = useState(null);
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  const shown = segments.filter((s) => s.value > 0);

  if (!total) return <p className="py-6 text-center text-[13px] text-slate-500">{empty}</p>;

  const pct = (v) => (v / total) * 100;
  const hovered = shown.find((s) => s.key === active);
  // Centre of each segment, for placing its tooltip.
  const lefts = {};
  shown.reduce((start, s) => {
    lefts[s.key] = start + pct(s.value) / 2;
    return start + pct(s.value);
  }, 0);

  return (
    <div>
      <div className="relative pt-1">
        {hovered && (
          <div
            role="tooltip"
            className="pointer-events-none absolute bottom-full z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] shadow-md"
            style={{ left: `${Math.min(88, Math.max(12, lefts[hovered.key]))}%` }}
          >
            <p className="font-semibold text-slate-900 tabular-nums">{hovered.display}</p>
            <p className="flex items-center gap-1.5 text-slate-500">
              <span aria-hidden className="inline-block h-0.5 w-3 rounded" style={{ background: hovered.color }} />
              {hovered.label} · {pct(hovered.value).toFixed(1)}%
            </p>
          </div>
        )}
        <div className="flex h-5 w-full gap-[2px] overflow-hidden rounded-[4px] bg-white" role="group" aria-label={label}>
          {shown.map((s) => (
            <span
              key={s.key}
              tabIndex={0}
              aria-label={`${s.label}: ${s.display}, ${pct(s.value).toFixed(1)}%`}
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              className="h-full min-w-[3px] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-slate-900"
              style={{ width: `${pct(s.value)}%`, background: s.color, opacity: active && active !== s.key ? 0.55 : 1 }}
            />
          ))}
        </div>
      </div>

      <table className="mt-3 w-full text-[13px]">
        <caption className="sr-only">{label}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Amount</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((s) => (
            <tr
              key={s.key}
              className="border-t border-slate-100 first:border-t-0"
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
            >
              <th scope="row" className="py-1.5 pr-2 text-left font-medium text-slate-700">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
                  {s.label}
                  {s.sub && <span className="font-normal text-slate-400">{s.sub}</span>}
                </span>
              </th>
              <td className="py-1.5 text-right font-semibold text-slate-900 tabular-nums">{s.display}</td>
              <td className="w-16 py-1.5 text-right text-slate-500 tabular-nums">{s.value > 0 ? `${pct(s.value).toFixed(1)}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
