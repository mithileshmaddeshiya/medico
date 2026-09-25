"use client";

/**
 * A trend over IST days or months: 1–3 series on ONE y axis (never two
 * scales), 2px lines, a 10% area wash when there is a single series.
 *
 * Hover, touch or arrow keys move a crosshair that snaps to the nearest
 * day; the tooltip lists every series at that point, value first. The end of
 * each line carries its latest value; the axis, tooltip and the frame's
 * table carry the rest — never a number on every point.
 *
 *   keys    x buckets, already zero-filled by the store ("2026-09-25" | "2026-09")
 *   series  [{ name, values, color }]
 *   format  count | rupees | pct | hours
 */
import { useState } from "react";

import { INK, SERIES, fmt, fmtShort, labelEvery, niceTicks, xLabel } from "./scale";
import { useWidth } from "./useWidth";

export default function LineChart({ keys, series, format = "count", height = 220, label }) {
  const [ref, width] = useWidth();
  const [at, setAt] = useState(null);

  const lines = series.map((s, i) => ({ ...s, color: s.color ?? SERIES[i], values: s.values.map((v) => Number(v) || 0) }));
  const all = lines.flatMap((s) => s.values);
  const ticks = niceTicks(Math.max(...all, 0), Math.min(...all, 0));
  const top = ticks[ticks.length - 1];
  const bottom = ticks[0];

  const tickW = Math.max(...ticks.map((t) => fmtShort(format, t).length)) * 6.6 + 10;
  const m = { l: tickW, r: 14, t: 18, b: 28 };
  const w = Math.max(width, 240);
  const pw = w - m.l - m.r;
  const ph = height - m.t - m.b;
  const n = keys.length;
  const x = (i) => m.l + (n <= 1 ? pw / 2 : (i * pw) / (n - 1));
  const y = (v) => m.t + ph - ((v - bottom) / (top - bottom || 1)) * ph;
  const showLabel = labelEvery(n, w < 420 ? 4 : 7);

  const path = (vals) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = (vals) => `${path(vals)} L${x(n - 1).toFixed(1)} ${y(Math.max(bottom, 0)).toFixed(1)} L${x(0).toFixed(1)} ${y(Math.max(bottom, 0)).toFixed(1)} Z`;

  const pick = (clientX, rect) => {
    const px = ((clientX - rect.left) / rect.width) * w;
    const i = n <= 1 ? 0 : Math.round(((px - m.l) / pw) * (n - 1));
    setAt(Math.min(n - 1, Math.max(0, i)));
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setAt((cur) => Math.min(n - 1, Math.max(0, (cur ?? n - 1) + (e.key === "ArrowRight" ? 1 : -1))));
    } else if (e.key === "Escape") setAt(null);
  };

  // End labels: the latest value of each line, dropped for a line whose end
  // sits within 14px of one already labelled (they would read as a stack).
  const ends = [];
  for (const s of lines) {
    const ey = y(s.values[n - 1] ?? 0);
    if (ends.every((e) => Math.abs(e.y - ey) >= 14)) ends.push({ y: ey, text: fmtShort(format, s.values[n - 1] ?? 0), color: s.color });
  }

  const summary =
    label ??
    `${lines.map((s) => s.name).join(" and ")} from ${xLabel(keys[0], true)} to ${xLabel(keys[n - 1], true)}. Latest: ${lines
      .map((s) => `${s.name} ${fmt(format, s.values[n - 1])}`)
      .join(", ")}.`;

  const tipLeft = at === null ? 0 : Math.min(Math.max(x(at), 80), w - 80);

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
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerDown={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={(e) => e.pointerType === "mouse" && setAt(null)}
        className="block touch-pan-y overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded-lg"
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
            <text key={k} x={x(i)} y={height - 8} textAnchor={n > 1 && i === n - 1 ? "end" : n > 1 && i === 0 ? "start" : "middle"} fontSize="11" fill={INK.muted}>
              {xLabel(k)}
            </text>
          ) : null
        )}

        {lines.length === 1 && n > 1 && <path d={area(lines[0].values)} fill={lines[0].color} opacity="0.1" />}
        {lines.map((s) => (
          <path key={s.name} d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}

        {/* End markers + latest values (text in ink, the dot carries identity). */}
        {at === null &&
          lines.map((s) => (
            <circle key={s.name} cx={x(n - 1)} cy={y(s.values[n - 1] ?? 0)} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
          ))}
        {at === null &&
          ends.map((e, i) => (
            <text key={i} x={x(n - 1) - 8} y={e.y - 9} textAnchor="end" fontSize="11.5" fontWeight="600" fill={INK.primary}>
              {e.text}
            </text>
          ))}

        {at !== null && (
          <g pointerEvents="none">
            <line x1={x(at)} x2={x(at)} y1={m.t} y2={m.t + ph} stroke={INK.muted} strokeWidth="1" />
            {lines.map((s) => (
              <circle key={s.name} cx={x(at)} cy={y(s.values[at])} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>

      {at !== null && (
        <div
          role="status"
          className="pointer-events-none absolute top-0 z-10 min-w-[140px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
          style={{ left: tipLeft }}
        >
          <p className="text-[11.5px] font-medium text-slate-500">{xLabel(keys[at], true)}</p>
          <ul className="mt-1 space-y-0.5">
            {lines.map((s) => (
              <li key={s.name} className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden className="h-[2px] w-3 rounded-full" style={{ background: s.color }} />
                <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{fmt(format, s.values[at])}</span>
                <span className="text-[12px] text-slate-500">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
