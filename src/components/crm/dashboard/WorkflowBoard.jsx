/**
 * The live workflow board on /crm: the nine pipeline stages, grouped into
 * five columns (new → collection → lab → report → done) so the board stays
 * readable at desktop width instead of nine slivers. On a phone the five
 * columns scroll sideways and snap one at a time.
 *
 * Each stage shows its count, how long the oldest booking has waited in it,
 * and the few longest-waiting bookings with the badges that explain why they
 * matter (unpaid, lab has not accepted, report overdue). Server component —
 * every number arrives from pipelineCounts()/pipelineItems().
 */
import Link from "next/link";

import { BOOKING_STATUS, bookingCode } from "@/lib/crm/constants";
import { waited } from "@/lib/crm/sla";
import { cx } from "@/components/crm/ui";

const GROUPS = [
  { key: "new", label: "New", stages: ["booked", "confirmed"] },
  { key: "collection", label: "Collection", stages: ["collection_assigned", "sample_collected"] },
  { key: "lab", label: "In lab", stages: ["sample_received", "processing"] },
  { key: "report", label: "Report", stages: ["report_ready", "report_delivered"] },
  { key: "done", label: "Done", stages: ["completed"] },
];

const DOT = {
  slate: "bg-slate-400",
  blue: "bg-blue-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  teal: "bg-teal-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

/** What "waiting" means in each stage, for the oldest-age line. */
const WAIT_WORD = {
  booked: "since booking",
  confirmed: "since booking",
  collection_assigned: "since booking",
  sample_collected: "since collection",
  sample_received: "since received",
  processing: "in processing",
  report_ready: "since report",
  report_delivered: "since delivery",
};

function Mini({ children, tone }) {
  const tones = {
    amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/15",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
    orange: "bg-orange-50 text-orange-700 ring-orange-600/15",
  };
  return (
    <span className={cx("whitespace-nowrap rounded px-1 py-px text-[10.5px] font-semibold ring-1 ring-inset", tones[tone])}>{children}</span>
  );
}

function itemBadges(b, showMoney) {
  const out = [];
  if (b.overdue) out.push(<Mini key="od" tone="rose">Report overdue</Mini>);
  if (b.collection_late) out.push(<Mini key="cl" tone="rose">Collection date passed</Mini>);
  if (b.partner_status === "pending") out.push(<Mini key="pp" tone="amber">Lab not accepted</Mini>);
  if (showMoney && ["pending", "partial", "failed"].includes(b.payment_status) && ["report_ready", "report_delivered"].includes(b.status)) {
    out.push(<Mini key="pay" tone="orange">Unpaid</Mini>);
  }
  if (b.source === "website" && ["booked", "confirmed"].includes(b.status)) out.push(<Mini key="web" tone="blue">Online</Mini>);
  return out.slice(0, 2);
}

function Stage({ stageKey, stage, items, completedToday, showMoney }) {
  const meta = BOOKING_STATUS[stageKey];
  const done = stageKey === "completed";
  const count = done ? completedToday : stage.n;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-slate-700">
          <span aria-hidden className={cx("h-2 w-2 shrink-0 rounded-full", DOT[meta.tone] ?? DOT.slate)} />
          <span className="truncate">{meta.label}</span>
        </p>
        <span className="text-[20px] font-semibold leading-none text-slate-900 tabular-nums">{count}</span>
      </div>
      <p className="mt-1 text-[11.5px] text-slate-500">
        {done ? "completed today" : count && stage.oldestMin !== null ? `Oldest ${waited(stage.oldestMin)} ${WAIT_WORD[stageKey]}` : "Nothing waiting"}
      </p>

      {!done && items.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {items.map((b) => {
            const badges = itemBadges(b, showMoney);
            return (
              <li key={b.id}>
                <Link
                  href={`/crm/bookings/${b.id}`}
                  className="block rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-200/80 transition-colors hover:ring-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[11.5px] font-semibold text-slate-500">{bookingCode(b.id)}</span>
                    <span className="text-[11.5px] font-medium text-slate-600 tabular-nums">{waited(b.wait_min)}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] font-medium text-slate-900">{b.patient_name}</span>
                  {badges.length > 0 && <span className="mt-1 flex flex-wrap gap-1">{badges}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {count > 0 && (
        <Link
          href={`/crm/bookings?status=${stageKey}${done ? "&range=today" : ""}`}
          className="mt-2 inline-flex text-[12px] font-semibold text-blue-700 hover:underline"
        >
          View all{!done && count > items.length ? ` ${count}` : ""} →
        </Link>
      )}
    </div>
  );
}

export default function WorkflowBoard({ pipeline, items, showMoney = false }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scroll-snap-type:x_mandatory] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
      <div className="grid w-max grid-flow-col gap-3 [grid-auto-columns:min(80vw,17rem)] lg:w-auto lg:grid-flow-row lg:grid-cols-5 lg:[grid-auto-columns:auto]">
        {GROUPS.map((g) => {
          const total = g.stages.reduce((s, k) => s + (k === "completed" ? pipeline.completedToday : pipeline.stages[k]?.n ?? 0), 0);
          return (
            <section key={g.key} className="min-w-0 [scroll-snap-align:start]" aria-label={`${g.label} stages`}>
              <h3 className="mb-2 flex items-center justify-between px-0.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                {g.label}
                <span className="tabular-nums normal-case tracking-normal text-slate-400">{total}</span>
              </h3>
              <div className="space-y-2.5">
                {g.stages.map((k) => (
                  <Stage
                    key={k}
                    stageKey={k}
                    stage={pipeline.stages[k] ?? { n: 0, oldestMin: null }}
                    items={(items[k] ?? []).slice(0, 3)}
                    completedToday={pipeline.completedToday}
                    showMoney={showMoney}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
