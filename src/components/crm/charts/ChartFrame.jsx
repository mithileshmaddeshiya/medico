"use client";

/**
 * The card every chart sits in: title, one-line description, the legend
 * (only when there are two or more series — a single series is named by the
 * title), the chart, and a "Show table" toggle that swaps in the same numbers
 * as a plain table. The table is the accessible twin of the chart and the
 * relief for the palette's low-contrast slots, so every chart has one.
 *
 *   table = { columns: [{ label, format?, align? }], rows: [[value, …]] }
 *   `format` is a key from ./scale (count | rupees | pct | hours); a column
 *   without one prints its values as given.
 *
 * `empty` (a sentence) replaces the chart when the period has no data.
 */
import { useId, useState } from "react";
import { BarChart3, Table2 } from "lucide-react";

import { SURFACE, cx } from "../ui";
import { fmt } from "./scale";

export default function ChartFrame({ title, description, legend, table, empty, note, actions, children, className = "" }) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const hasTable = table && table.rows.length > 0 && !empty;

  return (
    <figure className={cx(SURFACE, "m-0 flex min-w-0 flex-col overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
        <figcaption className="min-w-0">
          <h2 className="text-[14.5px] font-semibold tracking-tight text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{description}</p>}
        </figcaption>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {hasTable && (
            <button
              type="button"
              onClick={() => setShowTable((s) => !s)}
              aria-pressed={showTable}
              aria-controls={tableId}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {showTable ? <BarChart3 className="h-3.5 w-3.5" aria-hidden /> : <Table2 className="h-3.5 w-3.5" aria-hidden />}
              {showTable ? "Show chart" : "Show table"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 sm:px-5">
        {empty ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </span>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-slate-500">{empty}</p>
          </div>
        ) : showTable ? (
          <div id={tableId} className="max-h-[420px] overflow-auto rounded-xl ring-1 ring-inset ring-slate-200">
            <table className="w-full border-separate border-spacing-0 text-left text-[13px]">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr>
                  {table.columns.map((c, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cx(
                        "sticky top-0 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11.5px] font-semibold text-slate-500",
                        (c.align ?? (c.format ? "right" : "left")) === "right" && "text-right"
                      )}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((v, i) => {
                      const c = table.columns[i] ?? {};
                      const right = (c.align ?? (c.format ? "right" : "left")) === "right";
                      return (
                        <td
                          key={i}
                          className={cx(
                            "border-b border-slate-100 px-3 py-2 text-slate-700",
                            right && "text-right tabular-nums",
                            i === 0 && "font-medium text-slate-900"
                          )}
                        >
                          {c.format ? fmt(c.format, v) : v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {legend && legend.length >= 2 && <Legend items={legend} />}
            {children}
          </>
        )}
      </div>

      {note && !empty && (
        <p className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-[12px] leading-relaxed text-slate-500 sm:px-5">{note}</p>
      )}
    </figure>
  );
}

/** Legend keys mirror the mark: a short stroke for lines, a small square for bars. */
export function Legend({ items }) {
  return (
    <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label="Legend">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
          {it.mark === "line" ? (
            <span aria-hidden className="h-[2px] w-3.5 rounded-full" style={{ background: it.color }} />
          ) : (
            <span aria-hidden className="h-2.5 w-2.5 rounded-[3px]" style={{ background: it.color }} />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  );
}
