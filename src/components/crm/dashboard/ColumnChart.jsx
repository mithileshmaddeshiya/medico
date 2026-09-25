"use client";

/**
 * A single-series daily column chart (the owner overview's revenue by day).
 *
 * Follows the CRM's chart rules: one series in the accent blue, columns no
 * wider than 24px with a 4px rounded cap and a square base on one baseline,
 * hairline gridlines, one axis, values in ink (never the series colour).
 * Every column is its own hover/focus target — the whole day band, not just
 * the painted pixels — and shows the day and value in a tooltip. Tooltips
 * never gate: the same figures are in the "Show as table" view below.
 */
import { useState } from "react";

import { num, rupees, rupeesShort } from "@/lib/crm/format";

const W = 640;
const H = 180;
const PAD = { top: 12, right: 8, bottom: 22, left: 44 };
const ACCENT = "#2a78d6";

/** A nice round top for the axis: 1, 2, 2.5 or 5 × 10^n. */
function niceMax(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/** Column path: rounded 4px at the data end, square at the baseline. */
function column(x, y, w, h) {
  if (h <= 0) return "";
  const r = Math.min(4, w / 2, h);
  return `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`;
}

/** "2026-09-05" → "5 Sep" (fixed locale and zone, so server and browser agree). */
const dayLabel = (ymd) => new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short" });

/**
 * data  [{ day: "YYYY-MM-DD", value }]
 * unit  "rupees" | "count" — how values and axis ticks are written
 */
export default function ColumnChart({ data, unit = "count", label = "Value", emptyText = "No data yet" }) {
  const [active, setActive] = useState(null);
  const format = unit === "rupees" ? rupees : num;
  const tick = unit === "rupees" ? rupeesShort : num;
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / Math.max(1, data.length);
  const barW = Math.min(24, Math.max(3, band - 4));
  const y = (v) => PAD.top + innerH - (Math.max(0, v) / max) * innerH;
  const ticks = [0, max / 2, max];
  const labelled = new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]);
  const peak = data.reduce((best, d, i) => (d.value > (data[best]?.value ?? -Infinity) ? i : best), 0);
  const hasData = data.some((d) => d.value !== 0);
  const a = active !== null ? data[active] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${label} by day`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#cbd5e1" : "#e2e8f0"} strokeWidth="1" />
            <text x={PAD.left - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10.5" fill="#64748b" className="tabular-nums">
              {tick(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = PAD.left + i * band + (band - barW) / 2;
          const top = y(d.value);
          return (
            <g key={d.day}>
              <path d={column(x, top, barW, PAD.top + innerH - top)} fill={ACCENT} opacity={active === null || active === i ? 1 : 0.45} />
              {labelled.has(i) && (
                <text x={PAD.left + i * band + band / 2} y={H - 6} textAnchor="middle" fontSize="10.5" fill="#64748b">
                  {dayLabel(d.day)}
                </text>
              )}
              {/* The hit target is the whole day band. */}
              <rect
                x={PAD.left + i * band}
                y={PAD.top}
                width={band}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${dayLabel(d.day)}: ${format(d.value)}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              />
            </g>
          );
        })}
        {hasData && active === null && data[peak].value > 0 && (
          <text
            x={Math.min(W - PAD.right - 4, Math.max(PAD.left + 4, PAD.left + peak * band + band / 2))}
            y={y(data[peak].value) - 4}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="600"
            fill="#0f172a"
          >
            {format(data[peak].value)}
          </text>
        )}
      </svg>

      {a && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-white shadow-lg"
          style={{ left: `${Math.min(88, Math.max(12, ((PAD.left + active * band + band / 2) / W) * 100))}%` }}
        >
          <p className="text-[13px] font-semibold tabular-nums">{format(a.value)}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span aria-hidden className="inline-block h-0.5 w-3 rounded" style={{ background: ACCENT }} />
            {label} · {dayLabel(a.day)}
          </p>
        </div>
      )}

      {!hasData && <p className="absolute inset-0 flex items-center justify-center text-[13px] text-slate-500">{emptyText}</p>}

      <details className="mt-2 text-[12.5px]">
        <summary className="cursor-pointer select-none font-semibold text-slate-500 hover:text-slate-800">Show as table</summary>
        <div className="mt-2 max-h-60 overflow-auto rounded-lg ring-1 ring-slate-200">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 text-[11.5px] text-slate-500">
              <tr>
                <th scope="col" className="px-3 py-1.5 font-semibold">Day</th>
                <th scope="col" className="px-3 py-1.5 text-right font-semibold">{label}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-slate-700">{dayLabel(d.day)}</td>
                  <td className="px-3 py-1.5 text-right text-slate-900 tabular-nums">{format(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
