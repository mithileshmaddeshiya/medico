/**
 * The one filter row above every analytics view: 7 Days · 30 Days · 90 Days ·
 * 6 Months · 1 Year as server-rendered links, plus a custom from/to that is a
 * plain GET form — no client JS, so the range works before hydration and
 * every view is a shareable URL. Other params on the page (partner, sort)
 * are carried through.
 *
 *   presets  [{ key, label }] (RANGE_PRESETS from the analytics store)
 *   active   the current key ("30d" | … | "custom")
 *   r        the resolved range, for the custom inputs and the caption
 */
import Link from "next/link";
import { CalendarRange } from "lucide-react";

import { btn, cx, inputCls, withParams } from "../ui";

export default function RangeControl({ path, sp, presets, active, r, keep = [], children }) {
  return (
    <div className="mb-5 flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:items-center">
      <nav aria-label="Date range" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="inline-flex min-w-max rounded-xl bg-white p-1 ring-1 ring-inset ring-slate-200">
          {presets.map((p) => {
            const on = p.key === active;
            return (
              <li key={p.key}>
                <Link
                  href={withParams(path, sp, { range: p.key, from: null, to: null })}
                  aria-current={on ? "true" : undefined}
                  scroll={false}
                  className={cx(
                    "inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold transition-colors",
                    on ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {p.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form method="get" action={path} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="range" value="custom" />
        {keep.map((k) => (sp[k] ? <input key={k} type="hidden" name={k} value={[].concat(sp[k])[0]} /> : null))}
        <CalendarRange className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden />
        <input
          type="date"
          name="from"
          required
          aria-label="From date"
          defaultValue={active === "custom" ? r.fromDay : ""}
          className={cx(inputCls, "h-10 w-[calc(50%-0.25rem)] py-0 sm:w-auto")}
        />
        <input
          type="date"
          name="to"
          required
          aria-label="To date"
          defaultValue={active === "custom" ? r.toDay : ""}
          className={cx(inputCls, "h-10 w-[calc(50%-0.25rem)] py-0 sm:w-auto")}
        />
        <button type="submit" className={btn(active === "custom" ? "primary" : "secondary", "md", "w-full sm:w-auto")}>
          Custom range
        </button>
      </form>

      {children && <div className="flex flex-wrap items-center gap-2 lg:ml-auto">{children}</div>}
    </div>
  );
}
