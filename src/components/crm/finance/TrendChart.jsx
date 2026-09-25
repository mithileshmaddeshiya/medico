"use client";

/**
 * Column trend for one measure over time (net cash per day / month).
 *
 * One series, so no legend box — the card title names it. One y axis with
 * clean rupee ticks, hairline solid gridlines, columns ≤ 24px with a 4px
 * rounded data end and a square foot on the baseline. Every column's whole
 * slot is its hover/focus target (bigger than the mark), and the tooltip
 * lists every figure for that period, value first. The same numbers are in
 * the table under the chart, so the tooltip never gates anything.
 *
 *   points  [{ key, tick (short axis label), title (full label), value, rows: [[name, text]] }]
 */
import { useEffect, useRef, useState } from "react";

import { rupeesShort } from "@/lib/crm/format";

import { INK } from "./palette";

const H = 230;
const M = { top: 14, right: 8, bottom: 26, left: 58 };

function niceStep(span, count = 4) {
  const raw = span / count || 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}

/** A column path with a rounded data end (top when positive, bottom when negative). */
function column(x, w, y0, y1, r = 4) {
  const h = Math.abs(y1 - y0);
  const rr = Math.min(r, w / 2, h);
  if (h < 0.5) return "";
  if (y1 < y0) {
    return `M${x},${y0} V${y1 + rr} Q${x},${y1} ${x + rr},${y1} H${x + w - rr} Q${x + w},${y1} ${x + w},${y1 + rr} V${y0} Z`;
  }
  return `M${x},${y0} V${y1 - rr} Q${x},${y1} ${x + rr},${y1} H${x + w - rr} Q${x + w},${y1} ${x + w},${y1 - rr} V${y0} Z`;
}

export default function TrendChart({ points, label, color = INK.accent }) {
  const box = useRef(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const values = points.map((p) => p.value);
  const hasData = values.some((v) => v !== 0);
  const maxV = Math.max(0, ...values);
  const minV = Math.min(0, ...values);
  const step = niceStep(maxV - minV || 1);
  const top = Math.max(step, Math.ceil(maxV / step) * step);
  const bottom = Math.floor(minV / step) * step;
  const ticks = [];
  for (let t = bottom; t <= top + step / 2; t += step) ticks.push(t);

  const iw = width - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const y = (v) => M.top + ih - ((v - bottom) / (top - bottom || 1)) * ih;
  const band = iw / Math.max(1, points.length);
  const barW = Math.max(1, Math.min(24, band * 0.68));
  const every = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(iw / 64))));
  const hp = hover !== null ? points[hover] : null;

  return (
    <div ref={box} className="relative w-full">
      {!hasData && (
        <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[13px] text-slate-500">
          No money moved in this period.
        </p>
      )}
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="group" aria-label={label} className="block h-auto max-w-full" onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth="1" shapeRendering="crispEdges" />
            <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={INK.muted} style={{ fontVariantNumeric: "tabular-nums" }}>
              {rupeesShort(t)}
            </text>
          </g>
        ))}

        {points.map((p, i) => {
          const x = M.left + i * band + (band - barW) / 2;
          return (
            <path
              key={p.key}
              d={column(x, barW, y(0), y(p.value))}
              fill={color}
              opacity={hover !== null && hover !== i ? 0.45 : 1}
            />
          );
        })}

        {points.map((p, i) =>
          i % every === 0 ? (
            <text key={p.key} x={M.left + i * band + band / 2} y={H - 8} textAnchor="middle" fontSize="11" fill={INK.muted}>
              {p.tick}
            </text>
          ) : null
        )}

        {/* Hit targets: the whole slot, top to bottom. */}
        {points.map((p, i) => (
          <rect
            key={p.key}
            x={M.left + i * band}
            y={M.top}
            width={band}
            height={ih}
            fill="transparent"
            tabIndex={0}
            aria-label={`${p.title}: ${p.rows.map(([k, v]) => `${k} ${v}`).join(", ")}`}
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="outline-none"
          />
        ))}
      </svg>

      {hp && (
        <div
          role="tooltip"
          className="pointer-events-none absolute top-1 z-10 min-w-[10rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] shadow-md"
          style={{
            left: Math.min(width - 170, Math.max(0, M.left + hover * band + band / 2 - 80)),
          }}
        >
          <p className="font-medium text-slate-500">{hp.title}</p>
          <dl className="mt-1 space-y-0.5">
            {hp.rows.map(([k, v], j) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-1.5 text-slate-500">
                  {j === 0 && <span aria-hidden className="inline-block h-0.5 w-3 rounded" style={{ background: color }} />}
                  {k}
                </dt>
                <dd className={j === 0 ? "font-semibold text-slate-900 tabular-nums" : "text-slate-700 tabular-nums"}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
