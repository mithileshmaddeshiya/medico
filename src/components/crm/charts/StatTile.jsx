/**
 * The hero figure — the one number a view leads with (exactly one per page).
 * 48px+ in the same sans as everything else, proportional figures (tabular
 * digits look loose at this size), a signed delta against a named period
 * coloured by whether up is good, and the arrow + word so direction never
 * rests on colour. The smaller figures around it use KpiCard from ../ui.
 */
import { SURFACE, cx } from "../ui";
import { change } from "@/lib/crm/format";

export default function StatTile({ label, value, current, previous, upIsGood = true, compareLabel = "vs previous period", sub, children }) {
  const delta = current === undefined ? undefined : change(current, previous);
  const good = !delta ? null : delta > 0 === upIsGood;

  return (
    <section className={cx(SURFACE, "flex flex-col justify-between gap-3 p-5 sm:p-6")}>
      <div>
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-[48px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[56px]">{value}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
          {delta === null && <span className="font-semibold text-blue-700">New this period</span>}
          {delta !== null && delta !== undefined && (
            <span className={cx("inline-flex items-center gap-1 font-semibold", good === null ? "text-slate-500" : good ? "text-emerald-700" : "text-rose-700")}>
              <span aria-hidden>{delta > 0 ? "▲" : delta < 0 ? "▼" : "•"}</span>
              {delta > 0 ? "Up" : delta < 0 ? "Down" : "Flat"} {Math.abs(delta).toFixed(Math.abs(delta) < 10 && delta !== 0 ? 1 : 0)}%
            </span>
          )}
          {delta !== undefined && <span className="text-slate-400">{compareLabel}</span>}
        </div>
        {sub && <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{sub}</p>}
      </div>
      {children}
    </section>
  );
}
