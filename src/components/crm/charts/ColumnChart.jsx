"use client";

/**
 * Counts or money per IST day / month, one column each. Columns cap at 24px
 * with the leftover band as air, a 4px rounded data end and a square foot on
 * the baseline. Values may go below zero (estimated profit): those columns
 * hang from the zero line in the diverging negative pole.
 *
 * Each column's whole band is its hover / touch target; arrow keys step
 * through them. Only the tallest column is labelled on its cap — the axis,
 * tooltip and table carry the others.
 *
 *   keys    x buckets, zero-filled ("2026-09-25" | "2026-09")
 *   values  numbers, same length
 *   name    what a value is ("Bookings"), shown in the tooltip
 */
import { useState } from "react";

import { INK, NEGATIVE, POSITIVE, fmt, fmtShort, labelEvery, niceTicks, xLabel } from "./scale";
import { useWidth } from "./useWidth";

/** A bar path with the data end rounded and the baseline end square. */
function barPath(x, yBase, yEnd, w) {
  const h = Math.abs(yBase - yEnd);
  if (h < 0.5) return "";
  const r = Math.min(4, w / 2, h);
  if (yEnd < yBase) {
    return `M${x} ${yBase} V${yEnd + r} Q${x} ${yEnd} ${x + r} ${yEnd} H${x + w - r} Q${x + w} ${yEnd} ${x + w} ${yEnd + r} V${yBase} Z`;
  }
  return `M${x} ${yBase} V${yEnd - r} Q${x} ${yEnd} ${x + r} ${yEnd} H${x + w - r} Q${x + w} ${yEnd} ${x + w} ${yEnd - r} V${yBase} Z`;
}

export default function ColumnChart({ keys, values, name = "Value", format = "count", color = POSITIVE, height = 220, label }) {
  const [ref, width] = useWidth();
  const [at, setAt] = useState(null);

  const vals = values.map((v) => Number(v) || 0);
  const ticks = niceTicks(Math.max(...vals, 0), Math.min(...vals, 0));
  const top = ticks[ticks.length - 1];
  const bottom = ticks[0];

  const tickW = Math.max(...ticks.map((t) => fmtShort(format, t).length)) * 6.6 + 10;
  const m = { l: tickW, r: 8, t: 20, b: 28 };
  const w = Math.max(width, 240);
  const pw = w - m.l - m.r;
  const ph = height - m.t - m.b;
  const n = keys.length;
  const band = pw / Math.max(n, 1);
  const cw = Math.max(1, Math.min(24, band * 0.72, band - 2));
  const y = (v) => m.t + ph - ((v - bottom) / (top - bottom || 1)) * ph;
  const y0 = y(0);
  const cx = (i) => m.l + i * band + (band - cw) / 2;
  const showLabel = labelEvery(n, w < 420 ? 4 : 7);
  const peak = vals.reduce((best, v, i) => (Math.abs(v) > Math.abs(vals[best] ?? 0) ? i : best), 0);

  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setAt((cur) => Math.min(n - 1, Math.max(0, (cur ?? n - 1) + (e.key === "ArrowRight" ? 1 : -1))));
    } else if (e.key === "Escape") setAt(null);
  };

  const summary =
    label ?? `${name} by ${keys[0]?.length === 7 ? "month" : "day"}, ${xLabel(keys[0], true)} to ${xLabel(keys[n - 1], true)}. Highest: ${fmt(format, vals[peak])} on ${xLabel(keys[peak], true)}.`;

  const tipLeft = at === null ? 0 : Math.min(Math.max(cx(at) + cw / 2, 70), w - 70);

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        role="img"
        aria-label={summary}
        tabIndex={0}
        onKeyDown={onKey}
        onFocus={() => setAt((cur) => cur ?? n - 1)}
        onBlur={() => setAt(null)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setAt(null)}
        className="block touch-pan-y overflow-visible rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
      >
        <title>{summary}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={w - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth="1" />
            <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={INK.muted} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtShort(format, t)}
            </text>
          </g>
        ))}
        {keys.map((k, i) =>
          showLabel(i) ? (
            <text key={k} x={cx(i) + cw / 2} y={height - 8} textAnchor="middle" fontSize="11" fill={INK.muted}>
              {xLabel(k)}
            </text>
          ) : null
        )}

        {vals.map((v, i) => (
          <path
            key={keys[i]}
            d={barPath(cx(i), y0, y(v), cw)}
            fill={v < 0 ? NEGATIVE : color}
            opacity={at === i ? 0.78 : 1}
          />
        ))}

        {vals[peak] !== 0 && at === null && (
          <text
            x={Math.min(Math.max(cx(peak) + cw / 2, m.l + 20), w - 20)}
            y={vals[peak] < 0 ? y(vals[peak]) + 14 : y(vals[peak]) - 6}
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="600"
            fill={INK.primary}
          >
            {fmtShort(format, vals[peak])}
          </text>
        )}

        {/* Hit targets: the whole band, not the painted column. */}
        {keys.map((k, i) => (
          <rect
            key={k}
            x={m.l + i * band}
            y={m.t}
            width={band}
            height={ph}
            fill="transparent"
            onPointerEnter={() => setAt(i)}
            onPointerDown={() => setAt(i)}
          />
        ))}
      </svg>

      {at !== null && (
        <div
          role="status"
          className="pointer-events-none absolute top-0 z-10 min-w-[120px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
          style={{ left: tipLeft }}
        >
          <p className="text-[11.5px] font-medium text-slate-500">{xLabel(keys[at], true)}</p>
          <p className="mt-0.5 whitespace-nowrap">
            <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{fmt(format, vals[at])}</span>{" "}
            <span className="text-[12px] text-slate-500">{name}</span>
          </p>
        </div>
      )}
    </div>
  );
}
