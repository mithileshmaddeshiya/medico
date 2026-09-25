/**
 * A breakdown that is a table and a bar chart at once: each row carries a
 * thin data bar under its label (one hue, length = share of the largest row)
 * and its figures in columns. The numbers are always written out, so the bar
 * is a reading aid, never the only way to get a value. Server-safe.
 *
 *   columns  [{ label, align? }]                 header for each figure column
 *   rows     [{ key, label, sub?, bar (0..1), cells: [node] }]
 */
import { INK } from "./palette";

export default function BreakdownTable({ caption, labelHeader, columns, rows, color = INK.accent, empty = "Nothing in this period." }) {
  if (!rows.length) return <p className="py-6 text-center text-[13px] text-slate-500">{empty}</p>;
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[20rem] text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-[11.5px] font-semibold text-slate-500">
            <th scope="col" className="pb-2 text-left font-semibold">
              {labelHeader}
            </th>
            {columns.map((c) => (
              <th key={c.label} scope="col" className={`whitespace-nowrap pb-2 pl-3 font-semibold ${c.align === "left" ? "text-left" : "text-right"}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t border-slate-100 align-top">
              <th scope="row" className="py-2 pr-2 text-left font-medium text-slate-800">
                <span className="block truncate">
                  {r.label}
                  {r.sub && <span className="ml-1.5 font-normal text-slate-400">{r.sub}</span>}
                </span>
                <span aria-hidden className="mt-1.5 block h-1.5 w-full rounded-[4px] bg-slate-100">
                  <span
                    className="block h-1.5 rounded-[4px]"
                    style={{ width: `${Math.max(r.bar > 0 ? 2 : 0, Math.min(1, r.bar) * 100)}%`, background: r.color ?? color }}
                  />
                </span>
              </th>
              {r.cells.map((cell, i) => (
                <td key={i} className={`whitespace-nowrap py-2 pl-3 tabular-nums text-slate-700 ${columns[i]?.align === "left" ? "text-left" : "text-right"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
