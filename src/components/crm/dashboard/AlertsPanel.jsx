/**
 * SLA alerts: what has waited too long, by rule (src/lib/crm/sla.js). Each
 * alert is an icon + a word for its severity + a count — never colour alone —
 * and its oldest few records, each a link straight to the record.
 */
import Link from "next/link";
import { CalendarClock, CheckCircle2, FileClock, FlaskConical, TestTube2, Wallet } from "lucide-react";

import { cx } from "@/components/crm/ui";

const ICONS = { sample: TestTube2, report: FileClock, partner: FlaskConical, payment: Wallet, followup: CalendarClock };

const SEVERITY = {
  danger: { word: "Critical", chip: "bg-rose-50 text-rose-700 ring-rose-600/15", icon: "bg-rose-50 text-rose-600" },
  warning: { word: "Warning", chip: "bg-amber-50 text-amber-800 ring-amber-600/20", icon: "bg-amber-50 text-amber-700" },
};

/** Where "see all" goes for each rule. */
const ALL_HREF = {
  sample_delay: "/crm/samples",
  report_delayed: "/crm/reports?tab=overdue",
  partner_pending: "/crm/bookings?partnerStatus=pending",
  payment_pending: "/crm/bookings?payment=pending",
  followup_overdue: "/crm/follow-ups",
};

export default function AlertsPanel({ alerts }) {
  const live = alerts.filter((a) => a.count > 0);
  if (!live.length) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13px] text-emerald-900 ring-1 ring-inset ring-emerald-600/15">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
        <p>
          <span className="font-semibold">All within SLA.</span> No delayed samples, reports, lab responses
          {alerts.some((a) => a.type === "payment_pending") ? ", payments" : ""} or follow-ups right now.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {live.map((a) => {
        const Icon = ICONS[a.icon] ?? FileClock;
        const sev = SEVERITY[a.severity] ?? SEVERITY.warning;
        return (
          <li key={a.type} className="rounded-xl border border-slate-200/80 p-3">
            <div className="flex items-start gap-2.5">
              <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sev.icon)}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-[13.5px] font-semibold text-slate-900">{a.label}</p>
                  <span className={cx("rounded-full px-1.5 py-px text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset", sev.chip)}>
                    {sev.word}
                  </span>
                  <span className="ml-auto text-[18px] font-semibold leading-none text-slate-900 tabular-nums">{a.count}</span>
                </div>
                <ul className="mt-2 divide-y divide-slate-100">
                  {a.items.map((i) => (
                    <li key={`${a.type}-${i.href}-${i.title}`}>
                      <Link href={i.href} className="block py-1.5 hover:text-blue-700">
                        <span className="block truncate text-[13px] font-medium text-slate-800">{i.title}</span>
                        <span className="block truncate text-[11.5px] text-slate-500">{i.sub}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {a.count > a.items.length && (
                  <Link href={ALL_HREF[a.type]} className="mt-1 inline-flex text-[12px] font-semibold text-blue-700 hover:underline">
                    See all {a.count} →
                  </Link>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
