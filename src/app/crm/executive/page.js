import Link from "next/link";
import {
  BadgeIndianRupee,
  ClipboardList,
  FileClock,
  FlaskConical,
  Percent,
  TestTube2,
  UserPlus,
  Wallet,
} from "lucide-react";

import ColumnChart from "@/components/crm/dashboard/ColumnChart";
import { BarList, Meter } from "@/components/crm/dashboard/parts";
import { Badge, Card, DataTable, EmptyState, KpiCard, PageHeader, cx } from "@/components/crm/ui";
import { change, hours, num, pct, rupees, rupeesShort } from "@/lib/crm/format";
import { requirePerm } from "@/lib/crm/guard";
import { computeAlerts } from "@/lib/crm/sla";
import { executiveData } from "@/lib/crm/stores/dashboard";

export const metadata = { title: "Owner overview" };
export const dynamic = "force-dynamic";

/**
 * The owner's command center — one screen that answers: how much came in
 * today and this month, what the business is earning on it, what is stuck
 * (samples, reports, lab acceptances, unpaid money), which labs are carrying
 * the work and how fast, and where the bookings come from.
 *
 * The one hero number is this month's revenue (money received, net of
 * refunds). Margin is an estimate: customer amount minus partner cost for
 * bookings whose report became ready this month.
 */
export default async function ExecutivePage() {
  await requirePerm("executive.view", "/crm/executive");

  const [d, [delayed]] = await Promise.all([executiveData(), computeAlerts({ limitPerType: 6, types: ["report_delayed"] })]);

  const monthDelta = change(d.revenueMonth, d.revenuePrevToDate);
  const icon = (Icon) => <Icon className="h-4 w-4" aria-hidden />;
  const p = d.pipeline;

  return (
    <>
      <PageHeader
        eyebrow="Owner overview"
        title="How the business stands"
        description="Money, work in progress, labs and cities — live from the operations data."
      />

      {/* Hero: this month's revenue, with the daily bars */}
      <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-[13px] font-medium text-slate-500">Revenue · {d.monthLabel}</p>
            <p className="mt-1 text-[48px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[56px]">{rupeesShort(d.revenueMonth)}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-1.5 text-[13px]">
              {monthDelta === null ? (
                <span className="font-semibold text-blue-700">First month with revenue</span>
              ) : (
                <span className={cx("font-semibold", monthDelta > 0 ? "text-emerald-700" : monthDelta < 0 ? "text-rose-700" : "text-slate-500")}>
                  <span aria-hidden>{monthDelta > 0 ? "▲" : monthDelta < 0 ? "▼" : "•"}</span> {Math.abs(monthDelta).toFixed(Math.abs(monthDelta) < 10 && monthDelta !== 0 ? 1 : 0)}%
                </span>
              )}
              <span className="text-slate-500">vs the same days of {d.prevLabel}</span>
            </p>
            <p className="mt-1 text-[12.5px] text-slate-500">
              {d.prevLabel} total {rupees(d.revenuePrevFull)} · today {rupees(d.revenueToday)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[12px] font-medium text-slate-500">Revenue by day, net of refunds</p>
            <ColumnChart data={d.daily} unit="rupees" label="Revenue" emptyText="No payments received this month yet" />
          </div>
        </div>
      </section>

      {/* The day and the queue */}
      <section aria-label="Today and open work" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Bookings today"
          value={num(d.bookingsToday)}
          current={d.bookingsToday}
          previous={d.bookingsYesterday}
          compareLabel="vs yesterday"
          icon={icon(ClipboardList)}
          href="/crm/bookings?range=today"
        />
        <KpiCard label="Revenue today" value={rupeesShort(d.revenueToday)} sub="received, net of refunds" icon={icon(BadgeIndianRupee)} tone="emerald" href="/crm/payments?range=today" />
        <KpiCard label="Samples pending" value={num(p.samplesPending)} sub="collected, not at the lab" icon={icon(TestTube2)} tone="indigo" href="/crm/samples" />
        <KpiCard
          label="Reports pending"
          value={num(p.reportsPending)}
          sub={delayed?.count ? `${num(delayed.count)} past due` : "none past due"}
          icon={icon(FileClock)}
          tone="amber"
          href="/crm/reports"
        />
        <KpiCard
          label="Partner orders pending"
          value={num(p.partnerPending + p.inLab)}
          sub={`${num(p.partnerPending)} to accept · ${num(p.inLab)} in lab`}
          icon={icon(FlaskConical)}
          tone="violet"
          href="/crm/bookings?partnerStatus=pending"
        />
        <KpiCard
          label="Payment pending"
          value={rupeesShort(p.due)}
          sub={`on ${num(p.dueCount)} open ${p.dueCount === 1 ? "booking" : "bookings"}`}
          icon={icon(Wallet)}
          tone="rose"
          href="/crm/bookings?payment=pending"
        />
        <KpiCard
          label="Leads today"
          value={num(d.leads.created)}
          sub={`${num(d.leads.converted)} converted today`}
          icon={icon(UserPlus)}
          tone="teal"
          href="/crm/leads?range=today"
        />
        <KpiCard
          label="Estimated margin"
          value={rupeesShort(d.margin.margin)}
          sub={d.margin.pct === null ? "no reports ready this month" : `${pct(d.margin.pct)} of ${rupeesShort(d.margin.gross)}`}
          icon={icon(Percent)}
          tone="blue"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <section aria-labelledby="exec-partners-h">
            <div className="mb-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 id="exec-partners-h" className="text-[14.5px] font-semibold tracking-tight text-slate-900">Lab partners</h2>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">
                  {num(d.partnerActivity.active)} of {num(d.partnerActivity.total)} active partners had an order in the last 30 days. Turnaround = sample received → report ready.
                </p>
              </div>
              <Link href="/crm/partners" className="shrink-0 text-[12.5px] font-semibold text-blue-700 hover:underline">
                All partners →
              </Link>
            </div>
            <div>
              <DataTable
                id="exec-partners"
                columns={[
                  { key: "name", label: "Partner" },
                  { key: "open", label: "Open orders", align: "right" },
                  { key: "pending", label: "To accept", align: "right" },
                  { key: "tat", label: "Avg turnaround", align: "right" },
                  { key: "orders", label: "Orders, 30 days", align: "right" },
                ]}
                rows={d.partners}
                rowHref={(r) => `/crm/partners/${r.id}`}
                cells={(r) => ({
                  name: (
                    <span>
                      {r.name}
                      {r.city && <span className="block text-[11.5px] font-normal text-slate-500">{r.city}</span>}
                    </span>
                  ),
                  open: num(r.open),
                  pending: r.pending ? <Badge tone="amber">{r.pending}</Badge> : "0",
                  tat: r.avgTat === null ? <span className="text-slate-400">—</span> : hours(r.avgTat),
                  orders: num(r.orders30),
                })}
                card={(r) => (
                  <Link href={`/crm/partners/${r.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14.5px] font-semibold text-slate-900">{r.name}</p>
                        <p className="text-[12px] text-slate-500">
                          Avg turnaround {r.avgTat === null ? "—" : hours(r.avgTat)} · {num(r.orders30)} orders in 30 days
                        </p>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="block text-[16px] font-semibold tabular-nums text-slate-900">{num(r.open)}</span>
                        <span className="block text-[11px] text-slate-500">open</span>
                      </p>
                    </div>
                    {r.pending > 0 && (
                      <p className="mt-2">
                        <Badge tone="amber">{r.pending} awaiting acceptance</Badge>
                      </p>
                    )}
                  </Link>
                )}
                empty={<EmptyState compact icon={<FlaskConical className="h-5 w-5" />} title="No active lab partners" hint="Add a partner to start sending orders to a lab." />}
              />
            </div>
          </section>

          <Card
            title="Delayed reports"
            description="Past the report due time, no report uploaded."
            actions={
              delayed?.count ? (
                <Link href="/crm/reports?tab=overdue" className="text-[12.5px] font-semibold text-blue-700 hover:underline">
                  All {num(delayed.count)} →
                </Link>
              ) : null
            }
          >
            {delayed?.items.length ? (
              <ul className="divide-y divide-slate-100">
                {delayed.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="flex items-center justify-between gap-3 py-2.5 hover:text-blue-700">
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium text-slate-800">{i.title}</span>
                        <span className="block truncate text-[12px] text-slate-500">{i.sub}</span>
                      </span>
                      <Badge tone="rose">Delayed</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact icon={<FileClock className="h-5 w-5" />} title="No delayed reports" hint="Every report in the lab is within its due time." />
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Top cities" description={`Bookings in ${d.monthLabel}`}>
            <BarList
              items={d.cities.map((c) => ({
                key: c.city,
                label: c.city,
                value: c.n,
                display: num(c.n),
                href: c.cityId ? `/crm/bookings?city=${c.cityId}&range=month` : undefined,
              }))}
              empty={<p className="text-[13px] text-slate-500">No bookings this month yet.</p>}
            />
          </Card>

          <Card title="Estimated margin" description={`${d.monthLabel}, reports ready`}>
            <p className="text-[26px] font-semibold leading-none tracking-tight text-slate-900">{rupees(d.margin.margin)}</p>
            <p className="mt-1.5 text-[12.5px] text-slate-500">
              {d.margin.pct === null ? "No bookings reached report-ready this month." : `${pct(d.margin.pct, 1)} margin on ${num(d.margin.count)} bookings`}
            </p>
            {d.margin.gross > 0 && (
              <>
                <div className="mt-3">
                  <Meter value={Math.max(0, d.margin.margin)} max={d.margin.gross} label="Margin share of customer amount" />
                </div>
                <dl className="mt-3 space-y-1 text-[12.5px]">
                  <div className="flex justify-between gap-3">
                    <dt className="flex items-center gap-1.5 text-slate-500">
                      <span aria-hidden className="h-2 w-2 rounded-full bg-[#2a78d6]" /> Margin
                    </dt>
                    <dd className="font-medium text-slate-900 tabular-nums">{rupees(d.margin.margin)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="flex items-center gap-1.5 text-slate-500">
                      <span aria-hidden className="h-2 w-2 rounded-full bg-blue-100 ring-1 ring-blue-200" /> Partner cost
                    </dt>
                    <dd className="font-medium text-slate-900 tabular-nums">{rupees(d.margin.cost)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-slate-100 pt-1">
                    <dt className="text-slate-500">Customer amount</dt>
                    <dd className="font-semibold text-slate-900 tabular-nums">{rupees(d.margin.gross)}</dd>
                  </div>
                </dl>
              </>
            )}
          </Card>

          <Card title="Leads today">
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                ["New", d.leads.created],
                ["Contacted", d.leads.contacted],
                ["Converted", d.leads.converted],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-2 py-2.5">
                  <dt className="text-[11.5px] font-medium text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-[20px] font-semibold leading-none text-slate-900 tabular-nums">{num(value)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
