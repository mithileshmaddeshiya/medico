/**
 * Small server-rendered pieces shared by the dashboard, the owner overview
 * and the operations queues: a ranked bar list, a meter, the activity feed,
 * a summary strip, and the stage-age label.
 *
 * Chart rules (same as ColumnChart): one hue for one series, thin marks,
 * labels and values in ink — the coloured bar beside the text carries the
 * meaning, the text never wears the series colour.
 */
import Link from "next/link";

import { activityLink } from "@/lib/crm/activity";
import { istDay } from "@/lib/crm/dates";
import { dateTime, time } from "@/lib/crm/format";
import { cx } from "@/components/crm/ui";

/**
 * Ranked horizontal bars: [{ key, label, value, display?, href? }]. Every
 * value is labelled at the bar's end, so nothing is gated behind hover; the
 * row's title attribute repeats it for pointer users.
 */
export function BarList({ items, empty = null }) {
  if (!items.length) return empty;
  const max = Math.max(1, ...items.map((i) => Number(i.value) || 0));
  return (
    <ul className="space-y-2.5">
      {items.map((i) => {
        const pctW = Math.max(2, ((Number(i.value) || 0) / max) * 100);
        const row = (
          <>
            <span className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="truncate font-medium text-slate-800">{i.label}</span>
              <span className="shrink-0 font-semibold text-slate-900 tabular-nums">{i.display ?? i.value}</span>
            </span>
            <span className="mt-1 block h-2 rounded-full bg-blue-50" aria-hidden>
              <span className="block h-2 rounded-full bg-[#2a78d6]" style={{ width: `${pctW}%` }} />
            </span>
          </>
        );
        return (
          <li key={i.key} title={`${i.label}: ${i.display ?? i.value}`}>
            {i.href ? (
              <Link href={i.href} className="block rounded-md hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600">
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** A progress meter: accent fill on a lighter step of the same hue. */
export function Meter({ value, max = 100, label, tone = "blue" }) {
  const pct = Math.min(100, Math.max(0, max > 0 ? (Number(value) / max) * 100 : 0));
  const tones = {
    blue: ["bg-blue-100", "bg-[#2a78d6]"],
    emerald: ["bg-emerald-100", "bg-emerald-600"],
    amber: ["bg-amber-100", "bg-amber-500"],
  };
  const [track, fill] = tones[tone] ?? tones.blue;
  return (
    <span
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Number(value) || 0}
      aria-label={label}
      className={cx("block h-2 overflow-hidden rounded-full", track)}
    >
      <span className={cx("block h-2 rounded-full", fill)} style={{ width: `${pct}%` }} />
    </span>
  );
}

/**
 * The recent activity feed: "09:32 am · Partner ABC · uploaded report ·
 * MB10245", newest first, each row linking to its record.
 */
export function ActivityFeed({ rows, today }) {
  if (!rows.length) return <p className="py-6 text-center text-[13px] text-slate-500">No activity yet.</p>;
  return (
    <ol className="divide-y divide-slate-100">
      {rows.map((a) => {
        const href = activityLink(a);
        const when = istDay(a.created_at) === today ? time(a.created_at) : dateTime(a.created_at);
        const body = (
          <>
            <span className="block text-[13px] leading-snug text-slate-800">{a.summary || `${a.action} ${a.entity}`}</span>
            <span className="mt-0.5 block text-[11.5px] text-slate-500">
              <span className="tabular-nums">{when}</span> · {a.user_name || a.user_email || "System"}
            </span>
          </>
        );
        return (
          <li key={a.id} className="py-2.5 first:pt-0 last:pb-0">
            {href ? (
              <Link href={href} className="block hover:text-blue-700 [&_span:first-child]:hover:text-blue-700">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A row of small labelled counts: [{ label, value, tone?, href? }]. */
export function SummaryStrip({ items }) {
  const tones = {
    slate: "text-slate-900",
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    amber: "text-amber-800",
    blue: "text-blue-700",
  };
  return (
    <div className="mb-4 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
      {items.map((i) => {
        const inner = (
          <>
            <p className="text-[11.5px] font-medium text-slate-500">{i.label}</p>
            <p className={cx("mt-0.5 text-[20px] font-semibold leading-none tabular-nums", tones[i.tone] ?? tones.slate)}>{i.value}</p>
          </>
        );
        const cls = "block min-w-[7.5rem] rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5";
        return i.href ? (
          <Link key={i.label} href={i.href} className={cx(cls, "transition-colors hover:border-blue-300")}>
            {inner}
          </Link>
        ) : (
          <div key={i.label} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
