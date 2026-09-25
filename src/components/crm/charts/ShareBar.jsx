/**
 * Part-to-whole as one stacked bar (the dataviz skill's preferred form over a
 * donut): online vs offline, booking channels, payment methods. Segments are
 * separated by a 2px gap in the card's white, never a stroke.
 *
 * Every segment's name, value and share is printed in the legend beneath —
 * the three light palette slots sit under 3:1 on white, so the numbers must
 * never depend on reading the colour. Server-safe, no hooks.
 *
 *   parts   [{ label, value, color? }] in a FIXED order (colour follows the
 *           entity, so a part that drops to zero keeps its neighbours' hues)
 */
import { SERIES, fmt } from "./scale";

export default function ShareBar({ parts, format = "count", label }) {
  const coloured = parts.map((p, i) => ({ ...p, value: Number(p.value) || 0, color: p.color ?? SERIES[i % SERIES.length] }));
  const total = coloured.reduce((a, p) => a + Math.max(0, p.value), 0);
  const share = (v) => (total ? (Math.max(0, v) / total) * 100 : 0);
  const shown = coloured.filter((p) => p.value > 0);
  const summary =
    label ?? coloured.map((p) => `${p.label} ${fmt(format, p.value)} (${share(p.value).toFixed(0)}%)`).join(", ");

  return (
    <div>
      <div role="img" aria-label={summary} className="flex h-4 w-full gap-[2px] overflow-hidden rounded-sm">
        {shown.map((p) => (
          <div
            key={p.label}
            title={`${p.label}: ${fmt(format, p.value)} · ${share(p.value).toFixed(1)}%`}
            className="h-full min-w-[3px] transition-opacity hover:opacity-80"
            style={{ flexGrow: p.value, flexBasis: 0, background: p.color }}
          />
        ))}
        {!shown.length && <div className="h-full w-full bg-slate-100" />}
      </div>
      <ul className="mt-3.5 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
        {coloured.map((p) => (
          <li key={p.label} className="flex items-center gap-2 text-[13px]">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: p.color }} />
            <span className="min-w-0 flex-1 truncate text-slate-600">{p.label}</span>
            <span className="font-semibold text-slate-900 tabular-nums">{fmt(format, p.value)}</span>
            <span className="w-11 text-right text-[12px] text-slate-500 tabular-nums">{share(p.value).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
